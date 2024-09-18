// models/feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
