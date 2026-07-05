
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// run node seed.js before starting the server to add sample data to the database (admin user, services, etc.)
require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ MONGODB_URI is not set. Add it to your environment or .env file.');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅MongoDB connected successfully');
  } catch (err) {
    console.error('❌MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Make the logged-in user and admin existence flag available to all views
const { SECRET } = require('./middleware/authMiddleware');
const User = require('./models/User');

app.use(async (req, res, next) => {
  res.locals.user = null;
  res.locals.adminExists = false;

  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET);
      res.locals.user = decoded;
    } catch (err) {
      res.clearCookie('token');
    }
  }

  try {
    const exists = await User.exists({ isAdmin: true });
    res.locals.adminExists = !!exists;
  } catch (err) {
    console.log('Could not check admin existence:', err);
  }

  next();
});

// ── Routes ────────────────────────────────────────────────────
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
  });
}
