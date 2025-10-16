const express = require('express');
const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all challenges
router.get('/', auth, async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true });
    const challengesWithProgress = await Promise.all(
      challenges.map(async (challenge) => {
        const progress = await Progress.findOne({
          user: req.user._id,
          challenge: challenge._id
        });

        return {
          ...challenge.toObject(),
          userProgress: progress || { progress: 0, completed: false }
        };
      })
    );

    res.json(challengesWithProgress);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete challenge
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ message: 'Challenge not found or inactive' });
    }

    // Check if already completed
    const existingProgress = await Progress.findOne({
      user: req.user._id,
      challenge: challenge._id,
      completed: true
    });

    if (existingProgress) {
      return res.status(400).json({ message: 'Challenge already completed' });
    }

    // Create progress record
    const progress = new Progress({
      user: req.user._id,
      challenge: challenge._id,
      progress: 100,
      completed: true,
      completedAt: new Date(),
      pointsEarned: challenge.points
    });

    await progress.save();

    // Update user points and completed challenges
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { ecoPoints: challenge.points },
      $addToSet: { completedChallenges: challenge._id }
    });

    res.json({
      message: 'Challenge completed successfully',
      pointsEarned: challenge.points,
      progress
    });
  } catch (error) {
    console.error('Complete challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;