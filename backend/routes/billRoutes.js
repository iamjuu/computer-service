const express = require('express');
const router = express.Router();
const {
  createBill,
  getTotalCount,
  getTotalRevenue
} = require('../controllers/billController');

// POST route for creating bills
router.post('/add-bill', createBill);

// GET route for getting total count of bills
router.get('/total-count', getTotalCount);

// GET route for getting total revenue
router.get('/total-revenue', getTotalRevenue);

module.exports = router; 