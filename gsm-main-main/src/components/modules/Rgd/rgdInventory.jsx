import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RgdInventory() {
  const [inventory, setInventory] = useState([]);

  // Fetch inventory data from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost/gsm-main-main/backend3/api/rgd/inventory.php');
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    fetchInventory();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', quantity: '', status: '' });

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost/gsm-main-main/backend3/api/rgd/inventory.php?id=${id}`);
      setInventory(inventory.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  // Edit handler
  const handleEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      status: item.status,
    });
    setIsModalOpen(true);
    setIsAddModal(false);
  };

  // Add handler
  const handleAdd = () => {
    setForm({ name: '', category: '', quantity: '', status: '' });
    setIsAddModal(true);
    setIsModalOpen(true);
  };

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAddModal) {
        // Add new item
        await axios.post('http://localhost/gsm-main-main/backend3/api/rgd/inventory.php', { ...form, quantity: Number(form.quantity) });
      } else {
        // Edit existing item
        await axios.put(`http://localhost/gsm-main-main/backend3/api/rgd/inventory.php?id=${editItem.id}`, { ...form, quantity: Number(form.quantity) });
      }
      setIsModalOpen(false);
      setEditItem(null);
      setIsAddModal(false);
      // Refresh inventory
      const response = await axios.get('http://localhost/gsm-main-main/backend3/api/rgd/inventory.php');
      setInventory(response.data);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  // Modal close handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
    setIsAddModal(false);
  };

  // Populate sample data
  const handlePopulateSampleData = async () => {
    const sampleData = [
      { name: 'Rice', category: 'Food', quantity: 120, status: 'Available' },
      { name: 'Blankets', category: 'Non-food', quantity: 80, status: 'Low Stock' },
      { name: 'Water Bottles', category: 'Food', quantity: 200, status: 'Available' },
      { name: 'Medicine Kits', category: 'Medical', quantity: 40, status: 'Critical' },
    ];
    try {
      for (const item of sampleData) {
        await axios.post('http://localhost/gsm-main-main/backend3/api/rgd/inventory.php', item);
      }
      // Refresh inventory
      const response = await axios.get('http://localhost/gsm-main-main/backend3/api/rgd/inventory.php');
      setInventory(response.data);
      alert('Sample data added successfully');
    } catch (error) {
      console.error('Error populating sample data:', error);
      alert('Failed to add sample data');
    }
  };

  return (
    <div className="mx-1 mt-1 p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg shadow-lg h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
      <h1 className="text-2xl font-bold mb-4">Relief Inventory</h1>
      <div className="mb-4 flex gap-2">
        <button
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          onClick={handleAdd}
        >
          Add New Item
        </button>
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          onClick={handlePopulateSampleData}
        >
          Populate Sample Data
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-100 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Item Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Category</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
            {inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.category}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.quantity}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'Available'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : item.status === 'Low Stock'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <button
                    className="mr-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{isAddModal ? 'Add New Item' : 'Edit Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  {isAddModal ? 'Add' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RgdInventory;
// Relief Inventory Component
// Sub Module of Relief Distribution Management
