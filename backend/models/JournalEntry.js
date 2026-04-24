const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    moodTag: {
      type: String,
      default: 'reflective'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
