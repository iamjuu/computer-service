const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsersCount
} = require('../controllers/userController');

// GET route for getting all users
router.get('/get-users', getUsers);

// POST route for creating users
router.post('/add-user', createUser);

// GET route for getting user by ID
router.get('/user/:id', getUserById);

// PUT route for updating user
router.put('/user/:id', updateUser);

// DELETE route for deleting user
router.delete('/user/:id', deleteUser);

// GET route for getting user counts
router.get('/users-count', getUsersCount);

module.exports = router;
