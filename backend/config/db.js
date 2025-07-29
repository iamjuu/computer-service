const mongoose = require('mongoose');
const winston = require('winston');

// MongoDB Connection Configuration
const MONGO_URI = 'mongodb://localhost:27017/techfix';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/db-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/db.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const connectDB = async () => {
  try {
    logger.info('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 