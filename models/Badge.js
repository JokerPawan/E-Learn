const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#ff9800'
  },
  criteria: {
    type: {
      type: String,
      enum: ['points', 'challenges', 'lessons', 'streak'],
      required: true
    },
    threshold: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);