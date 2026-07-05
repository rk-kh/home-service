// models/Service.js
// Defines what a Service looks like in the database

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Service', serviceSchema);
