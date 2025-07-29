const Bill = require('../models/Bill');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/bill-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/bill.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// @desc    Get all bills
// @route   GET /api/bills
// @access  Public
const getBills = async (req, res) => {
  try {
    logger.info('Fetching all bills');
    const bills = await Bill.find().sort('-createdAt');
    logger.info(`Successfully fetched ${bills.length} bills`);
    res.status(200).json(bills);
  } catch (error) {
    logger.error(`Error fetching bills: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Public
const getBill = async (req, res) => {
  try {
    logger.info(`Fetching bill with id: ${req.params.id}`);
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      logger.warn(`Bill not found with id: ${req.params.id}`);
      return res.status(404).json({ message: 'Bill not found' });
    }
    logger.info(`Successfully fetched bill: ${bill._id}`);
    res.status(200).json(bill);
  } catch (error) {
    logger.error(`Error fetching bill: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new bill
// @route   POST /api/bills
// @access  Public
const createBill = async (req, res) => {
  try {
    logger.info('Creating new bill');
    const bill = await Bill.create(req.body);
    logger.info(`Successfully created bill: ${bill._id}`);
    res.status(201).json(bill);
  } catch (error) {
    logger.error(`Error creating bill: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Public
const updateBill = async (req, res) => {
  try {
    logger.info(`Updating bill with id: ${req.params.id}`);
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      logger.warn(`Bill not found with id: ${req.params.id}`);
      return res.status(404).json({ message: 'Bill not found' });
    }
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    logger.info(`Successfully updated bill: ${updatedBill._id}`);
    res.status(200).json(updatedBill);
  } catch (error) {
    logger.error(`Error updating bill: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Public
const deleteBill = async (req, res) => {
  try {
    logger.info(`Deleting bill with id: ${req.params.id}`);
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      logger.warn(`Bill not found with id: ${req.params.id}`);
      return res.status(404).json({ message: 'Bill not found' });
    }
    await bill.deleteOne();
    logger.info(`Successfully deleted bill: ${bill._id}`);
    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting bill: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill
}; 