const express = require('express');
const router = express.Router();
const {
  createBill
} = require('../controllers/billController');

// Only POST route for creating bills
router.post('/add-bill', createBill);

module.exports = router; 