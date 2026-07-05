// controllers/authController.js
// Handles user registration, login, and logout

const User = require('../models/User');
const jwt  = require('jsonwebtoken');
const { SECRET } = require('../middleware/authMiddleware');

// ── Show Signup Page ──────────────────────────────────────────
exports.getSignup = (req, res) => {
  res.render('signup', { title: 'Sign Up', error: null });
};

// ── Handle Signup Form ────────────────────────────────────────
exports.postSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check passwords match
  if (password !== confirmPassword) {
    return res.render('signup', {
      title: 'Sign Up',
      error: 'Passwords do not match!'
    });
  }

  try {
    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', {
        title: 'Sign Up',
        error: 'Email already registered. Please login.'
      });
    }

    // Create new user - password is hashed automatically (see User model)
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Redirect to login after successful signup
    res.redirect('/auth/login');

  } catch (err) {
    console.log(err);
    res.render('signup', { title: 'Sign Up', error: 'Something went wrong. Try again.' });
  }
};

// ── Show Login Page ───────────────────────────────────────────
exports.getLogin = (req, res) => {
  res.render('login', { title: 'Login', error: null });
};

// ── Handle Login Form ─────────────────────────────────────────
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { title: 'Login', error: 'Email not found.' });
    }

    // Compare entered password with hashed password in database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { title: 'Login', error: 'Wrong password.' });
    }

    // Prevent admin accounts from logging in via the regular login form
    if (user.isAdmin) {
      return res.render('login', { title: 'Login', error: 'Admin users must sign in via the Admin Login button.' });
    }

    // ✅ Login successful - create a JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      SECRET,
      { expiresIn: '1d' }
    );

    // Save token in a cookie so browser sends it on every request
    res.cookie('token', token, {
      httpOnly: true,   // JS cannot read this cookie (security)
      maxAge: 24 * 60 * 60 * 1000  // 1 day in milliseconds
    });

    // Redirect to bookings dashboard
    res.redirect('/bookings');

  } catch (err) {
    console.log(err);
    res.render('login', { title: 'Login', error: 'Something went wrong. Try again.' });
  }
};

// ── Logout ────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.clearCookie('token');   // delete the JWT cookie
  res.redirect('/');
};
