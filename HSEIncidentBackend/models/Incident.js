const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  location: String,
  category: String,
  subCategory: String,
  comment: String,
  email: String,
  imageBase64: String, 
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Incident', IncidentSchema);
