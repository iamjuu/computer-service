import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { get } from '../../utils/functions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    totalBills: 0,
    totalUsers: 0,
    totalRevenue: 0,
    billsByStatus: [],
    billsPerMonth: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch statistics on component mount
  useEffect(() => {
   
    fetchTotalCount();
    fetchTotalRevenue();
  }, []);

 

  const fetchTotalCount = async () => {
    try {
      const response = await get('/total-count');
      const count = response.data.totalCount || response.data.count || response.data;
      
      // Update statistics to use the total count for both bills and users
      setStatistics(prev => ({
        ...prev,
        totalBills: count,
        totalUsers: count
      }));
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const response = await get('/total-revenue');
      const revenue = response.data.totalRevenue || 0;
      
      // Update statistics with the fetched total revenue
      setStatistics(prev => ({
        ...prev,
        totalRevenue: revenue
      }));
    } catch (error) {
      console.error('Error fetching total revenue:', error);
    }
  };

  // Prepare pie chart data for bill status
  const pieChartData = {
    labels: statistics.billsByStatus.map(item => item.status.charAt(0).toUpperCase() + item.status.slice(1)),
    datasets: [
      {
        label: 'Bills by Status',
        data: statistics.billsByStatus.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  // Prepare line chart data for bills per month
  const lineChartData = {
    labels: statistics.billsPerMonth.map(item => item.month),
    datasets: [
      {
        label: 'Bills Created',
        data: statistics.billsPerMonth.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Revenue ($)',
        data: statistics.billsPerMonth.map(item => item.revenue),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        yAxisID: 'y1'
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bills and Revenue Trends (Last 6 Months)',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">📄</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Bills</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {loading ? '...' : statistics.totalBills}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">👥</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {loading ? '...' : statistics.totalUsers}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">💰</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {loading ? '...' : `$${statistics.totalRevenue.toFixed(2)}`}
                </dd>
              </dl>
            </div>
          </div>
        </div>

       

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <button 
            onClick={() => {
              fetchStatistics();
              fetchTotalCount();
              fetchTotalRevenue();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full mb-2"
          >
            Refresh Data
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full">
            View Reports
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Bills by Status</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading chart...</div>
            </div>
          ) : statistics.billsByStatus.length > 0 ? (
            <div className="h-64">
              <Pie 
                data={pieChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">No data available</div>
            </div>
          )}
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Trends Over Time</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading chart...</div>
            </div>
          ) : statistics.billsPerMonth.length > 0 ? (
            <div className="h-64">
              <Line 
                data={lineChartData} 
                options={{
                  ...lineChartOptions,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">No data available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
