import React, { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import axios from "axios";

export default function EvacuationResidentsAdmin() {

  const [search, setSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState("All");
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [viewResident, setViewResident] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResident, setNewResident] = useState({
    name: '',
    age: '',
    family_size: '',
    address: '',
    contact_number: '',
    last_distribution: '',
    notes: '',
    zone: '',
    center: '',
    barangay: ''
  });

  // Fetch residents from API
  const fetchResidents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/hes/residents.php');
      setResidents(response.data);
    } catch (error) {
      console.error('Error fetching residents:', error);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  // Filter residents locally based on search and activeRegion
  useEffect(() => {
    let filtered = residents;

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.address?.toLowerCase().includes(search.toLowerCase()) ||
          r.zone?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (activeRegion !== "All") {
      filtered = filtered.filter((r) => r.zone === activeRegion);
    }

    setFilteredResidents(filtered);
  }, [search, activeRegion, residents]);

  // Add new resident via API
  const addNewResident = async () => {
    // Validate required fields
    if (!newResident.name || !newResident.zone) {
      alert('Please fill in Name and Zone (required fields)');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/hes/residents.php', newResident, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resident added:', response.data);
      setShowAddModal(false);
      setNewResident({
        name: '',
        age: '',
        family_size: '',
        address: '',
        contact_number: '',
        last_distribution: '',
        notes: '',
        zone: '',
        center: '',
        barangay: ''
      });
      fetchResidents(); // Refresh the list
      alert('Resident added successfully');
    } catch (error) {
      console.error('Error adding resident:', error);
      if (error.code === 'ERR_NETWORK') {
        alert('Network Error: Unable to connect to the server. Please make sure your PHP server is running (XAMPP/WAMP) and the backend path is correct.');
      } else {
        const errorMessage = error.response?.data?.error || error.message;
        alert('Failed to add resident: ' + errorMessage);
      }
    }
  };

  // Update resident status via API
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/hes/residents.php?id=${id}`, 
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Status update response:', response.data);
      fetchResidents(); // Refresh the list
      alert(`Resident status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating resident:', error);
      if (error.code === 'ERR_NETWORK') {
        alert('Network Error: Unable to connect to the server. Please make sure your PHP server is running.');
      } else {
        const errorMessage = error.response?.data?.error || error.message;
        alert('Failed to update resident status: ' + errorMessage);
      }
    }
  };

  // Separate residents by status
  const pendingList = filteredResidents.filter((r) => r.status === "Pending");
  const approvedList = filteredResidents.filter((r) => r.status === "Approved");
  const declinedList = filteredResidents.filter((r) => r.status === "Declined");

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="text-blue-600" /> Evacuation Residents – Admin Panel
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Resident
        </button>
      </div>

      {/* Search + Region Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 w-full md:w-2/3">
          <Search className="text-gray-500 dark:text-gray-300" />
          <input
            type="text"
            placeholder="Search resident, barangay or center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-center">
          {["All", "South Caloocan", "North Caloocan"].map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeRegion === region
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Pending Residents Table */}
      <h2 className="text-xl font-semibold mb-2">Pending Residents</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <thead className="bg-blue-100 dark:bg-blue-900">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Family Size</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Zone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingList.map((r) => (
              <tr key={r.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.age}</td>
                <td className="px-4 py-2">{r.family_size}</td>
                <td className="px-4 py-2">{r.address}</td>
                <td className="px-4 py-2">{r.zone}</td>
                <td className="px-4 py-2 text-yellow-600 font-medium">{r.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => updateStatus(r.id, "Approved")}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "Declined")}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => setViewResident(r)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approved Residents Table */}
      <h2 className="text-xl font-semibold mb-2">Approved Residents</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <thead className="bg-green-100 dark:bg-green-900">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Family Size</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Zone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {approvedList.map((r) => (
              <tr key={r.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.age}</td>
                <td className="px-4 py-2">{r.family_size}</td>
                <td className="px-4 py-2">{r.address}</td>
                <td className="px-4 py-2">{r.zone}</td>
                <td className="px-4 py-2 text-green-600 font-medium">{r.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setViewResident(r)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Declined Residents Table */}
      <h2 className="text-xl font-semibold mb-2">Declined Residents</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <thead className="bg-red-100 dark:bg-red-900">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Age</th>
              <th className="px-4 py-2 text-left">Family Size</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Zone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {declinedList.map((r) => (
              <tr key={r.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.age}</td>
                <td className="px-4 py-2">{r.family_size}</td>
                <td className="px-4 py-2">{r.address}</td>
                <td className="px-4 py-2">{r.zone}</td>
                <td className="px-4 py-2 text-red-600 font-medium">{r.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setViewResident(r)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Resident Modal */}
      {viewResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
            <h3 className="text-lg font-semibold mb-4">{viewResident.name} - Details</h3>
            <button
              onClick={() => setViewResident(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✖
            </button>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>ID:</strong> {viewResident.id}
              </li>
              <li>
                <strong>Age:</strong> {viewResident.age}
              </li>
              <li>
                <strong>Family Size:</strong> {viewResident.family_size}
              </li>
              <li>
                <strong>Address:</strong> {viewResident.address}
              </li>
              <li>
                <strong>Contact:</strong> {viewResident.contact_number}
              </li>
              <li>
                <strong>Last Distribution:</strong> {viewResident.last_distribution}
              </li>
              <li>
                <strong>Notes:</strong> {viewResident.notes || "None"}
              </li>
              <li>
                <strong>Status:</strong> {viewResident.status}
              </li>

              <li>
                <strong>Zone:</strong> {viewResident.zone}
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Add New Resident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Add New Resident</h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✖
            </button>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newResident.name}
                onChange={(e) => setNewResident({ ...newResident, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Age"
                value={newResident.age}
                onChange={(e) => setNewResident({ ...newResident, age: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Family Size"
                value={newResident.family_size}
                onChange={(e) => setNewResident({ ...newResident, family_size: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Address"
                value={newResident.address}
                onChange={(e) => setNewResident({ ...newResident, address: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={newResident.contact_number}
                onChange={(e) => setNewResident({ ...newResident, contact_number: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                placeholder="Last Distribution"
                value={newResident.last_distribution}
                onChange={(e) => setNewResident({ ...newResident, last_distribution: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <select
                value={newResident.zone}
                onChange={(e) => setNewResident({ ...newResident, zone: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Zone</option>
                <option value="North Caloocan">North Caloocan</option>
                <option value="South Caloocan">South Caloocan</option>
              </select>
              <textarea
                placeholder="Notes"
                value={newResident.notes}
                onChange={(e) => setNewResident({ ...newResident, notes: e.target.value })}
                className="w-full p-2 border rounded"
                rows="3"
              />
              <button
                onClick={addNewResident}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Add Resident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
