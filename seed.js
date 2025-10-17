const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables with explicit path
const result = dotenv.config({ path: '.env' });

if (result.error) {
    console.error('❌ Error loading .env file:', result.error);
    process.exit(1);
}

// Debug: Check if MONGODB_URI is loaded
console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'Yes' : 'No');
if (process.env.MONGODB_URI) {
    console.log('Connection string:', process.env.MONGODB_URI.replace(/:(.*)@/, ':********@'));
} else {
    console.log('❌ MONGODB_URI is undefined!');
    console.log('Available environment variables:', Object.keys(process.env));
    process.exit(1);
}

const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Challenge = require('./models/Challenge');
const Badge = require('./models/Badge');

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
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
      },
      {
        name: 'Climate Warrior',
        description: 'Complete all climate lessons',
        icon: 'fas fa-cloud-sun',
        color: '#2196f3',
        criteria: { type: 'lessons', threshold: 3 }
      }
    ]);

    // Create lessons
    const lessons = await Lesson.insertMany([
      {
        title: 'Climate Change Fundamentals',
        description: 'Understand the causes and effects of climate change and how we can mitigate them.',
        category: 'climate',
        icon: 'fas fa-cloud-sun',
        content: `
          <h3>What is Climate Change?</h3>
          <p>Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change.</p>
          
          <h3>Key Impacts</h3>
          <ul>
            <li>Rising global temperatures</li>
            <li>Melting polar ice</li>
            <li>Sea level rise</li>
            <li>Extreme weather events</li>
          </ul>
          
          <h3>What You Can Do</h3>
          <ul>
            <li>Reduce energy consumption</li>
            <li>Use public transportation</li>
            <li>Support renewable energy</li>
            <li>Plant trees</li>
          </ul>
        `,
        totalPoints: 100,
        estimatedDuration: 30,
        difficulty: 'beginner',
        quizzes: [
          {
            question: 'What is the main cause of current climate change?',
            options: [
              'Natural climate cycles',
              'Human activities like burning fossil fuels',
              'Changes in solar radiation',
              'Volcanic eruptions'
            ],
            correctAnswer: 1,
            points: 25,
            explanation: 'Human activities, particularly burning fossil fuels, are the primary driver of current climate change.'
          }
        ]
      },
      {
        title: 'Waste Management & Recycling',
        description: 'Learn about proper waste segregation, recycling, and reducing waste.',
        category: 'waste',
        icon: 'fas fa-recycle',
        content: `
          <h3>The 3 R's of Waste Management</h3>
          <p><strong>Reduce:</strong> Minimize waste generation by using less</p>
          <p><strong>Reuse:</strong> Use items multiple times before disposal</p>
          <p><strong>Recycle:</strong> Process used materials into new products</p>
          
          <h3>Waste Segregation Guide</h3>
          <ul>
            <li><strong>Green Bin:</strong> Biodegradable waste (food scraps, garden waste)</li>
            <li><strong>Blue Bin:</strong> Recyclable waste (paper, plastic, metal, glass)</li>
            <li><strong>Red Bin:</strong> Hazardous waste (batteries, chemicals, electronics)</li>
          </ul>
        `,
        totalPoints: 100,
        estimatedDuration: 25,
        difficulty: 'beginner',
        quizzes: [
          {
            question: 'Which item should go in the recycling bin?',
            options: [
              'Food scraps',
              'Plastic bottles',
              'Used batteries',
              'Garden waste'
            ],
            correctAnswer: 1,
            points: 25,
            explanation: 'Plastic bottles are recyclable, while the other items require special handling.'
          }
        ]
      },
      {
        title: 'Biodiversity Conservation',
        description: 'Explore the importance of biodiversity and ecosystem conservation.',
        category: 'biodiversity',
        icon: 'fas fa-tree',
        content: `
          <h3>What is Biodiversity?</h3>
          <p>Biodiversity refers to the variety of life on Earth at all its levels, from genes to ecosystems.</p>
          
          <h3>Types of Biodiversity</h3>
          <ul>
            <li><strong>Genetic Diversity:</strong> Variety of genes within a species</li>
            <li><strong>Species Diversity:</strong> Variety of species within a habitat</li>
            <li><strong>Ecosystem Diversity:</strong> Variety of ecosystems in a region</li>
          </ul>
          
          <h3>Threats to Biodiversity</h3>
          <ul>
            <li>Habitat destruction</li>
            <li>Climate change</li>
            <li>Pollution</li>
            <li>Overexploitation</li>
          </ul>
        `,
        totalPoints: 150,
        estimatedDuration: 35,
        difficulty: 'intermediate',
        quizzes: [
          {
            question: 'Which of these is NOT a type of biodiversity?',
            options: [
              'Genetic diversity',
              'Species diversity',
              'Economic diversity',
              'Ecosystem diversity'
            ],
            correctAnswer: 2,
            points: 30,
            explanation: 'Economic diversity is not a type of biological diversity.'
          }
        ]
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
        verification: 'manual',
        isActive: true
      },
      {
        title: 'Energy Saver Week',
        description: 'Reduce your electricity consumption by 20% for one week.',
        category: 'weekly',
        points: 100,
        icon: 'fas fa-bolt',
        instructions: 'Turn off unused lights and appliances, use energy-efficient settings.',
        verification: 'photo',
        isActive: true
      },
      {
        title: 'Local Food Challenge',
        description: 'Eat only locally sourced food for one week.',
        category: 'weekly',
        points: 150,
        icon: 'fas fa-apple-alt',
        instructions: 'Purchase and consume food from local farmers and producers.',
        verification: 'manual',
        isActive: true
      },
      {
        title: 'Tree Planting Drive',
        description: 'Plant at least 5 trees in your community.',
        category: 'monthly',
        points: 200,
        icon: 'fas fa-tree',
        instructions: 'Plant trees in your neighborhood, school, or community area.',
        verification: 'photo',
        isActive: true
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
      ecoPoints: 450,
      completedChallenges: [
        {
          challenge: challenges[0]._id,
          completedAt: new Date(),
          pointsEarned: 50
        }
      ],
      lessonProgress: [
        {
          lesson: lessons[0]._id,
          progress: 80,
          completed: false,
          lastAccessed: new Date()
        },
        {
          lesson: lessons[1]._id,
          progress: 60,
          completed: false,
          lastAccessed: new Date()
        }
      ]
    });

    await User.create({
      username: 'teacher1',
      password: 'password123',
      role: 'teacher',
      profile: {
        firstName: 'Jane',
        lastName: 'Teacher',
        school: 'Green Valley School'
      },
      ecoPoints: 0
    });

    await User.create({
      username: 'student2',
      password: 'password123',
      role: 'student',
      profile: {
        firstName: 'Priya',
        lastName: 'Sharma',
        school: 'Eco Warriors Academy',
        grade: '9th Grade'
      },
      badges: [badges[0]._id, badges[1]._id],
      ecoPoints: 980,
      completedChallenges: [
        {
          challenge: challenges[0]._id,
          completedAt: new Date(),
          pointsEarned: 50
        },
        {
          challenge: challenges[1]._id,
          completedAt: new Date(),
          pointsEarned: 100
        },
        {
          challenge: challenges[2]._id,
          completedAt: new Date(),
          pointsEarned: 150
        }
      ],
      lessonProgress: [
        {
          lesson: lessons[0]._id,
          progress: 100,
          completed: true,
          lastAccessed: new Date()
        },
        {
          lesson: lessons[1]._id,
          progress: 100,
          completed: true,
          lastAccessed: new Date()
        },
        {
          lesson: lessons[2]._id,
          progress: 100,
          completed: true,
          lastAccessed: new Date()
        }
      ]
    });

    console.log('✅ Sample data seeded successfully!');
    console.log('\n👤 Demo Users Created:');
    console.log('   Student: username="student1", password="password123"');
    console.log('   Teacher: username="teacher1", password="password123"');
    console.log('   Top Student: username="student2", password="password123"');
    console.log('\n📚 Lessons Created: 3 interactive lessons');
    console.log('🌱 Challenges Created: 4 real-world challenges');
    console.log('🏆 Badges Created: 4 achievement badges');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();