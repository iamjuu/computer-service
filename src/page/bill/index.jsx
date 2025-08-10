
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Clean, print-friendly invoice UI that preserves your existing data and calculations.
 * Uses Tailwind classes only (no custom CSS blocks).
 */
function CleanInvoice({
  currentBill,
  location,
  formatDate = (d) => new Date(d).toLocaleDateString("en-US"),
  formatCurrency = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n || 0)),
  generateInvoiceNumber = () => Math.random().toString().slice(2, 10),
}) {
  const phoneNumber = location?.state?.phoneNumber;
  const isAdmin = !!location?.state?.admin;

  const coverageDays = currentBill
    ? Math.ceil(
        (new Date(currentBill.warrantyEnding) - new Date(currentBill.warrantyStarting)) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const daysRemaining = currentBill
    ? Math.max(
        0,
        Math.ceil((new Date(currentBill.warrantyEnding) - new Date()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  return (
    <div className="mx-auto max-w-4xl bg-white p-8 border border-gray-300 print:border-0 print:p-0">
      {/* Header */}
      <div className="border-b-2 border-gray-400 pb-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-600 text-white flex items-center justify-center font-bold text-xl border-2 border-blue-700">
              TF
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TECH FIX</h1>
              <p className="text-gray-600">Your Technology Solutions Partner</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 font-semibold">INVOICE</p>
            <p className="text-xl font-bold text-blue-600">#{generateInvoiceNumber()}</p>
            <p className="text-sm text-gray-700 mt-1">
              Date: {currentBill ? formatDate(currentBill.createdAt) : new Date().toLocaleDateString("en-US")}
            </p>
          </div>
        </div>
      </div>

      {/* Bill To and Service Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">BILL TO:</h3>
          {currentBill ? (
            <div className="text-gray-800">
              <p className="font-semibold text-lg">{currentBill.recipientName}</p>
              <p>Customer #: {currentBill.customerNumber}</p>
              <p>Phone: {phoneNumber}</p>
              <p className="text-sm text-gray-600 mt-2">Bill ID: {currentBill._id}</p>
            </div>
          ) : (
            <p className="text-gray-600">No customer data available</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">SERVICE DETAILS:</h3>
          {currentBill ? (
            <div className="text-gray-800">
              <p>Service Date: {formatDate(currentBill.createdAt)}</p>
              <p>Warranty Start: {formatDate(currentBill.warrantyStarting)}</p>
              <p>Warranty End: {formatDate(currentBill.warrantyEnding)}</p>
              <p className="font-semibold mt-2">Coverage: {coverageDays} days</p>
              <p className="text-sm text-gray-600">Days Remaining: {daysRemaining}</p>
            </div>
          ) : (
            <p className="text-gray-600">No service data available</p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">SERVICE ITEMS:</h3>
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-900">Item</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-900">Qty</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">Unit Price</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentBill && currentBill.spareParts && currentBill.spareParts.length > 0 ? (
              currentBill.spareParts.map((part, index) => (
                <tr key={part._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-4 py-3 text-gray-800">{part.description}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center text-gray-800">1</td>
                  <td className="border border-gray-300 px-4 py-3 text-right text-gray-800">{formatCurrency(part.amount)}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(part.amount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border border-gray-300 px-4 py-6 text-center text-gray-500 italic" colSpan={4}>
                  No service items available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 text-right font-semibold text-gray-800">Subtotal:</td>
                <td className="py-2 text-right text-gray-800 w-32">
                  {currentBill ? formatCurrency(currentBill.total) : "$0.00"}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-right font-semibold text-gray-800">Tax (0%):</td>
                <td className="py-2 text-right text-gray-800">$0.00</td>
              </tr>
              <tr className="border-t-2 border-gray-400">
                <td className="py-3 text-right font-bold text-lg text-gray-900">TOTAL:</td>
                <td className="py-3 text-right font-bold text-lg text-gray-900">
                  {currentBill ? formatCurrency(currentBill.total) : "$0.00"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

     

      {/* Footer */}
      <div className="border-t-2 border-gray-400 pt-6">
        <div className="flex justify-between text-sm text-gray-600">
          <div>
            <p className="font-semibold text-gray-800">TECH FIX</p>
            <p>Address: [Your Business Address]</p>
            <p>Email: info@techfix.com</p>
            <p>Phone: [Your Business Phone]</p>
          </div>
    
        </div>
      </div>
    </div>
  );
}

const BillPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fromAdmin = location.pathname.startsWith("/admin") || location.state?.fromAdmin;

  // State for managing current bill
  const [currentBill, setCurrentBill] = useState(null);

  // Console log the data being passed to this page
  console.log("Location state:", location.state);
  console.log("Bills data:", location.state?.bills);
  console.log("Phone number:", location.state?.phoneNumber);
  console.log("From admin:", fromAdmin);

  // Initialize bill data
  useEffect(() => {
    if (location.state?.bills && location.state.bills.length > 0) {
      setCurrentBill(location.state.bills[0]);
    }
  }, [location.state]);

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // NOTE: Preserves your existing cents-to-dollars behavior
  const formatCurrency = (amount) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const generateInvoiceNumber = () => {
    if (currentBill) {
      return currentBill._id.slice(-6).toUpperCase();
    }
    return "205002";
  };

  const calculateTotal = () => {
    if (!currentBill || !currentBill.spareParts) return 0;
    return currentBill.spareParts.reduce((total, part) => total + part.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
          <div className="flex gap-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>
            <button
              onClick={() => navigate(fromAdmin ? "/admin" : "/")}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {fromAdmin ? "Dashboard" : "Home"}
            </button>
          </div>
        </div>

        {/* Clean Invoice Component (replaces old CSS template) */}
        <CleanInvoice
          currentBill={currentBill}
          location={location}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          generateInvoiceNumber={generateInvoiceNumber}
        />
      </div>
    </div>
  );
};

export default BillPage;
