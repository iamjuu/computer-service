const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser
} = require('../controllers/userController');

// GET route for getting all users
router.get('/get-users', getUsers);

// DELETE route for deleting a bill by ID
router.delete('/delete-user/:id', deleteUser);


module.exports = router;
