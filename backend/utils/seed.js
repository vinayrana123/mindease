require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Therapist = require('../models/Therapist');
const Resource = require('../models/Resource');

const run = async () => {
  await connectDB();

  await Promise.all([User.deleteMany(), Therapist.deleteMany(), Resource.deleteMany()]);

  await User.create({
    name: 'MindEase Admin',
    email: 'admin@mindease.com',
    password: 'Admin123!',
    role: 'admin',
    age: 34,
    gender: 'Prefer not to say'
  });

  await Therapist.insertMany([
    {
      name: 'Dr. Ananya Kapoor',
      specialization: ['Anxiety', 'Mindfulness', 'Burnout'],
      experience: 9,
      rating: 4.9,
      fee: 120,
      bio: 'Trauma-informed therapist focused on sustainable emotional regulation and workplace wellbeing.',
      approved: true,
      mode: ['online', 'offline'],
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
      availability: [
        { day: 'Mon', slots: ['09:00 AM', '01:00 PM'] },
        { day: 'Wed', slots: ['11:00 AM', '04:00 PM'] }
      ]
    },
    {
      name: 'Dr. Rhea Sen',
      specialization: ['Relationships', 'Depression', 'Youth Therapy'],
      experience: 7,
      rating: 4.8,
      fee: 95,
      bio: 'Warm, structured care for life transitions, emotional resilience, and relationship healing.',
      approved: true,
      mode: ['online'],
      photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80',
      availability: [
        { day: 'Tue', slots: ['10:00 AM', '03:00 PM'] },
        { day: 'Thu', slots: ['12:00 PM', '06:00 PM'] }
      ]
    }
  ]);

  await Resource.insertMany([
    {
      title: 'Resetting Your Nervous System in 5 Minutes',
      category: 'Meditation',
      content: 'Use grounding, box breathing, and a sensory check-in to regulate stress after intense work or conflict.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'How to Build a Sustainable Sleep Routine',
      category: 'Sleep',
      content: 'Align light exposure, caffeine timing, and wind-down rituals to improve rest and reduce emotional fatigue.',
      image: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  console.log('Seed complete');
  process.exit(0);
};

run();
