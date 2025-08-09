const Bill = require('../models/Bill');
const mongoose = require('mongoose');

// @desc    Create new bill
// @route   POST /api/bills
// @access  Public
const createBill = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    console.log(req.body,'data is here')
    const { recipientName, total, spareParts, warrantyStarting, warrantyEnding } = req.body;

    // Validation
    if (!recipientName) {
      return res.status(400).json({ message: 'Recipient name is required' });
    }
    

    const newBill = new Bill({
      recipientName,
      total: parseFloat(total) || 0,
      spareParts: Array.isArray(spareParts) ? spareParts.filter(part => part.description && part.description.trim() !== '') : [],
      warrantyStarting: warrantyStarting ? new Date(warrantyStarting) : null,
      warrantyEnding: warrantyEnding ? new Date(warrantyEnding) : null,
    });

    const savedBill = await newBill.save();
console.log(savedBill,'savedBill')
    res.status(201).json({
      message: 'Bill added successfully',
      data: savedBill,
    });
  } catch (error) {
    console.error('Error adding bill:', error);
    res.status(500).json({
      message: 'Failed to add bill',
      error: error.message,
    });
  }
};

module.exports = {
  createBill
}; 