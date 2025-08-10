
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from 'sweetalert2';

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
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TECH FIX</h1>
              <p className="text-gray-600">Your Technology Solutions Partner</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-gray-600 font-semibold">INVOICE</p>
            </div>
            <p className="text-xl font-bold text-blue-600">#{generateInvoiceNumber()}</p>
            <div className="flex items-center justify-end gap-2 mt-1">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-700">
                Date: {currentBill ? formatDate(currentBill.createdAt) : new Date().toLocaleDateString("en-US")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To and Service Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            BILL TO:
          </h3>
          {currentBill ? (
            <div className="text-gray-800">
              <p className="font-semibold text-lg">{currentBill.recipientName}</p>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <p>Customer #: {currentBill.customerNumber}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p>Phone: {phoneNumber}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm text-gray-600">Bill ID: {currentBill._id}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No customer data available</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            SERVICE DETAILS:
          </h3>
          {currentBill ? (
            <div className="text-gray-800">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Service Date: {formatDate(currentBill.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Warranty Start: {formatDate(currentBill.warrantyStarting)}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Warranty End: {formatDate(currentBill.warrantyEnding)}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="font-semibold">Coverage: {coverageDays} days</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-600">Days Remaining: {daysRemaining}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No service data available</p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          SERVICE ITEMS:
        </h3>
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Item
              </th>
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
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="font-semibold text-gray-800">TECH FIX</p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>Address: [Your Business Address]</p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>Email: info@techfix.com</p>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p>Phone: [Your Business Phone]</p>
            </div>
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
  const invoiceRef = useRef(null);

  // State for managing current bill and HTML invoices
  const [currentBill, setCurrentBill] = useState(null);
  const [htmlInvoices, setHtmlInvoices] = useState([]);
  const [showHtmlInvoice, setShowHtmlInvoice] = useState(false);
  const [selectedHtmlInvoice, setSelectedHtmlInvoice] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

  // Console log the data being passed to this page
  console.log("Location state:", location.state);
  console.log("Bills data:", location.state?.bills);
  console.log("Phone number:", location.state?.phoneNumber);
  console.log("From admin:", fromAdmin);

  // Initialize bill data and HTML invoices
  useEffect(() => {
    if (location.state?.bills && location.state.bills.length > 0) {
      setCurrentBill(location.state.bills[0]);
    }
    
    // Check if HTML invoices are available
    if (location.state?.htmlInvoices && location.state.htmlInvoices.length > 0) {
      setHtmlInvoices(location.state.htmlInvoices);
    }
  }, [location.state]);

  // Function to view HTML invoice
  const viewHtmlInvoice = (htmlInvoice) => {
    setSelectedHtmlInvoice(htmlInvoice);
    setShowHtmlInvoice(true);
  };

  // Function to close HTML invoice view
  const closeHtmlInvoice = () => {
    setShowHtmlInvoice(false);
    setSelectedHtmlInvoice(null);
  };

  // Function to download HTML invoice
  const downloadHtmlInvoice = (htmlInvoice) => {
    const blob = new Blob([htmlInvoice.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${htmlInvoice.billId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to print HTML invoice
  const printHtmlInvoice = (htmlInvoice) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlInvoice.html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

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

  // PDF Download function
  const downloadPDF = async () => {
    if (isGeneratingPDF) return; // Prevent multiple simultaneous downloads
    
    try {
      setIsGeneratingPDF(true);
      setPdfProgress(10);
      
      // If we have HTML invoices from backend, use them for better PDF generation
      if (htmlInvoices.length > 0) {
        await downloadPDFFromHTML(htmlInvoices[0]);
        return;
      }
      
      // Fallback to converting the frontend component if no HTML invoices
      if (!invoiceRef.current) {
        alert('No invoice content available for PDF generation.');
        return;
      }
      
      await downloadPDFFromComponent();
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfProgress(0);
      Swal.fire({
        icon: 'error',
        title: 'PDF Generation Failed',
        text: 'There was an error generating the PDF. Please try again or use the print function instead.',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsGeneratingPDF(false);
      setPdfProgress(0);
    }
  };

  const downloadPDFFromHTML = async (htmlInvoice) => {
    try {
      // Create a temporary container for the HTML content
      setPdfProgress(20);
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = htmlInvoice.html;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px'; // Set a fixed width for consistent rendering
      tempContainer.style.backgroundColor = '#ffffff';
      
      // Apply print-friendly styles
      setPdfProgress(25);
      const allElements = tempContainer.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.style) {
          // Ensure text is readable
          if (el.style.color && el.style.color !== 'rgb(255, 255, 255)') {
            el.style.color = '#000000';
          }
          // Ensure backgrounds are white
          if (el.style.backgroundColor && el.style.backgroundColor !== 'transparent') {
            el.style.backgroundColor = '#ffffff';
          }
        }
      });
      
      // Add to DOM temporarily
      setPdfProgress(28);
      document.body.appendChild(tempContainer);
      
      // Convert to canvas with optimized settings
      setPdfProgress(30);
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: tempContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });
      
      // Remove temporary container
      setPdfProgress(58);
      document.body.removeChild(tempContainer);
      
      setPdfProgress(60);
      // Generate PDF
      await generatePDFFromCanvas(canvas, htmlInvoice);
      
    } catch (error) {
      console.error('Error generating PDF from HTML:', error);
      setPdfProgress(0);
      throw error;
    }
  };

  const downloadPDFFromComponent = async () => {
    try {
      // Create a clone of the invoice element
      setPdfProgress(20);
      const clonedElement = invoiceRef.current.cloneNode(true);
      
      // Apply print-friendly styling
      clonedElement.style.backgroundColor = '#ffffff';
      clonedElement.style.width = '800px';
      
      // Convert all colors to black for better PDF readability
      setPdfProgress(25);
      const allElements = clonedElement.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.style) {
          if (el.style.color && el.style.color !== 'rgb(255, 255, 255)') {
            el.style.color = '#000000';
          }
          if (el.style.backgroundColor && el.style.backgroundColor !== 'transparent') {
            el.style.backgroundColor = '#ffffff';
          }
        }
      });
      
      // Temporarily add to DOM
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-99990px';
      clonedElement.style.top = '0';
      setPdfProgress(28);
      document.body.appendChild(clonedElement);
      
      // Convert to canvas
      setPdfProgress(30);
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
        height: clonedElement.scrollHeight
      });
      
      // Remove from DOM
      setPdfProgress(58);
      document.body.removeChild(clonedElement);
      
      setPdfProgress(60);
      // Generate PDF
      await generatePDFFromCanvas(canvas);
      
    } catch (error) {
      console.error('Error generating PDF from component:', error);
      setPdfProgress(0);
      throw error;
    }
  };

  const generatePDFFromCanvas = async (canvas, htmlInvoice = null) => {
    try {
      const imgData = canvas.toDataURL('image/png', 1.0);
      setPdfProgress(70);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      let pageCount = 0;
      
      // Add first page
      setPdfProgress(80);
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      pageCount++;
      
      // Add additional pages if content is longer than one page
      setPdfProgress(85);
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        pageCount++;
      }
      
      setPdfProgress(95);
      // Generate filename
      let fileName;
      if (htmlInvoice) {
        fileName = `invoice-${htmlInvoice.billId}-${htmlInvoice.recipientName.replace(/[^a-zA-Z0-9]/g, '-')}-${formatDate(new Date()).replace(/\//g, '-')}.pdf`;
      } else {
        fileName = `invoice-${generateInvoiceNumber()}-${formatDate(new Date()).replace(/\//g, '-')}.pdf`;
      }
      
      setPdfProgress(98);
      // Save the PDF
      pdf.save(fileName);
      
      console.log(`PDF generated successfully with ${pageCount} page(s)`);
      
      // Show success notification
      setPdfProgress(99);
      Swal.fire({
        icon: 'success',
        title: 'PDF Generated Successfully!',
        text: `Invoice PDF with ${pageCount} page(s) has been downloaded.`,
        timer: 3000,
        showConfirmButton: false
      });
      
      setPdfProgress(100);
      
    } catch (error) {
      console.error('Error in PDF generation:', error);
      setPdfProgress(0);
      throw error;
    } finally {
      // Reset progress after a short delay
      setTimeout(() => setPdfProgress(0), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          {/* <h1 className="text-2xl font-bold text-gray-800">Invoice</h1> */}
          <div className="flex gap-4">
            {/* HTML Invoice Buttons */}
       
            
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
            <div className="relative">
              <button
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
                className={`px-4 py-2 text-white rounded flex items-center ${
                  isGeneratingPDF 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isGeneratingPDF ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
              {isGeneratingPDF && pdfProgress > 0 && (
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300 ease-out"
                    style={{ width: `${pdfProgress}%` }}
                  />
                </div>
              )}
            </div>
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

        {/* HTML Invoice Modal */}
        {showHtmlInvoice && selectedHtmlInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full h-5/6 flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">HTML Invoice - {selectedHtmlInvoice.recipientName}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadHtmlInvoice(selectedHtmlInvoice)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  >
                    Download HTML
                  </button>
                  <div className="relative">
                    <button
                      onClick={async () => {
                        if (isGeneratingPDF) return;
                        try {
                          setIsGeneratingPDF(true);
                          setPdfProgress(10);
                          await downloadPDFFromHTML(selectedHtmlInvoice);
                        } catch (error) {
                          console.error('Error downloading PDF from modal:', error);
                          setPdfProgress(0);
                          Swal.fire({
                            icon: 'error',
                            title: 'PDF Generation Failed',
                            text: 'There was an error generating the PDF. Please try again.',
                            confirmButtonText: 'OK'
                          });
                        } finally {
                          setIsGeneratingPDF(false);
                          setPdfProgress(0);
                        }
                      }}
                      disabled={isGeneratingPDF}
                      className={`px-3 py-1 text-white rounded text-sm ${
                        isGeneratingPDF 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                    </button>
                    {isGeneratingPDF && pdfProgress > 0 && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-300 ease-out"
                          style={{ width: `${pdfProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => printHtmlInvoice(selectedHtmlInvoice)}
                    className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                  >
                    Print
                  </button>
                  <button
                    onClick={closeHtmlInvoice}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div 
                  dangerouslySetInnerHTML={{ __html: selectedHtmlInvoice.html }}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Clean Invoice Component (replaces old CSS template) */}
        <div ref={invoiceRef}>
          <CleanInvoice
            currentBill={currentBill}
            location={location}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            generateInvoiceNumber={generateInvoiceNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default BillPage;
