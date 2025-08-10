const Bill = require('../models/Bill');
const mongoose = require('mongoose');

// Function to generate HTML invoice
const generateHTMLInvoice = (bill, phoneNumber) => {
  const formatDate = (d) => new Date(d).toLocaleDateString("en-US");
  const formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0));
  const generateInvoiceNumber = () => Math.random().toString().slice(2, 10);

  const coverageDays = bill
    ? Math.ceil(
        (new Date(bill.warrantyEnding) - new Date(bill.warrantyStarting)) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const daysRemaining = bill
    ? Math.max(
        0,
        Math.ceil((new Date(bill.warrantyEnding) - new Date()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TECH FIX Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border: 1px solid #ddd;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            border-bottom: 2px solid #4a5568;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo-section {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .logo {
            width: 60px;
            height: 60px;
            background-color: #2563eb;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            border: 2px solid #1d4ed8;
        }
        .company-info h1 {
            margin: 0;
            font-size: 24px;
            color: #1f2937;
        }
        .company-info p {
            margin: 5px 0 0 0;
            color: #6b7280;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-label {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 8px;
            margin-bottom: 8px;
        }
        .invoice-number {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
        }
        .invoice-date {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 5px;
        }
        .grid-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }
        .info-item:last-child {
            margin-bottom: 0;
        }
        .items-table {
            margin-bottom: 30px;
        }
        .table-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #d1d5db;
        }
        th, td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
            font-weight: bold;
            color: #1f2937;
        }
        .totals {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
        }
        .totals-table {
            width: 320px;
        }
        .totals-table td {
            border: none;
            padding: 8px 0;
        }
        .total-row {
            border-top: 2px solid #4a5568;
            font-weight: bold;
            font-size: 18px;
        }
        .footer {
            border-top: 2px solid #4a5568;
            padding-top: 20px;
        }
        .footer-content {
            display: flex;
            justify-content: space-between;
        }
        .company-details h3 {
            margin: 0 0 10px 0;
            color: #1f2937;
        }
        .contact-info {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
        }
        .icon {
            width: 16px;
            height: 16px;
            color: #6b7280;
        }
        @media print {
            body { background-color: white; }
            .invoice-container { 
                border: none; 
                box-shadow: none; 
                padding: 0; 
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="logo-section">
                    <div class="logo">TF</div>
                    <div class="company-info">
                        <h1>TECH FIX</h1>
                        <p>Your Technology Solutions Partner</p>
                    </div>
                </div>
                <div class="invoice-info">
                    <div class="invoice-label">
                        <span>📄</span>
                        <span>INVOICE</span>
                    </div>
                    <div class="invoice-number">#${generateInvoiceNumber()}</div>
                    <div class="invoice-date">
                        <span>📅</span>
                        <span>Date: ${bill ? formatDate(bill.createdAt) : new Date().toLocaleDateString("en-US")}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bill To and Service Info -->
        <div class="grid-section">
            <div>
                <h3 class="section-title">
                    <span>👤</span>
                    BILL TO:
                </h3>
                ${bill ? `
                <div>
                    <div class="info-item">
                        <span>📍</span>
                        <span><strong>${bill.recipientName}</strong></span>
                    </div>
                    <div class="info-item">
                        <span>🔢</span>
                        <span>Customer #: ${bill.customerNumber}</span>
                    </div>
                    <div class="info-item">
                        <span>📞</span>
                        <span>Phone: ${phoneNumber}</span>
                    </div>
                    <div class="info-item">
                        <span>📋</span>
                        <span>Bill ID: ${bill._id}</span>
                    </div>
                </div>
                ` : '<p>No customer data available</p>'}
            </div>

            <div>
                <h3 class="section-title">
                    <span>🔧</span>
                    SERVICE DETAILS:
                </h3>
                ${bill ? `
                <div>
                    <div class="info-item">
                        <span>📅</span>
                        <span>Service Date: ${formatDate(bill.createdAt)}</span>
                    </div>
                    <div class="info-item">
                        <span>✅</span>
                        <span>Warranty Start: ${formatDate(bill.warrantyStarting)}</span>
                    </div>
                    <div class="info-item">
                        <span>⏰</span>
                        <span>Warranty End: ${formatDate(bill.warrantyEnding)}</span>
                    </div>
                    <div class="info-item">
                        <span>⚡</span>
                        <span><strong>Coverage: ${coverageDays} days</strong></span>
                    </div>
                    <div class="info-item">
                        <span>⏳</span>
                        <span>Days Remaining: ${daysRemaining}</span>
                    </div>
                </div>
                ` : '<p>No service data available</p>'}
            </div>
        </div>

        <!-- Items Table -->
        <div class="items-table">
            <h3 class="table-title">
                <span>📦</span>
                SERVICE ITEMS:
            </h3>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Unit Price</th>
                        <th style="text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${bill && bill.spareParts && bill.spareParts.length > 0 ? 
                        bill.spareParts.map((part, index) => `
                            <tr style="background-color: ${index % 2 === 0 ? 'white' : '#f9fafb'};">
                                <td>${part.description}</td>
                                <td style="text-align: center;">1</td>
                                <td style="text-align: right;">${formatCurrency(part.amount)}</td>
                                <td style="text-align: right; font-weight: bold;">${formatCurrency(part.amount)}</td>
                            </tr>
                        `).join('') : 
                        `<tr>
                            <td colspan="4" style="text-align: center; padding: 24px; color: #6b7280; font-style: italic;">
                                No service items available
                            </td>
                        </tr>`
                    }
                </tbody>
            </table>
        </div>

        <!-- Totals -->
        <div class="totals">
            <table class="totals-table">
                <tbody>
                    <tr>
                        <td style="text-align: right; font-weight: bold;">Subtotal:</td>
                        <td style="text-align: right; width: 128px;">
                            ${bill ? formatCurrency(bill.total) : "$0.00"}
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: right; font-weight: bold;">Tax (0%):</td>
                        <td style="text-align: right;">$0.00</td>
                    </tr>
                    <tr class="total-row">
                        <td style="text-align: right;">TOTAL:</td>
                        <td style="text-align: right;">
                            ${bill ? formatCurrency(bill.total) : "$0.00"}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <div class="company-details">
                    <h3>🏢 TECH FIX</h3>
                    <div class="contact-info">
                        <span>📍</span>
                        <span>Address: [Your Business Address]</span>
                    </div>
                    <div class="contact-info">
                        <span>📧</span>
                        <span>Email: info@techfix.com</span>
                    </div>
                    <div class="contact-info">
                        <span>📞</span>
                        <span>Phone: [Your Business Phone]</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
};

