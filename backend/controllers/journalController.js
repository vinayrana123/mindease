const JournalEntry = require('../models/JournalEntry');

const createNote = async (req, res) => {
  const note = await JournalEntry.create({
    userId: req.user._id,
    title: req.body.title,
    content: req.body.content,
    moodTag: req.body.moodTag
  });

  res.status(201).json({ message: 'Journal entry created', note });
};

const getNotes = async (req, res) => {
  const notes = await JournalEntry.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ count: notes.length, notes });
};

const deleteNote = async (req, res) => {
  const note = await JournalEntry.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!note) {
    return res.status(404).json({ message: 'Journal entry not found' });
  }

  res.json({ message: 'Journal entry deleted' });
};

const searchNotes = async (req, res) => {
  const query = req.query.q || '';
  const notes = await JournalEntry.find({
    userId: req.user._id,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { moodTag: { $regex: query, $options: 'i' } }
    ]
  }).sort({ createdAt: -1 });

  res.json({ count: notes.length, notes });
};

module.exports = { createNote, getNotes, deleteNote, searchNotes };
