// middleware/authMiddleware.js
// Protects routes - only logged-in users can access them

const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'homeservice_secret_key_123';

// ── Middleware function ───────────────────────────────────────
// This runs BEFORE the controller on protected routes
function protect(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
}

// ── Admin-only middleware ─────────────────────────────────────
// Ensures the logged-in user is an admin
function adminOnly(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  return res.status(403).send('Access denied. Admins only.');
}

module.exports = { protect, SECRET, adminOnly };
