const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
}, {
  timestamps: true
});

// Compound index to ensure one progress record per user-lesson/challenge
progressSchema.index({ user: 1, lesson: 1 }, { unique: true, sparse: true });
progressSchema.index({ user: 1, challenge: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Progress', progressSchema);