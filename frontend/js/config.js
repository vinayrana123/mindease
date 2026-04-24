export const API_BASE_URL = window.localStorage.getItem('mindease_api_url') || 'http://localhost:5000/api';

export const DEMO_THERAPISTS = [
  {
    _id: 'demo-1',
    name: 'Dr. Ananya Kapoor',
    specialization: ['Anxiety', 'Mindfulness', 'Burnout'],
    experience: 9,
    rating: 4.9,
    fee: 120,
    bio: 'Trauma-informed therapist helping founders and professionals rebuild calm routines.',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80',
    approved: true,
    mode: ['online', 'offline'],
    availability: [
      { day: 'Mon', slots: ['09:00 AM', '01:00 PM'] },
      { day: 'Wed', slots: ['11:00 AM', '04:00 PM'] }
    ]
  },
  {
    _id: 'demo-2',
    name: 'Dr. Rhea Sen',
    specialization: ['Relationships', 'Depression', 'Youth Therapy'],
    experience: 7,
    rating: 4.8,
    fee: 95,
    bio: 'A warm, structured guide for emotional resilience, healing, and life transitions.',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80',
    approved: true,
    mode: ['online'],
    availability: [
      { day: 'Tue', slots: ['10:00 AM', '03:00 PM'] },
      { day: 'Thu', slots: ['12:00 PM', '06:00 PM'] }
    ]
  },
  {
    _id: 'demo-3',
    name: 'Dr. Meera Joshi',
    specialization: ['Sleep', 'Trauma Recovery', 'Stress'],
    experience: 11,
    rating: 4.9,
    fee: 135,
    bio: 'Specializes in sleep-supported therapy plans and regulation for chronic overwhelm.',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80',
    approved: true,
    mode: ['offline', 'online'],
    availability: [
      { day: 'Fri', slots: ['09:30 AM', '02:00 PM'] },
      { day: 'Sat', slots: ['10:00 AM', '12:00 PM'] }
    ]
  }
];

export const DEMO_RESOURCES = [
  {
    title: 'Resetting Your Nervous System in 5 Minutes',
    category: 'Meditation',
    content: 'A short grounding flow using breath pacing, sensory awareness, and posture release.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Workday Calm Toolkit',
    category: 'Stress Relief',
    content: 'Use this routine between meetings: stretch, unclench your jaw, hydrate, and reset expectations.',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Sleep Habits That Protect Mood',
    category: 'Sleep',
    content: 'A high-impact evening protocol covering screens, light, caffeine timing, and nervous system cues.',
    image: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?auto=format&fit=crop&w=900&q=80'
  }
];

export const DEMO_QUOTES = [
  'Small steps still count as healing.',
  'Rest is a strategy, not a reward.',
  'You do not need to solve everything today to make progress today.',
  'Calm can be practiced, even before it is felt.'
];
