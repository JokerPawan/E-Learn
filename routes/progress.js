const express = require('express');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('badges')
      .populate('completedChallenges');

    // Get progress for all lessons and challenges
    const lessonProgress = await Progress.find({
      user: req.user._id,
      lesson: { $exists: true }
    }).populate('lesson');

    const challengeProgress = await Progress.find({
      user: req.user._id,
      challenge: { $exists: true }
    }).populate('challenge');

    // Calculate stats
    const completedChallenges = challengeProgress.filter(p => p.completed).length;
    const totalPoints = user.ecoPoints;
    const badgesEarned = user.badges.length;

    // Calculate rank (simplified - based on points)
    const userCount = await User.countDocuments({ ecoPoints: { $gt: user.ecoPoints } });
    const currentRank = userCount + 1;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        profile: user.profile
      },
      stats: {
        ecoPoints: totalPoints,
        currentRank,
        completedChallenges,
        badgesEarned
      },
      progress: {
        lessons: lessonProgress,
        challenges: challengeProgress
      },
      nextLevel: {
        name: 'Eco Warrior',
        requiredPoints: 500,
        currentPoints: totalPoints,
        progress: Math.min(100, Math.round((totalPoints / 500) * 100))
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;