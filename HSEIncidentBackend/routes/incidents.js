const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const {
  sendIncidentEmail,
  sendReporterConfirmation,
} = require('../utils/mailer');

// Create incident
router.post('/', async (req, res) => {
  try {
    const {
      incidentArea,
      category,
      description,
      imageBase64,
      email, // this is the reporter's email (logged-in user)
      reportingPersons = [],
    } = req.body;

    const incident = new Incident({
      location: incidentArea,
      category,
      description,
      imageBase64,
      email,
      reportingPersons,
    });

    await incident.save();

    // Prepare recipient emails
    const recipientEmails = Array.isArray(reportingPersons)
      ? reportingPersons.map(name =>
          `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`
        )
      : [];

    // 1. Send to Reporting Persons
    await sendIncidentEmail({
      to: recipientEmails,
      subject: 'New HSE Incident Reported',
      incident: {
        incidentArea,
        category,
        description,
        reportingPersons,
        imageBase64,
      },
      replyTo: email, // logged-in user
    });

    // 2. Send confirmation to Reporter
    await sendReporterConfirmation({
      to: email,
      incident: {
        incidentArea,
        category,
        description,
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
    const incidents = await Incident.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    console.error('❌ Error fetching incidents:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
