const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'special'],
    default: 'daily'
  },
  points: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    default: 'fas fa-tasks'
  },
  instructions: String,
  verification: {
    type: String,
    enum: ['auto', 'manual', 'photo'],
    default: 'auto'
  },
  startDate: Date,
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  maxCompletions: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);