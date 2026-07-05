// routes/authRoutes.js
// Handles user registration, login, logout

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/authController');

// Show pages
router.get('/signup',  controller.getSignup);
router.get('/login',   controller.getLogin);
router.get('/logout',  controller.logout);

// Handle form submissions
router.post('/signup', controller.postSignup);
router.post('/login',  controller.postLogin);

module.exports = router;
