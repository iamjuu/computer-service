import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BillForm from '../../components/billform';

const BillPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.phoneNumber;
  const fromAdmin = location.pathname.startsWith('/admin') || location.state?.fromAdmin;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Generate Bill</h1>
          <button
            onClick={() => navigate(fromAdmin ? '/admin' : '/')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to {fromAdmin ? 'Dashboard' : 'Home'}
          </button>
        </div>
        <BillForm phoneNumber={phoneNumber} isAdmin={fromAdmin} />
      </div>
    </div>
  );
};

export default BillPage;