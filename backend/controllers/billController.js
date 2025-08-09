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
    const { recipientName, customerNumber, total, spareParts, warrantyStarting, warrantyEnding } = req.body;

    // Validation
    if (!recipientName) {
      return res.status(400).json({ message: 'Recipient name is required' });
    }
    

    const newBill = new Bill({
      recipientName,
      customerNumber: customerNumber || '',
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

// @desc    Get total count of bills
// @route   GET /total-count
// @access  Public
const getTotalCount = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const totalCount = await Bill.countDocuments();
    
    res.status(200).json({
      totalCount: totalCount,
      message: 'Total count retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting total count:', error);
    res.status(500).json({
      message: 'Failed to get total count',
      error: error.message,
    });
  }
};

// @desc    Get total revenue from all bills
// @route   GET /total-revenue
// @access  Public
const getTotalRevenue = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    // Aggregate total revenue from all bills
    const result = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    
    res.status(200).json({
      totalRevenue: totalRevenue,
      message: 'Total revenue retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting total revenue:', error);
    res.status(500).json({
      message: 'Failed to get total revenue',
      error: error.message,
    });
  }
};


const getBillByPhoneNumber = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const { phoneNumber } = req.params;

    // Validate if phone number is provided
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    console.log('Searching for bills with phone number:', phoneNumber);

    // Debug: Check total bills in database
    const totalBills = await Bill.countDocuments();
    console.log('Total bills in database:', totalBills);

    // Debug: Check all customerNumbers in database
    const allCustomerNumbers = await Bill.find({}, { customerNumber: 1, recipientName: 1 }).limit(10);
    console.log('Sample customer numbers:', allCustomerNumbers);

    // Try multiple search strategies
    const searchQueries = [
      { customerNumber: phoneNumber }, // Exact match
      { customerNumber: { $regex: phoneNumber, $options: 'i' } }, // Case insensitive regex
      { customerNumber: { $regex: phoneNumber.replace(/\D/g, ''), $options: 'i' } }, // Only digits
    ];

    let bills = [];
    let searchMethod = '';

    // Try each search strategy
    for (let i = 0; i < searchQueries.length; i++) {
      bills = await Bill.find(searchQueries[i]);
      if (bills.length > 0) {
        searchMethod = `Search method ${i + 1}`;
        break;
      }
    }

    console.log(`Found ${bills.length} bills using: ${searchMethod || 'No method worked'}`);
    
    if (bills.length === 0) {
      // Return more helpful debugging info
      return res.status(404).json({ 
        message: 'No bills found for this phone number',
        data: [],
        debug: {
          searchedPhoneNumber: phoneNumber,
          totalBillsInDB: totalBills,
          sampleCustomerNumbers: allCustomerNumbers.map(b => b.customerNumber)
        }
      });
    }

    res.status(200).json({
      message: 'Bills retrieved successfully',
      data: bills,
      count: bills.length,
      searchMethod: searchMethod
    });
  } catch (error) {
    console.error('Error getting bills by phone number:', error);
    res.status(500).json({
      message: 'Failed to get bills',
      error: error.message,
    });
  }
};

// @desc    Delete a bill by ID
// @route   DELETE /delete-bill/:id
// @access  Public
const deleteBill = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const { id } = req.params;

    // Validate if ID is provided
    if (!id) {
      return res.status(400).json({ message: 'Bill ID is required' });
    }

    // Check if the bill exists
    const existingBill = await Bill.findById(id);
    if (!existingBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Delete the bill
    await Bill.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Bill deleted successfully',
      deletedBillId: id
    });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({
      message: 'Failed to delete bill',
      error: error.message,
    });
  }
};

module.exports = {
  createBill,
  getTotalCount,
  getTotalRevenue,
  
  getBillByPhoneNumber,
  deleteBill
}; 