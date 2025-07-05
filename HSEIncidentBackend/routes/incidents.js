const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const sendIncidentEmail = require('../utils/mailer');


// Create incident
router.post('/', async (req, res) => {
  try {
    const {
      incidentArea, // sent from frontend
      category,
      comment,
      imageBase64,
      email,
      reportingPersons = [],
    } = req.body;

    const incident = new Incident({
      location: incidentArea,        // Map to DB field "location"
      category,
      comment,
      imageBase64,
      email,
      reportingPersons,
    });

    await incident.save();

    // Compose and send email
    await sendIncidentEmail({
      to: Array.isArray(reportingPersons)
        ? reportingPersons.map(name =>
  `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`
)
        : [],
      subject: 'New HSE Incident Reported',
      incident: {
        incidentArea,
        category,
        comment,
        reportingPersons,
        imageBase64,
      },
    });


    res.status(201).json({ message: 'Incident saved' });
  } catch (err) {
    console.error('❌ Error saving incident:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get incidents by user email
router.get('/:email', async (req, res) => {
  try {
    const incidents = await Incident.find({ email: req.params.email });
    res.json(incidents);
  } catch (err) {
    console.error('❌ Error fetching incidents:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
