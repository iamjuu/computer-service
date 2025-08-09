const Bill = require('../models/Bill');
const mongoose = require('mongoose');

// @desc    Get all users
// @route   GET /get-users
// @access  Public
const getUsers = async (req, res) => {
  try {
    // Check if MongoDB is connected
const Alluser = await Bill.find({}).sort({ createdAt: -1 });

console.log(Alluser,'Alluser')
    
    res.status(200).json({
      message: 'Users retrieved successfully',
      data:   Alluser,
      count: Alluser.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// @desc    Create new user
// @route   POST /add-user
// @access  Public
const createUser = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const { name, email, phone, customerNumber, role, address } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if user with email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUser = new User({
      name,
      email,
      phone: phone || '',
      customerNumber: customerNumber || undefined,
      role: role || 'customer',
      address: address || ''
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({
      message: 'User created successfully',
      data: savedUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `User with this ${field} already exists`,
        error: error.message,
      });
    }
    
    res.status(500).json({
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

// @desc    Get user by ID
// @route   GET /user/:id
// @access  Public
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

// @desc    Update user
// @route   PUT /user/:id
// @access  Public
const updateUser = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const { id } = req.params;
    const { name, email, phone, customerNumber, role, address, isActive } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
    }

    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() }),
        ...(phone !== undefined && { phone }),
        ...(customerNumber !== undefined && { customerNumber }),
        ...(role && { role }),
        ...(address !== undefined && { address }),
        ...(isActive !== undefined && { isActive })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `User with this ${field} already exists`,
        error: error.message,
      });
    }
    
    res.status(500).json({
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /user/:id
// @access  Public
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
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

// @desc    Get total count of users
// @route   GET /users-count
// @access  Public
const getUsersCount = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const totalCount = await User.countDocuments();
    const activeCount = await User.countDocuments({ isActive: true });
    const customerCount = await User.countDocuments({ role: 'customer' });
    
    res.status(200).json({
      totalCount: totalCount,
      activeCount: activeCount,
      customerCount: customerCount,
      message: 'User counts retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting user counts:', error);
    res.status(500).json({
      message: 'Failed to get user counts',
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsersCount
};
