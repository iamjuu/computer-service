import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBill = () => {
  const navigate = useNavigate();

  const handleCreateBill = () => {
    console.log('Navigating to bill creation page...');
    navigate('/admin/add-bill');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Create New Bill</h2>
      <p className="text-gray-600 mb-6">
        Click the button below to navigate to the bill creation form where you can add new bills to the system.
      </p>
      <button
        onClick={handleCreateBill}
        className="bg-red-800 text-white px-6 py-3 rounded hover:bg-red-900 transition-colors"
      >
        Go to Bill Creation Form
      </button>
    </div>
  );
};

export default CreateBill;
