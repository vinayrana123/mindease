const Booking = require('../models/Booking');
const Therapist = require('../models/Therapist');

const createAppointment = async (req, res) => {
  const therapist = await Therapist.findById(req.body.therapistId);

  if (!therapist || !therapist.approved) {
    return res.status(404).json({ message: 'Therapist is unavailable for booking' });
  }

  const booking = await Booking.create({
    userId: req.user._id,
    therapistId: req.body.therapistId,
    date: req.body.date,
    time: req.body.time,
    mode: req.body.mode,
    status: 'confirmed',
    notes: req.body.notes
  });

  const populated = await booking.populate('therapistId', 'name specialization fee photo');
  res.status(201).json({ message: 'Appointment booked', booking: populated });
};

const cancelBooking = async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json({ message: 'Booking cancelled', booking });
};

const rescheduleBooking = async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  booking.date = req.body.date || booking.date;
  booking.time = req.body.time || booking.time;
  booking.status = 'rescheduled';
  await booking.save();

  res.json({ message: 'Booking rescheduled', booking });
};

const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate('therapistId', 'name specialization fee photo')
    .sort({ createdAt: -1 });

  res.json({ count: bookings.length, bookings });
};

module.exports = {
  createAppointment,
  cancelBooking,
  rescheduleBooking,
  getUserBookings
};
