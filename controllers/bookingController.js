// controllers/bookingController.js
// Full CRUD for Bookings (Create, Read, Update, Delete)

const Booking = require('../models/Booking');
const Service = require('../models/Service');

// ── READ - Get All Bookings (Dashboard) ───────────────────────
exports.getAllBookings = async (req, res) => {
  try {
    // Only show bookings that belong to the logged-in user
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.render('bookings/index', {
      title: 'My Bookings',
      bookings,
      user: req.user,
      message: null
    });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

// ── CREATE - Show Booking Form ────────────────────────────────
exports.getCreate = async (req, res) => {
  try {
    const services = await Service.find();  // get services for dropdown
    const selectedService = req.query.service || '';
    res.render('bookings/create', {
      title: 'New Booking',
      services,
      user: req.user,
      error: null,
      selectedService
    });
  } catch (err) {
    console.log(err);
    res.redirect('/bookings');
  }
};

// ── CREATE - Save New Booking to Database ─────────────────────
exports.postCreate = async (req, res) => {
  const { name, email, phone, service, address } = req.body;

  try {
    // Create and save the new booking
    const booking = new Booking({
      user: req.user.id,    // link to logged-in user
      name,
      email,
      phone,
      service,
      address
    });

    await booking.save();
    res.redirect('/bookings');  // go back to dashboard

  } catch (err) {
    console.log(err);
    const services = await Service.find();
    res.render('bookings/create', {
      title: 'New Booking',
      services,
      user: req.user,
      error: 'Could not save booking. Please try again.'
    });
  }
};

// ── UPDATE - Show Edit Form ───────────────────────────────────
exports.getEdit = async (req, res) => {
  try {
    // Find the booking by ID
    const booking  = await Booking.findById(req.params.id);
    const services = await Service.find();

    // Make sure the booking belongs to this user
    if (!booking || booking.user.toString() !== req.user.id) {
      return res.redirect('/bookings');
    }

    res.render('bookings/edit', {
      title: 'Edit Booking',
      booking,
      services,
      user: req.user,
      error: null
    });
  } catch (err) {
    console.log(err);
    res.redirect('/bookings');
  }
};

// ── UPDATE - Save Changes to Database ────────────────────────
exports.postEdit = async (req, res) => {
  const { name, email, phone, service, address, status } = req.body;

  try {
    // Find booking and update its fields
    await Booking.findByIdAndUpdate(req.params.id, {
      name, email, phone, service, address, status
    });

    res.redirect('/bookings');

  } catch (err) {
    console.log(err);
    res.redirect('/bookings');
  }
};

// ── DELETE - Remove Booking from Database ─────────────────────
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    // Only delete if the booking belongs to this user
    if (booking && booking.user.toString() === req.user.id) {
      await Booking.findByIdAndDelete(req.params.id);
    }

    res.redirect('/bookings');
  } catch (err) {
    console.log(err);
    res.redirect('/bookings');
  }
};
