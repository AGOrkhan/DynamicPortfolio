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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL],
      frameSrc: ["'none'"] 
    }
  },
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
  crossOriginOpenerPolicy: process.env.NODE_ENV === 'production',
  hidePoweredBy: true,
  hsts: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
}));

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
app.use(cors({
  origin: process.env.NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://127.0.0.1:5173']
    : process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Added PUT/DELETE for admin commands
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