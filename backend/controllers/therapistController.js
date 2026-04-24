const Therapist = require('../models/Therapist');

const getTherapists = async (req, res) => {
  const query = {};

  if (req.query.specialty) {
    query.specialization = { $in: [req.query.specialty] };
  }

  if (req.query.approvedOnly !== 'false') {
    query.approved = true;
  }

  const therapists = await Therapist.find(query).sort({ rating: -1, experience: -1 });
  res.json({ count: therapists.length, therapists });
};

const getTherapistById = async (req, res) => {
  const therapist = await Therapist.findById(req.params.id);

  if (!therapist) {
    return res.status(404).json({ message: 'Therapist not found' });
  }

  res.json({ therapist });
};

const addTherapist = async (req, res) => {
  const therapist = await Therapist.create(req.body);
  res.status(201).json({ message: 'Therapist added', therapist });
};

const updateTherapist = async (req, res) => {
  const therapist = await Therapist.findById(req.params.id);

  if (!therapist) {
    return res.status(404).json({ message: 'Therapist not found' });
  }

  Object.assign(therapist, req.body);
  await therapist.save();

  res.json({ message: 'Therapist updated', therapist });
};

module.exports = {
  getTherapists,
  getTherapistById,
  addTherapist,
  updateTherapist
};
