const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      enum: ['online', 'offline'],
      required: true
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed', 'rescheduled'],
      default: 'confirmed'
    },
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
