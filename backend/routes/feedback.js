// routes/feedback.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

// Route to handle feedback submission
router.post('/submit', async (req, res) => {
  try {
    const { username, email, feedback } = req.body;

    // Create a new feedback entry
    const newFeedback = new Feedback({
      username,
      email,
      feedback
    });

    // Save to MongoDB
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

module.exports = router;
