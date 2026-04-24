const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    day: String,
    slots: [String]
  },
  { _id: false }
);

const therapistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    specialization: {
      type: [String],
      default: []
    },
    experience: {
      type: Number,
      default: 1
    },
    rating: {
      type: Number,
      default: 4.8
    },
    fee: {
      type: Number,
      default: 80
    },
    bio: String,
    availability: {
      type: [availabilitySchema],
      default: []
    },
    photo: String,
    approved: {
      type: Boolean,
      default: false
    },
    mode: {
      type: [String],
      enum: ['online', 'offline'],
      default: ['online']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Therapist', therapistSchema);
