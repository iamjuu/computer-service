const express = require('express');
const router = express.Router();
const {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill
} = require('../controllers/billController');

router.route('/').get(getBills).post(createBill);
router.route('/:id').get(getBill).put(updateBill).delete(deleteBill);

module.exports = router; 