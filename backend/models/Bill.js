const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true,
    trim: true
  },
  customerNumber: {
    type: String,
    trim: true,
    default: ''
  },
  total: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  spareParts: [{
    description: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      min: 0,
      default: 0
    }
  }],
  warrantyStarting: {
    type: Date,
    default: null
  },
  warrantyEnding: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);