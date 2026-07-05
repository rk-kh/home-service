// controllers/pageController.js
// Controls the public pages: Home, About, Services

const Service = require('../models/Service');

// ── Home Page ─────────────────────────────────────────────────
exports.getHome = async (req, res) => {
  try {
    // Get first 3 services from database to show on home page
    const services = await Service.find().limit(3);
    res.render('home', { title: 'Home', services });
  } catch (err) {
    console.log(err);
    res.render('home', { title: 'Home', services: [] });
  }
};

// ── About Page ────────────────────────────────────────────────
exports.getAbout = (req, res) => {
  res.render('about', { title: 'About Us' });
};

// ── Services Page ─────────────────────────────────────────────
exports.getServices = async (req, res) => {
  try {
    // Get all services from database
    const services = await Service.find();
    res.render('services', { title: 'Our Services', services });
  } catch (err) {
    console.log(err);
    res.render('services', { title: 'Our Services', services: [] });
  }
};
