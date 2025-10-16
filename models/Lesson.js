const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
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
    enum: ['climate', 'waste', 'biodiversity', 'energy', 'water'],
    required: true
  },
  icon: {
    type: String,
    default: 'fas fa-leaf'
  },
  content: {
    type: String,
    required: true
  },
  videos: [String],
  quizzes: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    points: Number
  }],
  totalPoints: {
    type: Number,
    default: 100
  },
  estimatedDuration: Number, // in minutes
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);