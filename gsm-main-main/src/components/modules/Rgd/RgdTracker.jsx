import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Rdt() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [distributionData, setDistributionData] = useState([]);

  // Fetch tracker data from API
  useEffect(() => {
    const fetchTrackerData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/rgd/tracker.php');
        setDistributionData(response.data);
      } catch (error) {
        console.error('Error fetching tracker data:', error);
      }
    };
    fetchTrackerData();
  }, []);

  // Populate sample data
  const handlePopulateSampleData = async () => {
    const sampleData = [
      {
        region: 'Caloocan City - North',
        beneficiaries: 450,
        distributed_packages: 450,
        last_distribution: '2024-01-15',
        status: 'Completed',
        coordinator: 'Ana Reyes',
        notes: 'Emergency relief distributed to flood victims in North Caloocan'
      },
      {
        region: 'Caloocan City - South',
        beneficiaries: 380,
        distributed_packages: 380,
        last_distribution: '2024-01-14',
        status: 'In Progress',
        coordinator: 'Juan Dela Cruz',
        notes: 'Distribution ongoing in South Caloocan, 85% complete'
      },
      {
        region: 'Caloocan City - Central',
        beneficiaries: 270,
        distributed_packages: 270,
        last_distribution: '2024-01-13',
        status: 'Completed',
        coordinator: 'Maria Santos',
        notes: 'Central Caloocan relief distribution completed successfully'
      }
    ];
    try {
      for (const item of sampleData) {
        await axios.post('http://localhost:8000/api/rgd/tracker.php', item);
      }
      // Refresh data
      const response = await axios.get('http://localhost:8000/api/rgd/tracker.php');
      setDistributionData(response.data);
      alert('Sample data added successfully');
    } catch (error) {
      console.error('Error populating sample data:', error);
      alert('Failed to add sample data');
    }
  };

  const totalBeneficiaries = distributionData.reduce((sum, item) => sum + parseInt(item.beneficiaries), 0);
  const totalDistributedPackages = distributionData.reduce((sum, item) => sum + parseInt(item.distributed_packages), 0);

  const filteredData = selectedRegion === 'all' 
    ? distributionData 
    : distributionData.filter(item => item.region === selectedRegion);

  const regions = ['all', 'Caloocan City - North', 'Caloocan City - South', 'Caloocan City - Central'];

  return (
    <div className='mx-1 mt-1 p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800'>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-green-600 dark:text-green-400">Caloocan Relief Distribution Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of relief distribution reports and tracking system for Caloocan City disaster response management.
          </p>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              onClick={handlePopulateSampleData}
            >
              Populate Sample Data
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Beneficiaries</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{totalBeneficiaries.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Distributed Packages</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalDistributedPackages.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div>
              <label className="block text-sm font-medium mb-2">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Caloocan Area</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Caloocan Areas' : region}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Generate Report
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Export Data
            </button>
          </div>
        </div>

        {/* Distribution Overview Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Distribution Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Caloocan Area</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Beneficiaries</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Distributed Packages</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Distribution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Coordinator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.region}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {parseInt(item.beneficiaries).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {parseInt(item.distributed_packages).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(item.last_distribution).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : item.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {item.coordinator}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View</button>
                        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Edit</button>
                        <button className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300">Report</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub-modules Links and Recent Activity remain unchanged */}
      </div>
    </div>
  )
}

export default Rdt;
