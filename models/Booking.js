// models/Booking.js
// Defines what a Booking looks like in the database

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

  // Link booking to a user (who made it)
  user: {
    type: mongoose.Schema.Types.ObjectId,  // MongoDB ID of the user
    ref: 'User',
    required: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  service: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  // Status of the booking
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Booking', bookingSchema);