// @desc    Create new bill
// @route   POST /api/bills
// @access  Public
const createBill = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    console.log(req.body,'data is here')
    const { recipientName, customerNumber, total, spareParts, warrantyStarting, warrantyEnding } = req.body;

    // Validation
    if (!recipientName) {
      return res.status(400).json({ message: 'Recipient name is required' });
    }
    

    const newBill = new Bill({
      recipientName,
      customerNumber: customerNumber || '',
      total: parseFloat(total) || 0,
      spareParts: Array.isArray(spareParts) ? spareParts.filter(part => part.description && part.description.trim() !== '') : [],
      warrantyStarting: warrantyStarting ? new Date(warrantyStarting) : null,
      warrantyEnding: warrantyEnding ? new Date(warrantyEnding) : null,
    });

    const savedBill = await newBill.save();
console.log(savedBill,'savedBill')
    res.status(201).json({
      message: 'Bill added successfully',
      data: savedBill,
    });
  } catch (error) {
    console.error('Error adding bill:', error);
    res.status(500).json({
      message: 'Failed to add bill',
      error: error.message,
    });
  }
};

// @desc    Get total count of bills
// @route   GET /total-count
// @access  Public
const getTotalCount = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const totalCount = await Bill.countDocuments();
    
    res.status(200).json({
      totalCount: totalCount,
      message: 'Total count retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting total count:', error);
    res.status(500).json({
      message: 'Failed to get total count',
      error: error.message,
    });
  }
};

