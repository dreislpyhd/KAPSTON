import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ToolResource() {
  const [resources, setResources] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    name: '',
    type: '',
    category: '',
    status: '',
    location: '',
    condition: '',
    assignedTo: '',
    lastMaintenance: '',
    nextMaintenance: '',
    description: ''
  });

  const fetchResources = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/coordination/resources.php');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Filter resources based on category and search
  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = ['All', ...new Set(resources.map(r => r.category))];

  // Open Add Modal
  const handleAdd = () => {
    setForm({
      name: '',
      type: '',
      category: '',
      status: '',
      location: '',
      condition: '',
      assignedTo: '',
      lastMaintenance: '',
      nextMaintenance: '',
      description: ''
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (resource) => {
    setForm({ ...resource });
    setCurrentResource(resource);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:8000/api/coordination/resources.php?id=${currentResource.id}`, form);
      } else {
        await axios.post('http://localhost:8000/api/coordination/resources.php', form);
      }
      fetchResources();
      setIsModalOpen(false);
      setCurrentResource(null);
    } catch (error) {
      console.error('Error submitting resource:', error);
      alert('Failed to save resource');
    }
  };

  // Delete resource
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`http://localhost:8000/api/coordination/resources.php?id=${id}`);
        fetchResources();
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Failed to delete resource');
      }
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentResource(null);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Use': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Out of Service': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Get condition color
  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Poor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden mx-1 mt-1 p-2 sm:p-4 lg:p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
      <div className="max-w-6xl mx-auto pb-8 min-h-full">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Resource Inventory Management</h1>
          <button
            onClick={handleAdd}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base font-medium w-full lg:w-auto"
          >
            + Add Resource
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 text-sm"
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-slate-400">
            {filteredResources.length} of {resources.length} resources
          </div>
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-slate-200">{resource.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{resource.type}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(resource)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Category:</span>
                  <span className="font-medium">{resource.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(resource.status)}`}>
                    {resource.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Condition:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(resource.condition)}`}>
                    {resource.condition}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Location:</span>
                  <span className="font-medium">{resource.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Assigned to:</span>
                  <span className="font-medium">{resource.assignedTo}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-600 dark:text-slate-400">{resource.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Table View */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-100 dark:bg-slate-800">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Resource</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Type</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Status</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Location</th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Assigned To</th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-3 sm:px-6 py-4">
                    <div>
                      <div className="font-medium text-sm sm:text-base">{resource.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{resource.category}</div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-sm sm:text-base">{resource.type}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-sm">{resource.location}</td>
                  <td className="hidden lg:table-cell px-6 py-4 text-sm">{resource.assignedTo}</td>
                  <td className="px-3 sm:px-6 py-4 text-center">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(resource)}
                        className="px-2 sm:px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="px-2 sm:px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl my-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">{isEdit ? 'Edit Resource' : 'Add New Resource'}</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Resource Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Personnel">Personnel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Emergency Medical">Emergency Medical</option>
                      <option value="Fire Response">Fire Response</option>
                      <option value="Rescue Gear">Rescue Gear</option>
                      <option value="Power Supply">Power Supply</option>
                      <option value="Communication">Communication</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Available">Available</option>
                      <option value="In Use">In Use</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Out of Service">Out of Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Condition</label>
                    <select
                      name="condition"
                      value={form.condition}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                      required
                    >
                      <option value="">Select Condition</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                      <option value="Active">Active</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned To</label>
                    <input
                      type="text"
                      name="assignedTo"
                      value={form.assignedTo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Maintenance</label>
                    <input
                      type="date"
                      name="lastMaintenance"
                      value={form.lastMaintenance}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Next Maintenance</label>
                    <input
                      type="date"
                      name="nextMaintenance"
                      value={form.nextMaintenance}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-slate-200"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded flex items-center justify-center"
                    onClick={handleCloseModal}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    {isEdit ? 'Update Resource' : 'Add Resource'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToolResource;
