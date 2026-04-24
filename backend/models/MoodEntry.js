const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mood: {
      type: String,
      required: true
    },
    stressLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    anxietyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    sleepHours: {
      type: Number,
      required: true,
      min: 0,
      max: 24
    },
    note: String,
    suggestion: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
