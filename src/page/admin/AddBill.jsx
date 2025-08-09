import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../../utils/functions';

const AddBill = () => {
  const navigate = useNavigate();
  
  const [billData, setBillData] = useState({
    recipientName: '',
    customerNumber: '',
    total: 0,
    spareParts: [{ description: '', amount: 0 }], // Array to handle multiple spare parts with amounts
    warrantyStarting: '',
    warrantyEnding: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    console.log('Input changed:', e.target.name, e.target.value);
    
    setBillData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSparePartChange = (index, field, value) => {
    const updatedSpareParts = [...billData.spareParts];
    updatedSpareParts[index] = {
      ...updatedSpareParts[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    setBillData(prev => ({
      ...prev,
      spareParts: updatedSpareParts
    }));
  };

  // Calculate total from spare parts amounts
  const calculateTotal = () => {
    return billData.spareParts.reduce((total, part) => {
      return total + (parseFloat(part.amount) || 0);
    }, 0);
  };

  const addSparePartField = () => {
    setBillData(prev => ({
      ...prev,
      spareParts: [...prev.spareParts, { description: '', amount: 0 }]
    }));
  };

  const removeSparePartField = (index) => {
    if (billData.spareParts.length > 1) {
      const updatedSpareParts = billData.spareParts.filter((_, i) => i !== index);
      setBillData(prev => ({
        ...prev,
        spareParts: updatedSpareParts
      }));
    }
  };

  const handleSave = async () => {
    console.log('Saving bill data...', billData);
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!billData.recipientName) {
        throw new Error('Please fill in the recipient name');
      }
   
      const calculatedTotal = calculateTotal();
      const requestData = {
        recipientName: billData.recipientName,
        customerNumber: billData.customerNumber,
        total: calculatedTotal,
        spareParts: billData.spareParts.filter(part => part.description.trim() !== ''), // Remove empty spare parts
        warrantyStarting: billData.warrantyStarting,
        warrantyEnding: billData.warrantyEnding
      };
      
    
      
      const response = await post('/add-bill', requestData);

      console.log('Bill saved successfully:', response.data);
      alert('Bill saved successfully!');
      navigate('/admin');
      
    } catch (err) {
      console.error('Error saving bill:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Bill</h1>
          <p className="text-gray-600">Fill in the details to create a new billing record</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bill Form Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Bill Information</h2>
            <p className="text-blue-100 mt-1">Enter the required details below</p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Recipient Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={billData.recipientName}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                    placeholder="Enter recipient name"
                    required
                  />
                </div>

                {/* Customer Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Number
                  </label>
                  <input
                    type="text"
                    name="customerNumber"
                    value={billData.customerNumber}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                    placeholder="Enter customer number"
                  />
                </div>

                {/* Spare Parts - Dynamic Fields */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Spare Parts Description & Amount
                  </label>
                  <div className="space-y-3">
                    {billData.spareParts.map((sparePart, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={sparePart.description}
                          onChange={(e) => handleSparePartChange(index, 'description', e.target.value)}
                          className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                          placeholder={`Spare part ${index + 1} description...`}
                        />
                        <div className="relative w-32">
                          <span className="absolute left-3 top-4 text-gray-500 font-medium">₹</span>
                          <input
                            type="number"
                            value={sparePart.amount}
                            onChange={(e) => handleSparePartChange(index, 'amount', e.target.value)}
                            className="w-full pl-8 pr-3 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        {billData.spareParts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSparePartField(index)}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                            title="Remove spare part"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSparePartField}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 focus:ring-2 focus:ring-green-200 transition-all duration-200 shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Spare Part
                    </button>
                  </div>
                </div>



                {/* Warranty Starting Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Warranty Start Date
                  </label>
                  <input
                    type="date"
                    name="warrantyStarting"
                    value={billData.warrantyStarting}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Warranty Ending Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Warranty End Date
                  </label>
                  <input
                    type="date"
                    name="warrantyEnding"
                    value={billData.warrantyEnding}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Dynamic Total Display */}
              {calculateTotal() > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Amount</h3>
                    <div className="text-3xl font-bold text-green-600">
                      ₹{calculateTotal().toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Calculated from {billData.spareParts.filter(part => part.amount > 0).length} spare part(s)
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="w-full sm:w-auto px-8 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 focus:ring-4 focus:ring-gray-200 transition-all duration-200 shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-12 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    'Save Bill'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            * Required fields must be filled before saving
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddBill;