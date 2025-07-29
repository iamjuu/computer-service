import React, { useState, useRef, useEffect } from 'react';

const BillForm = ({ billId, phoneNumber = "0321-8082879" }) => {
  const [billData, setBillData] = useState({
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    refNo: '',
    invNo: '',
    page: '',
    phoneNumber: phoneNumber,
    items: [
      { particular: '', quantity: '', unit: '', rate: '', amount: '' }
    ],
    totalAmount: 0,
    discount: 0,
    finalAmount: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const billRef = useRef(null);

  // Fetch bill data from backend
  const fetchBillData = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/bills/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch bill: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform backend data to component format
      setBillData({
        customerName: data.customer_name || '',
        date: data.date || new Date().toISOString().split('T')[0],
        refNo: data.ref_no || '',
        invNo: data.invoice_no || '',
        page: data.page || '',
        phoneNumber: data.phone_number || phoneNumber,
        items: data.items?.length > 0 ? data.items.map(item => ({
          particular: item.particular || '',
          quantity: item.quantity?.toString() || '',
          unit: item.unit || '',
          rate: item.rate?.toString() || '',
          amount: item.amount?.toString() || ''
        })) : [{ particular: '', quantity: '', unit: '', rate: '', amount: '' }],
        totalAmount: parseFloat(data.total_amount || 0),
        discount: parseFloat(data.discount || 0),
        finalAmount: parseFloat(data.final_amount || 0)
      });
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bill data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save bill data to backend
  const saveBillData = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Transform component data to backend format
      const dataToSave = {
        customer_name: billData.customerName,
        date: billData.date,
        ref_no: billData.refNo,
        invoice_no: billData.invNo,
        page: billData.page,
        phone_number: billData.phoneNumber,
        items: billData.items.filter(item => 
          item.particular || item.quantity || item.rate
        ).map(item => ({
          particular: item.particular,
          quantity: parseFloat(item.quantity || 0),
          unit: item.unit,
          rate: parseFloat(item.rate || 0),
          amount: parseFloat(item.amount || 0)
        })),
        total_amount: billData.totalAmount,
        discount: billData.discount,
        final_amount: billData.finalAmount
      };

      const url = billId ? `/api/bills/${billId}` : '/api/bills';
      const method = billId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        throw new Error(`Failed to save bill: ${response.statusText}`);
      }

      const savedData = await response.json();
      console.log('Bill saved successfully:', savedData);
      
      // Show success message
      alert('Bill saved successfully!');
      
    } catch (err) {
      setError(err.message);
      console.error('Error saving bill data:', err);
      alert('Failed to save bill. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Fetch customer data by phone number
  const fetchCustomerData = async (phone) => {
    if (!phone || phone.length < 10) return;
    
    try {
      const response = await fetch(`/api/customers/search?phone=${phone}`);
      if (response.ok) {
        const customerData = await response.json();
        if (customerData) {
          setBillData(prev => ({
            ...prev,
            customerName: customerData.name || prev.customerName,
            phoneNumber: customerData.phone || prev.phoneNumber
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
    }
  };

  // Load bill data on component mount
  useEffect(() => {
    if (billId) {
      fetchBillData(billId);
    }
  }, [billId]);

  // Auto-save functionality (optional)
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (billData.customerName && billData.items.some(item => item.particular)) {
        // Auto-save after 30 seconds of inactivity
        // saveBillData();
      }
    }, 30000);

    return () => clearTimeout(autoSaveTimer);
  }, [billData]);

  const handleInputChange = (e, index = null) => {
    if (index !== null) {
      const newItems = [...billData.items];
      newItems[index] = {
        ...newItems[index],
        [e.target.name]: e.target.value
      };
      
      if (e.target.name === 'quantity' || e.target.name === 'rate') {
        newItems[index].amount = (
          parseFloat(newItems[index].quantity || 0) * 
          parseFloat(newItems[index].rate || 0)
        ).toFixed(2);
      }

      const totalAmount = calculateTotal(newItems);
      setBillData(prevData => ({
        ...prevData,
        items: newItems,
        totalAmount: totalAmount,
        finalAmount: totalAmount - parseFloat(prevData.discount || 0)
      }));
    } else {
      const newValue = e.target.value;
      let updates = { [e.target.name]: newValue };
      
      if (e.target.name === 'discount') {
        updates.finalAmount = billData.totalAmount - parseFloat(newValue || 0);
      }
      
      // Fetch customer data when phone number changes
      if (e.target.name === 'phoneNumber') {
        fetchCustomerData(newValue);
      }
      
      setBillData(prevData => ({
        ...prevData,
        ...updates
      }));
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  };

  const addItem = () => {
    setBillData(prevData => ({
      ...prevData,
      items: [...prevData.items, { particular: '', quantity: '', unit: '', rate: '', amount: '' }]
    }));
  };

  const removeLastItem = () => {
    if (billData.items.length > 1) {
      const newItems = billData.items.slice(0, -1);
      const totalAmount = calculateTotal(newItems);
      setBillData(prevData => ({
        ...prevData,
        items: newItems,
        totalAmount: totalAmount,
        finalAmount: totalAmount - parseFloat(prevData.discount || 0)
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-sm mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading bill data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto p-2">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">Error: {error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-xs underline hover:no-underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <div ref={billRef} className="bg-white border-2 border-black text-xs print-area">
        {/* Header */}
        <div className="text-center p-2 border-b-2 border-black">
          <h1 className="text-lg font-bold">AL KARIMI GENERAL STORE</h1>
          <p className="text-xs italic">DEALS IN ALL KIND OF GROCERY & GENERAL ITEMS</p>
          <div className="text-xs mt-1 leading-tight">
            <p>Tel: 34596666</p>
            <p>Mob: 0321-8082879</p>
            <p>Add: Shop No. 5, Hassan Gate,</p>
            <p>Sector 15/B, Abul Hassan Isphahani Road, Karachi.</p>
          </div>
        </div>

        {/* Bill Slip Title */}
        <div className="text-center py-1 bg-red-800 text-white font-bold">
          BILL SLIP
        </div>

        {/* Customer Info Section */}
        <div className="border-b border-black">
          <div className="flex">
            <div className="flex-1 border-r border-black">
              <div className="bg-red-800 text-white text-center py-1 text-xs font-bold">
                CUSTOMER NAME
              </div>
              <input
                type="text"
                name="customerName"
                value={billData.customerName}
                onChange={handleInputChange}
                className="w-full p-1 text-xs border-0 outline-none h-8"
                placeholder="Enter customer name"
              />
            </div>
            <div className="w-24">
              <div className="border-b border-black">
                <div className="bg-red-800 text-white text-center py-1 text-xs font-bold">
                  REF. NO
                </div>
                <input
                  type="text"
                  name="refNo"
                  value={billData.refNo}
                  onChange={handleInputChange}
                  className="w-full p-1 text-xs border-0 outline-none h-6"
                />
              </div>
              <div className="border-b border-black">
                <div className="bg-red-800 text-white text-center py-1 text-xs font-bold">
                  DATE
                </div>
                <input
                  type="date"
                  name="date"
                  value={billData.date}
                  onChange={handleInputChange}
                  className="w-full p-1 text-xs border-0 outline-none h-6"
                />
              </div>
              <div className="border-b border-black">
                <div className="bg-red-800 text-white text-center py-1 text-xs font-bold">
                  INV. NO.
                </div>
                <input
                  type="text"
                  name="invNo"
                  value={billData.invNo}
                  onChange={handleInputChange}
                  className="w-full p-1 text-xs border-0 outline-none h-6"
                />
              </div>
              <div>
                <div className="bg-red-800 text-white text-center py-1 text-xs font-bold">
                  PAGE
                </div>
                <input
                  type="text"
                  name="page"
                  value={billData.page}
                  onChange={handleInputChange}
                  className="w-full p-1 text-xs border-0 outline-none h-6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-red-800 text-white">
              <th className="border border-black text-xs py-1 w-8">SR.</th>
              <th className="border border-black text-xs py-1">PARTICULAR</th>
              <th className="border border-black text-xs py-1 w-16">QUANTITY</th>
              <th className="border border-black text-xs py-1 w-12">UNIT</th>
              <th className="border border-black text-xs py-1 w-12">RATE</th>
              <th className="border border-black text-xs py-1 w-16">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {billData.items.map((item, index) => (
              <tr key={index} className="h-6">
                <td className="border border-black text-center text-xs py-0">{index + 1}</td>
                <td className="border border-black text-xs py-0">
                  <input
                    type="text"
                    name="particular"
                    value={item.particular}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full text-xs border-0 outline-none h-full px-1"
                    placeholder="Item description"
                  />
                </td>
                <td className="border border-black text-xs py-0">
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full text-xs border-0 outline-none h-full px-1 text-center"
                    placeholder="Qty"
                  />
                </td>
                <td className="border border-black text-xs py-0">
                  <input
                    type="text"
                    name="unit"
                    value={item.unit}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full text-xs border-0 outline-none h-full px-1 text-center"
                    placeholder="Unit"
                  />
                </td>
                <td className="border border-black text-xs py-0">
                  <input
                    type="number"
                    name="rate"
                    value={item.rate}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full text-xs border-0 outline-none h-full px-1 text-center"
                    step="0.01"
                    placeholder="Rate"
                  />
                </td>
                <td className="border border-black text-xs py-0">
                  <input
                    type="text"
                    name="amount"
                    value={item.amount}
                    readOnly
                    className="w-full text-xs border-0 outline-none h-full px-1 text-center bg-gray-50"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom Section */}
        <div className="flex border-t-2 border-black">
          <div className="flex-1 border-r border-black p-2">
            <div className="bg-red-800 text-white text-xs font-bold py-1 px-2 mb-2">
              RECEIVER'S SIGNATURE:
            </div>
            <div className="h-12"></div>
          </div>
          <div className="w-32">
            <div className="border-b border-black flex">
              <div className="bg-red-800 text-white text-xs font-bold py-1 px-2 flex-1">
                TOTAL AMOUNT
              </div>
              <div className="w-16 text-xs py-1 px-1 text-center font-bold">
                {billData.totalAmount.toFixed(2)}
              </div>
            </div>
            <div className="border-b border-black flex">
              <div className="bg-red-800 text-white text-xs font-bold py-1 px-2 flex-1">
                DISCOUNT
              </div>
              <div className="w-16 text-xs py-1">
                <input
                  type="number"
                  name="discount"
                  value={billData.discount}
                  onChange={handleInputChange}
                  className="w-full text-xs border-0 outline-none text-center"
                  step="0.01"
                />
              </div>
            </div>
            <div className="flex">
              <div className="bg-red-800 text-white text-xs font-bold py-1 px-2 flex-1">
                FINAL AMOUNT
              </div>
              <div className="w-16 text-xs py-1 px-1 text-center font-bold">
                {billData.finalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={addItem}
          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
        >
          Add Row
        </button>
        <button
          onClick={removeLastItem}
          className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          disabled={billData.items.length <= 1}
        >
          Remove Row
        </button>
        <button
          onClick={saveBillData}
          disabled={saving}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Bill'}
        </button>
        <button
          onClick={handlePrint}
          className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
        >
          Print Bill
        </button>
      </div>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BillForm;