const { doubleCsrf } = require('csrf-csrf');
const hpp = require('hpp');
const { sanitizeInput } = require('../utils/sanitization');

const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.SESSION_SECRET,
  cookieName: "x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  },
});

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  next();
};

module.exports = {
  csrfProtection: doubleCsrfProtection,
  generateToken,
  preventParamPollution: hpp(),
  sanitizeData: sanitizeMiddleware
};