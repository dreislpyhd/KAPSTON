import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reliefbeneficiary() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All'); 
  const [selected, setSelected] = useState(null);

  // Fetch beneficiaries from API
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await axios.get('http://localhost/gsm-main-main/backend3/api/hes/residents.php');
        const approvedResidents = response.data.filter(resident => resident.status === 'Approved');
        setBeneficiaries(approvedResidents);
      } catch (error) {
        console.error('Error fetching beneficiaries:', error);
      }
    };
    fetchBeneficiaries();
  }, []);

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const isProcessed = b.status === 'Approved';
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = zoneFilter === 'All' ||
                        (zoneFilter === 'North' && (b.zone === 'North Caloocan' || b.address.toLowerCase().includes('north caloocan'))) ||
                        (zoneFilter === 'South' && (b.zone === 'South Caloocan' || b.address.toLowerCase().includes('south caloocan')));
    return isProcessed && matchesSearch && matchesZone;
  });

  return (
    <div className='mx-1 mt-1 p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg h-full overflow-y-auto overflow-x-hidden'>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">Relief Beneficiary Monitoring</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and review beneficiaries receiving relief goods and services.
          </p>
        </div>

        {/* Search & Zone Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search beneficiaries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 w-full"
            />
          </div>
          <div className="relative w-full md:w-64">
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 w-full"
            >
              <option value="All">All Zones</option>
              <option value="North">North Caloocan</option>
              <option value="South">South Caloocan</option>
            </select>
          </div>
        </div>

        {/* Beneficiaries Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Zone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Family Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBeneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{beneficiary.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {beneficiary.last_distribution ? new Date(beneficiary.last_distribution).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {beneficiary.zone || (beneficiary.address.toLowerCase().includes('north') ? 'North Caloocan' : 'South Caloocan')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{beneficiary.family_size}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{beneficiary.contact_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => setSelected(beneficiary)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium rounded-lg px-2 py-1 border border-blue-400 dark:border-blue-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Modal */}
        {selected && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Beneficiary Details</h2>
              <p><strong>Name:</strong> {selected.name}</p>
              <p><strong>Age:</strong> {selected.age}</p>
              <p><strong>Family Size:</strong> {selected.family_size}</p>
              <p><strong>Address:</strong> {selected.address}</p>
              <p><strong>Contact:</strong> {selected.contact_number}</p>
              <p><strong>Zone:</strong> {selected.zone || 'Not specified'}</p>
              <p><strong>Last Distribution:</strong> {selected.last_distribution ? new Date(selected.last_distribution).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Notes:</strong> {selected.notes || 'No notes'}</p>
              <p><strong>Created:</strong> {selected.created_at ? new Date(selected.created_at).toLocaleDateString() : 'N/A'}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
 
      </div>
    </div>
  )
}

export default Reliefbeneficiary;
