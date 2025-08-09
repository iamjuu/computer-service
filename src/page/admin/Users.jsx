import React, { useState, useEffect } from 'react';
import { get, del } from '../../utils/functions'; // Added del import

const CustomerBills = () => { // Renamed for clarity
  const [bills, setBills] = useState([]); // Renamed from users
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [selectedRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [deleting, setDeleting] = useState(null); // Track which bill is being deleted
  const [warrantyStartFilter, setWarrantyStartFilter] = useState('');
  const [warrantyEndFilter, setWarrantyEndFilter] = useState('');

  // Fetch bills data from API
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await get('/get-users'); // You might want to rename this endpoint to /get-bills
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      // Ensure we're setting an array - check if data is nested
      let billsData = response.data;
      
      // If data is nested inside another property, adjust accordingly
      if (response.data && response.data.data) {
        billsData = response.data.data;
      }
      
      // Ensure it's always an array
      if (!Array.isArray(billsData)) {
        console.warn('Bills data is not an array:', billsData);
        billsData = [];
      }
      
      setBills(billsData);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setBills([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        setDeleting(billId);
        // Implement actual API call to delete bill
        await del(`/delete-bill/${billId}`); // Assuming you have a delete endpoint
        
        setBills(prevBills => prevBills.filter(bill => bill._id !== billId && bill.id !== billId));
      } catch (error) {
        console.error('Error deleting bill:', error);
        alert('Failed to delete bill. Please try again.');
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleFindByNumber = () => {
    if (customerNumber.trim()) {
      setSearchTerm(customerNumber.trim());
      setCurrentPage(1);
    }
  };

  // Filter bills based on search term and warranty dates
  const filteredBills = (Array.isArray(bills) ? bills : []).filter(bill => {
    const matchesSearch = bill.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (bill.customerNumber && bill.customerNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (bill.spareParts && bill.spareParts.some(part => 
                           part.description && part.description.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    
    const hasCustomerNumber = bill.customerNumber && bill.customerNumber.trim() !== '';
    const matchesNumberFilter = selectedRole === 'all' || 
                               (selectedRole === 'with-number' && hasCustomerNumber) ||
                               (selectedRole === 'without-number' && !hasCustomerNumber);
    
    // Warranty date filtering
    const matchesWarrantyStart = !warrantyStartFilter || 
                                (bill.warrantyStarting && new Date(bill.warrantyStarting) >= new Date(warrantyStartFilter));
    
    const matchesWarrantyEnd = !warrantyEndFilter || 
                              (bill.warrantyEnding && new Date(bill.warrantyEnding) <= new Date(warrantyEndFilter));
    
    return matchesSearch && matchesNumberFilter && matchesWarrantyStart && matchesWarrantyEnd;
  });

  // Pagination
  const indexOfLastBill = currentPage * usersPerPage;
  const indexOfFirstBill = indexOfLastBill - usersPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);
  const totalPages = Math.ceil(filteredBills.length / usersPerPage);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate warranty status
  const getWarrantyStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'Not Started';
    if (now > end) return 'Expired';
    return 'Active';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Customer Bills
              </h2>
              <p className="text-gray-600 mt-1">Manage and track customer bills and warranties</p>
            </div>
            <button className="w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm">
              + Add New Bill
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="space-y-4">
            {/* Search Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Bills
                </label>
                <input
                  type="text"
                  placeholder="Search by name, number, or spare parts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Find by Customer Number
                </label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Enter customer number..."
                    value={customerNumber}
                    maxLength={10}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleFindByNumber()}
                    className="flex-1 px-4 py-3 border-0 focus:outline-none focus:ring-0"
                  />
                  <button
                    onClick={handleFindByNumber}
                    className="bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition-colors font-medium"
                  >
                    Find
                  </button>
                </div>
              </div>
            </div>

            {/* Date Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCustomerNumber('');
                    setWarrantyStartFilter('');
                    setWarrantyEndFilter('');
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchBills}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bills Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <div className="text-gray-500 text-lg">Loading bills...</div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Spare Parts
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Warranty
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentBills.length > 0 ? (
                      currentBills.map((bill) => (
                        <tr key={bill._id || bill.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{bill.recipientName}</div>
                              <div className="text-sm text-gray-500">#{bill.customerNumber || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              {bill.spareParts && bill.spareParts.length > 0 ? (
                                bill.spareParts.map((part, index) => (
                                  <div key={part._id || index} className="text-sm text-gray-900 mb-1">
                                    <span className="font-medium">{part.description}</span>
                                    <span className="text-gray-500 ml-2">${part.amount}</span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500">No spare parts</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              ${bill.total}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs">
                              <div className="text-gray-500 mb-1">
                                {formatDate(bill.warrantyStarting)} - {formatDate(bill.warrantyEnding)}
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                getWarrantyStatus(bill.warrantyStarting, bill.warrantyEnding) === 'Active' 
                                  ? 'bg-green-100 text-green-800'
                                  : getWarrantyStatus(bill.warrantyStarting, bill.warrantyEnding) === 'Expired'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {getWarrantyStatus(bill.warrantyStarting, bill.warrantyEnding)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(bill.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200 transition-colors">
                                View
                              </button>
                              <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs hover:bg-green-200 transition-colors">
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBill(bill._id || bill.id)}
                                disabled={deleting === (bill._id || bill.id)}
                                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200 disabled:opacity-50 transition-colors"
                              >
                                {deleting === (bill._id || bill.id) ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg">No bills found</p>
                            <p className="text-sm">Try adjusting your search criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden">
                {currentBills.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {currentBills.map((bill) => (
                      <div key={bill._id || bill.id} className="p-4 sm:p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{bill.recipientName}</h3>
                              <p className="text-sm text-gray-500">#{bill.customerNumber || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">${bill.total}</div>
                              <div className="text-xs text-gray-500">{formatDate(bill.createdAt)}</div>
                            </div>
                          </div>

                          {/* Spare Parts */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Spare Parts</h4>
                            <div className="space-y-1">
                              {bill.spareParts && bill.spareParts.length > 0 ? (
                                bill.spareParts.map((part, index) => (
                                  <div key={part._id || index} className="flex justify-between text-sm">
                                    <span className="text-gray-900">{part.description}</span>
                                    <span className="text-gray-500">${part.amount}</span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500">No spare parts</span>
                              )}
                            </div>
                          </div>

                          {/* Warranty */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Warranty</h4>
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600">
                                {formatDate(bill.warrantyStarting)} - {formatDate(bill.warrantyEnding)}
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                getWarrantyStatus(bill.warrantyStarting, bill.warrantyEnding) === 'Active' 
                                  ? 'bg-green-100 text-green-800'
                                  : getWarrantyStatus(bill.warrantyStarting, bill.warrantyEnding) === 'Expired'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {getWarrantyStatus(bill.warrantyStarting, bill.warrantyEnding)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                              View
                            </button>
                            <button className="flex-1 sm:flex-none px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBill(bill._id || bill.id)}
                              disabled={deleting === (bill._id || bill.id)}
                              className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 disabled:opacity-50 transition-colors"
                            >
                              {deleting === (bill._id || bill.id) ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg text-gray-500">No bills found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
                  {/* Mobile Pagination */}
                  <div className="flex justify-between items-center sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>

                  {/* Desktop Pagination */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstBill + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(indexOfLastBill, filteredBills.length)}</span> of{' '}
                        <span className="font-medium">{filteredBills.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNumber
                                  ? 'z-10 bg-red-50 border-red-500 text-red-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerBills;