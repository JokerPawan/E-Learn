const mongoose = require('mongoose');

// Temporary hardcoded connection string - replace with your actual one
const MONGODB_URI = 'mongodb+srv://elearn-user:Paw%40n9611@elearn-cluster.cluster0.mongodb.net/elearn?retryWrites=true&w=majority';

const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Challenge = require('./models/Challenge');
const Badge = require('./models/Badge');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log('Using connection string:', MONGODB_URI.replace(/:(.*)@/, ':********@'));
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lesson.deleteMany({});
    await Challenge.deleteMany({});
    await Badge.deleteMany({});

    console.log('Cleared existing data');

    // Create badges
    const badges = await Badge.insertMany([
      {
        name: 'Eco Beginner',
        description: 'Complete your first lesson',
        icon: 'fas fa-seedling',
        color: '#4caf50',
        criteria: { type: 'lessons', threshold: 1 }
      },
      {
        name: 'Challenge Champion',
        description: 'Complete 5 challenges',
        icon: 'fas fa-trophy',
        color: '#ff9800',
        criteria: { type: 'challenges', threshold: 5 }
      },
      {
        name: 'Point Collector',
        description: 'Earn 500 eco points',
        icon: 'fas fa-star',
        color: '#9c27b0',
        criteria: { type: 'points', threshold: 500 }
      }
    ]);

    // Create lessons
    const lessons = await Lesson.insertMany([
      {
        title: 'Climate Change Fundamentals',
        description: 'Understand the causes and effects of climate change and how we can mitigate them.',
        category: 'climate',
        icon: 'fas fa-cloud-sun',
        content: 'Climate change content here...',
        totalPoints: 100,
        estimatedDuration: 30,
        difficulty: 'beginner'
      },
      {
        title: 'Waste Management & Recycling',
        description: 'Learn about proper waste segregation, recycling, and reducing waste.',
        category: 'waste',
        icon: 'fas fa-recycle',
        content: 'Waste management content here...',
        totalPoints: 100,
        estimatedDuration: 25,
        difficulty: 'beginner'
      }
    ]);

    // Create challenges
    const challenges = await Challenge.insertMany([
      {
        title: 'Plastic-Free Day',
        description: 'Go one full day without using any single-use plastic items.',
        category: 'daily',
        points: 50,
        icon: 'fas fa-ban',
        instructions: 'Avoid plastic bags, bottles, straws, and packaging for 24 hours.',
        verification: 'manual'
      },
      {
        title: 'Energy Saver Week',
        description: 'Reduce your electricity consumption by 20% for one week.',
        category: 'weekly',
        points: 100,
        icon: 'fas fa-bolt',
        instructions: 'Turn off unused lights and appliances, use energy-efficient settings.',
        verification: 'photo'
      }
    ]);

    // Create sample users
    await User.create({
      username: 'student1',
      password: 'password123',
      role: 'student',
      profile: {
        firstName: 'John',
        lastName: 'Student',
        school: 'Green Valley School',
        grade: '8th Grade'
      },
      badges: [badges[0]._id],
      ecoPoints: 450
    });

    await User.create({
      username: 'teacher1',
      password: 'password123',
      role: 'teacher',
      profile: {
        firstName: 'Jane',
        lastName: 'Teacher',
        school: 'Green Valley School'
      }
    });

    console.log('✅ Sample data seeded successfully!');
    console.log('👤 Demo Users Created:');
    console.log('   Student: username="student1", password="password123"');
    console.log('   Teacher: username="teacher1", password="password123"');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();