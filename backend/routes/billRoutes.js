const express = require('express');
const router = express.Router();
const {
  createBill,
  getTotalCount,
  getTotalRevenue,
  getBillByPhoneNumber,
  generateInvoice,
  deleteBill
} = require('../controllers/billController');

// POST route for creating bills
router.post('/add-bill', createBill);

// GET route for getting total count of bills
router.get('/total-count', getTotalCount);

// GET route for getting total revenue
router.get('/total-revenue', getTotalRevenue);



// GET route for getting bills by phone number
router.get('/bill-by-number/:phoneNumber', getBillByPhoneNumber);

// GET route for generating HTML invoice
router.get('/generate-invoice/:id', generateInvoice);

// DELETE route for deleting a bill by ID
router.delete('/delete-bill/:id', deleteBill);

module.exports = router; 