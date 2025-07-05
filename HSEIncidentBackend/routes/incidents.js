const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

router.post('/', async (req, res) => {
  console.log('📩 Incoming incident:', req.body);

  try {
    const incident = new Incident(req.body);
    await incident.save();
    console.log('✅ Incident saved to DB');
    res.status(201).json({ message: 'Incident saved' });
  } catch (err) {
    console.error('❌ Error saving incident:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get all incidents
// GET incidents for a specific user
// GET /api/incidents/:email
router.get('/:email', async (req, res) => {
  const email = req.params.email;
  console.log('🔍 Fetching incidents for email:', email);

  try {
    const incidents = await Incident.find({ email }).sort({ createdAt: -1 });
    console.log(`✅ Found ${incidents.length} incidents for ${email}`);
    res.status(200).json(incidents);
  } catch (err) {
    console.error('❌ Error fetching incidents:', err.message);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
