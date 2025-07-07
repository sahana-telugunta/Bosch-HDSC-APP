const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },

  // 🔐  Reset‑password fields  ─────────────────────────────
  resetCode: String,          // 6‑digit numeric code
  resetCodeExpires: Date,     // expiry timestamp
});

module.exports = mongoose.model('User', userSchema);
