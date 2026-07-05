// routes/adminRoutes.js
// Admin registration and dashboard

const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin registration (only allowed if no admin exists)
router.get('/register', controller.getRegister);
router.post('/register', controller.postRegister);

// Admin login (separate from regular login)
router.get('/login', controller.getLogin);
router.post('/login', controller.postLogin);

// Admin dashboard - protected + admin only
router.get('/', protect, adminOnly, controller.getDashboard);

// Admin debug endpoint (shows counts and latest documents)
router.get('/debug', protect, adminOnly, controller.getDebug);

// Admin pages to view all users and bookings
router.get('/users', protect, adminOnly, controller.getUsers);
router.get('/bookings', protect, adminOnly, controller.getBookings);

module.exports = router;
