const User = require('../models/User');
const Booking = require('../models/Booking');
const Therapist = require('../models/Therapist');
const MoodEntry = require('../models/MoodEntry');
const Resource = require('../models/Resource');

const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ count: users.length, users });
};

const getBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate('userId', 'name email')
    .populate('therapistId', 'name specialization')
    .sort({ createdAt: -1 });

  res.json({ count: bookings.length, bookings });
};

const getAnalytics = async (req, res) => {
  const [userCount, therapistCount, bookingCount, moodCount, resourceCount, pendingTherapists] = await Promise.all([
    User.countDocuments(),
    Therapist.countDocuments(),
    Booking.countDocuments(),
    MoodEntry.countDocuments(),
    Resource.countDocuments(),
    Therapist.countDocuments({ approved: false })
  ]);

  res.json({
    metrics: {
      users: userCount,
      therapists: therapistCount,
      bookings: bookingCount,
      moodEntries: moodCount,
      resources: resourceCount,
      pendingTherapists
    }
  });
};

module.exports = { getUsers, getBookings, getAnalytics };
