const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  email: String,
  location: String,
  category: String,
  comment: String,
  imageBase64: String,
  reportingPersons: [String], // ✅ NEW FIELD (Array of names)
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Incident', incidentSchema);
