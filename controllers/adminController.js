// controllers/adminController.js
const User = require('../models/User');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/authMiddleware');

exports.getRegister = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      // Admin already exists - redirect to login
      return res.redirect('/auth/login');
    }
    res.render('admin/register', { title: 'Admin Register', error: null });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

exports.postRegister = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.render('admin/register', { title: 'Admin Register', error: 'Passwords do not match.' });
  }

  try {
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      return res.render('admin/register', { title: 'Admin Register', error: 'An admin already exists.' });
    }

    // Also ensure email not used
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.render('admin/register', { title: 'Admin Register', error: 'Email already registered.' });
    }

    const admin = new User({ name, email, password, isAdmin: true });
    await admin.save();

    // Log admin in by setting JWT with isAdmin true
    const token = jwt.sign(
      { id: admin._id, name: admin.name, email: admin.email, isAdmin: true },
      SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/admin');
  } catch (err) {
    console.log(err);
    res.render('admin/register', { title: 'Admin Register', error: 'Something went wrong.' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const bookings = await Booking.find().populate('user').sort({ createdAt: -1 });

    const totalUsers = users.length;
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed').length;
    const recentBookings = bookings.slice(0, 5);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      users,
      bookings,
      totalUsers,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      recentBookings,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

// ── Show Admin Login Page ────────────────────────────────────
exports.getLogin = (req, res) => {
  res.render('admin/login', { title: 'Admin Login', error: null });
};

// ── Handle Admin Login ───────────────────────────────────────
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email });
    if (!admin) {
      return res.render('admin/login', { title: 'Admin Login', error: 'Email not found.' });
    }

    // Must be an admin account
    if (!admin.isAdmin) {
      return res.render('admin/login', { title: 'Admin Login', error: 'Not an admin account.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.render('admin/login', { title: 'Admin Login', error: 'Wrong password.' });
    }

    // Create token with isAdmin flag
    const token = jwt.sign(
      { id: admin._id, name: admin.name, email: admin.email, isAdmin: true },
      SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/admin');

  } catch (err) {
    console.log(err);
    res.render('admin/login', { title: 'Admin Login', error: 'Something went wrong.' });
  }
};

// ── Admin debug endpoint ─────────────────────────────────────
exports.getDebug = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    const latestUser = await User.findOne().sort({ createdAt: -1 }).lean();
    const latestBooking = await Booking.findOne().sort({ createdAt: -1 }).populate('user').lean();

    return res.json({ usersCount, bookingsCount, latestUser, latestBooking });
  } catch (err) {
    console.log('Debug error:', err);
    return res.status(500).json({ error: 'Could not retrieve debug information.' });
  }
};

// ── List all registered users (admin view) ─────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', { title: 'Admin - Users', users, user: req.user });
  } catch (err) {
    console.log('Error fetching users:', err);
    res.redirect('/admin');
  }
};

// ── List all bookings (admin view) ────────────────────────────────────────
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').sort({ createdAt: -1 });
    res.render('admin/bookings', { title: 'Admin - Bookings', bookings, user: req.user });
  } catch (err) {
    console.log('Error fetching bookings:', err);
    res.redirect('/admin');
  }
};
