const Bill = require('../models/Bill');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get all bills (Customer Bills)
// @route   GET /get-users
// @access  Public
const getUsers = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const allBills = await Bill.find({}).sort({ createdAt: -1 });

    console.log(allBills, 'All Bills Retrieved');
    
    res.status(200).json({
      message: 'Bills retrieved successfully',
      data: allBills,
      count: allBills.length
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({
      message: 'Failed to fetch bills',
      error: error.message,
    });
  }
};


const getUserById = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid bill ID' });
    }

    const deletedBill = await Bill.findByIdAndDelete(id);
    
    if (!deletedBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.status(200).json({
      message: 'Bill deleted successfully',
      data: deletedBill
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
  getUsers,

  getUserById,

  deleteUser,

};
