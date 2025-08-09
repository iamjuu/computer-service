const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  customerNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'technician'],
    default: 'customer'
  },
  address: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate customer number before saving if not provided
userSchema.pre('save', async function(next) {
  if (!this.customerNumber && this.role === 'customer') {
    // Generate a customer number (format: CUST-XXXX)
    const count = await this.constructor.countDocuments({ role: 'customer' });
    this.customerNumber = `CUST-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
