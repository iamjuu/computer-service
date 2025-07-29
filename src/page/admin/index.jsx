import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch total users count
  useEffect(() => {
    const fetchTotalUsers = async () => {
      console.log('Fetching total users count...');
      try {
        const response = await fetch('/api/users/count');
        if (!response.ok) {
          throw new Error('Failed to fetch user count');
        }
        const data = await response.json();
        setTotalUsers(data.count);
        console.log('Total users fetched:', data.count);
      } catch (error) {
        console.error('Error fetching total users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  const handleCreateBill = () => {
    console.log('Navigating to bill creation page...');
    navigate('/bill');
  };

  const handleLogout = () => {
    console.log('User logging out from admin panel');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h2>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
          )}
        </div>

        {/* Create Bill Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Bill Management</h2>
          <button
            onClick={handleCreateBill}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors"
          >
            Create New Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 