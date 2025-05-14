const express = require('express');
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, 'env', `.env.${process.env.NODE_ENV || 'development'}`)
});
const validateEnv = require('./config/validateEnv');
validateEnv();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const session = require('express-session');
const { csrfProtection, preventParamPollution, sanitizeData } = require('./utils/security');
const pool = require('./config/database');

// Import routes
const contactRoutes = require('./routes/contact');
const scheduleRoutes = require('./routes/schedule');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT;

// Trust Nginx proxy
app.set('trust proxy', process.env.NODE_ENV === 'production' ? '10.147.17.123' : false);

// Libraries 
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(
  helmet({
    // Hide framework (optional)
    hidePoweredBy: true,
    // Set DNS prefetch control
    dnsPrefetchControl: { allow: true },
    // Frame protection (you can also customize this)
    frameguard: { action: "sameorigin" },
    // IE no open file protection
    ieNoOpen: true,
    // MIME sniffing protection
    noSniff: true,
    // Cross-domain policies
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    // Referrer policy
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://static.cloudflareinsights.com",
        ],
        connectSrc: [
          "'self'",
          "https://khanhosting.com",
          "https://www.google-analytics.com",
          "https://region1.google-analytics.com",
          "https://cloudflareinsights.com",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://www.google-analytics.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // needed for Google Fonts & inline Tailwind classes
          "https://fonts.googleapis.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [], // enforce HTTPS
      },
    },
  })
);


app.use(compression({
  level: 6,
  threshold: 100 * 1000, // 100kb
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Add cookie security
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL.split(',');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Security 
app.use(sanitizeData);
app.use(preventParamPollution);

// Rate limiting (after sanitization for clean data)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // IP request limit
  message: 'Too many requests, please try again later.',
  standardHeaders: true, 
  legacyHeaders: false
});

app.use('/api/', limiter);

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/admin', adminRoutes);

// Public routes
app.get('/api/projects', async (req, res) => {
  try {
    const [projects] = await pool.execute(
      'SELECT * FROM projects WHERE is_archived = false ORDER BY created_at DESC'
    );
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Serve static files (uploaded images)
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));


// Client-side routing
app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error' 
  });
});

// 404 handling
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});