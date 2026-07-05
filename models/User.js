// models/User.js
// Defines what a User looks like in the database

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// Schema = blueprint for a User document
const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,   // name is required
    trim: true        // removes extra spaces
  },

  email: {
    type: String,
    required: true,
    unique: true,     // no two users can have same email
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now  // automatically set to current time
  }

});

// ── Hash password before saving to database ───────────────────
// This runs automatically before every save()
userSchema.pre('save', async function (next) {
  // Only hash if password was changed (avoid double hashing)
  if (!this.isModified('password')) return next();

  // 10 = salt rounds (higher = more secure but slower)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ── Method to compare passwords at login ─────────────────────
// Usage: user.comparePassword('enteredPassword')
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