// @desc    Get total revenue from all bills
// @route   GET /total-revenue
// @access  Public
const getTotalRevenue = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    // Aggregate total revenue from all bills
    const result = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    
    res.status(200).json({
      totalRevenue: totalRevenue,
      message: 'Total revenue retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting total revenue:', error);
    res.status(500).json({
      message: 'Failed to get total revenue',
      error: error.message,
    });
  }
};


const getBillByPhoneNumber = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const { phoneNumber } = req.params;

    // Validate if phone number is provided
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    console.log('Searching for bills with phone number:', phoneNumber);

    // Debug: Check total bills in database
    const totalBills = await Bill.countDocuments();
    console.log('Total bills in database:', totalBills);

    // Debug: Check all customerNumbers in database
    const allCustomerNumbers = await Bill.find({}, { customerNumber: 1, recipientName: 1 }).limit(10);
    console.log('Sample customer numbers:', allCustomerNumbers);

    // Try multiple search strategies
    const searchQueries = [
      { customerNumber: phoneNumber }, // Exact match
      { customerNumber: { $regex: phoneNumber, $options: 'i' } }, // Case insensitive regex
      { customerNumber: { $regex: phoneNumber.replace(/\D/g, ''), $options: 'i' } }, // Only digits
    ];

    let bills = [];
    let searchMethod = '';

    // Try each search strategy
    for (let i = 0; i < searchQueries.length; i++) {
      bills = await Bill.find(searchQueries[i]);
      if (bills.length > 0) {
        searchMethod = `Search method ${i + 1}`;
        break;
      }
    }

    console.log(`Found ${bills.length} bills using: ${searchMethod || 'No method worked'}`);
    
    if (bills.length === 0) {
      // Return more helpful debugging info
      return res.status(404).json({ 
        message: 'No bills found for this phone number',
        data: [],
        debug: {
          searchedPhoneNumber: phoneNumber,
          totalBillsInDB: totalBills,
          sampleCustomerNumbers: allCustomerNumbers.map(b => b.customerNumber)
        }
      });
    }

    // Generate HTML invoices for each bill found
    const htmlInvoices = bills.map(bill => ({
      billId: bill._id,
      recipientName: bill.recipientName,
      customerNumber: bill.customerNumber,
      html: generateHTMLInvoice(bill, phoneNumber)
    }));

    res.status(200).json({
      message: 'Bills retrieved successfully',
      data: bills,
      htmlInvoices: htmlInvoices,
      count: bills.length,
      searchMethod: searchMethod
    });
  } catch (error) {
    console.error('Error getting bills by phone number:', error);
    res.status(500).json({
      message: 'Failed to get bills',
      error: error.message,
    });
  }
};

// @desc    Generate HTML invoice for a specific bill
// @route   GET /generate-invoice/:id
// @access  Public
const generateInvoice = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const { id } = req.params;
    const { phoneNumber } = req.query;

    // Validate if ID is provided
    if (!id) {
      return res.status(400).json({ message: 'Bill ID is required' });
    }

    // Check if the bill exists
    const existingBill = await Bill.findById(id);
    if (!existingBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Generate HTML invoice
    const htmlInvoice = generateHTMLInvoice(existingBill, phoneNumber || '');

    // Set content type to HTML
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlInvoice);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({
      message: 'Failed to generate invoice',
      error: error.message,
    });
  }
};

// @desc    Delete a bill by ID
// @route   DELETE /delete-bill/:id
// @access  Public
const deleteBill = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database connection unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    const { id } = req.params;

    // Validate if ID is provided
    if (!id) {
      return res.status(400).json({ message: 'Bill ID is required' });
    }

    // Check if the bill exists
    const existingBill = await Bill.findById(id);
    if (!existingBill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Delete the bill
    await Bill.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Bill deleted successfully',
      deletedBillId: id
    });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({
      message: 'Failed to delete bill',
      error: error.message,
    });
  }
};

module.exports = {
  createBill,
  getTotalCount,
  getTotalRevenue,
  getBillByPhoneNumber,
  generateInvoice,
  deleteBill
}; 