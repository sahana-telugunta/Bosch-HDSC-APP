const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const { sendIncidentEmail } = require('../utils/mailer');

// Create incident
router.post('/', async (req, res) => {
  try {
    const {
      incidentArea,
      category,
      comment,
      imageBase64,
      email, // this is the reporter's email (logged-in user)
      reportingPersons = [],
    } = req.body;

    const incident = new Incident({
      location: incidentArea,
      category,
      comment,
      imageBase64,
      email,
      reportingPersons,
    });

    await incident.save();

    await sendIncidentEmail({
      to: Array.isArray(reportingPersons)
        ? reportingPersons.map(name =>`${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`
)
        : [],
      subject: 'New HSE Incident Reported',
      incident: {
        incidentArea,
        category,
        comment,
        reportingPersons,
        imageBase64,
        reportedBy: email, // pass reporter's email to email body
      },
      replyTo: email, // set reply-to
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
