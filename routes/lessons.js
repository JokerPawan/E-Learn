const express = require('express');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all lessons
router.get('/', auth, async (req, res) => {
  try {
    const lessons = await Lesson.find();
    const lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson) => {
        const progress = await Progress.findOne({
          user: req.user._id,
          lesson: lesson._id
        });
        
        return {
          ...lesson.toObject(),
          progress: progress ? progress.progress : 0,
          completed: progress ? progress.completed : false
        };
      })
    );

    res.json(lessonsWithProgress);
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single lesson
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const progress = await Progress.findOne({
      user: req.user._id,
      lesson: lesson._id
    });

    res.json({
      ...lesson.toObject(),
      userProgress: progress || { progress: 0, completed: false }
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lesson progress
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { progress, completed, pointsEarned } = req.body;
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    let progressRecord = await Progress.findOne({
      user: req.user._id,
      lesson: lesson._id
    });

    if (progressRecord) {
      progressRecord.progress = progress;
      progressRecord.completed = completed;
      if (completed) {
        progressRecord.completedAt = new Date();
        progressRecord.pointsEarned = pointsEarned || lesson.totalPoints;
      }
    } else {
      progressRecord = new Progress({
        user: req.user._id,
        lesson: lesson._id,
        progress,
        completed,
        pointsEarned: completed ? (pointsEarned || lesson.totalPoints) : 0
      });
    }

    await progressRecord.save();

    // Update user points if completed
    if (completed && pointsEarned) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { ecoPoints: pointsEarned }
      });
    }

    res.json(progressRecord);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;