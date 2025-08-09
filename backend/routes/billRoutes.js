const express = require('express');
const router = express.Router();
const {
  createBill,
  getTotalCount,
  getTotalRevenue,
  deleteBill
} = require('../controllers/billController');

// POST route for creating bills
router.post('/add-bill', createBill);

// GET route for getting total count of bills
router.get('/total-count', getTotalCount);

// GET route for getting total revenue
router.get('/total-revenue', getTotalRevenue);

// DELETE route for deleting a bill by ID
router.delete('/delete-bill/:id', deleteBill);

module.exports = router; 