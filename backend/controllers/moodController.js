const MoodEntry = require('../models/MoodEntry');
const { getMoodSuggestion, getWellnessScore } = require('../utils/wellness');

const addMoodEntry = async (req, res) => {
  const payload = {
    ...req.body,
    userId: req.user._id
  };

  payload.suggestion = getMoodSuggestion(payload);
  const entry = await MoodEntry.create(payload);

  res.status(201).json({
    message: 'Mood entry saved',
    entry,
    wellnessScore: getWellnessScore(payload)
  });
};

const getMoodEntries = async (req, res) => {
  const entries = await MoodEntry.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ count: entries.length, entries });
};

const getWeeklyStats = async (req, res) => {
  const entries = await MoodEntry.find({
    userId: req.user._id,
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  }).sort({ createdAt: 1 });

  const stats = {
    averageStress: average(entries.map((item) => item.stressLevel)),
    averageAnxiety: average(entries.map((item) => item.anxietyLevel)),
    averageSleep: average(entries.map((item) => item.sleepHours)),
    streak: calculateStreak(entries),
    entries
  };

  res.json(stats);
};

const getMonthlyStats = async (req, res) => {
  const entries = await MoodEntry.find({
    userId: req.user._id,
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  }).sort({ createdAt: 1 });

  res.json({
    averageStress: average(entries.map((item) => item.stressLevel)),
    averageAnxiety: average(entries.map((item) => item.anxietyLevel)),
    averageSleep: average(entries.map((item) => item.sleepHours)),
    wellnessScores: entries.map((item) => ({
      date: item.createdAt,
      score: getWellnessScore(item)
    })),
    entries
  });
};

const average = (numbers) => {
  if (!numbers.length) {
    return 0;
  }

  return Number((numbers.reduce((sum, value) => sum + value, 0) / numbers.length).toFixed(1));
};

const calculateStreak = (entries) => {
  const uniqueDays = [...new Set(entries.map((item) => new Date(item.createdAt).toDateString()))];
  return uniqueDays.length;
};

module.exports = {
  addMoodEntry,
  getMoodEntries,
  getWeeklyStats,
  getMonthlyStats
};
