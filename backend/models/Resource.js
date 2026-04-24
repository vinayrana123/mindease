const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    image: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
