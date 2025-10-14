import React, { useState } from 'react';

function DisasterAlertAdmin() {
  const [alerts, setAlerts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    level: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [selectedAlertIndex, setSelectedAlertIndex] = useState(null);
  const [selectedBarangays, setSelectedBarangays] = useState([]);
  const [modalFormData, setModalFormData] = useState({
    name: '',
    description: '',
    type: '',
    level: '',
  });
  const [history, setHistory] = useState([]);

  const barangays = ["Brgy 1", "Brgy 2", "Brgy 3", "Brgy 4", "Brgy 5"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateAlert = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.level) {
      alert('Please fill in all required fields.');
      return;
    }

    const newAlert = { ...formData };

    if (editIndex !== null) {
      const updatedAlerts = [...alerts];
      updatedAlerts[editIndex] = newAlert;
      setAlerts(updatedAlerts);
      setEditIndex(null);
    } else {
      setAlerts([...alerts, newAlert]);
    }

    setFormData({ name: '', description: '', type: '', level: '' });
  };

  const openAlertModal = (idx) => {
    setSelectedAlertIndex(idx);
    setModalFormData(alerts[idx]);
    setSelectedBarangays([]);
  };

  const closeAlertModal = () => {
    setSelectedAlertIndex(null);
  };

  const handleModalChange = (e) => {
    setModalFormData({ ...modalFormData, [e.target.name]: e.target.value });
  };

  const saveAlertChanges = () => {
    if (!modalFormData.name || !modalFormData.type || !modalFormData.level) {
      alert('Please fill in all required fields.');
      return;
    }
    const updatedAlerts = [...alerts];
    updatedAlerts[selectedAlertIndex] = modalFormData;
    setAlerts(updatedAlerts);
    closeAlertModal();
  };

  const deleteAlert = () => {
    const updatedAlerts = [...alerts];
    updatedAlerts.splice(selectedAlertIndex, 1);
    setAlerts(updatedAlerts);
    closeAlertModal();
  };

  const toggleBarangay = (barangay) => {
    setSelectedBarangays((prev) =>
      prev.includes(barangay)
        ? prev.filter((b) => b !== barangay)
        : [...prev, barangay]
    );
  };

  const sendAlert = () => {
    if (selectedBarangays.length === 0) {
      alert("Select at least one barangay to send the alert.");
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        ...modalFormData,
        sentTo: [...selectedBarangays],
        timestamp: new Date().toLocaleString(),
      },
    ]);

    alert(`Alert "Disaster Alert: ${modalFormData.name}" sent to: ${selectedBarangays.join(", ")}`);
    closeAlertModal();
  };

  const sendAllAlert = () => {
    if (!modalFormData.name || !modalFormData.type || !modalFormData.level) {
      alert('Please fill in all required fields.');
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        ...modalFormData,
        sentTo: [...barangays],
        timestamp: new Date().toLocaleString(),
      },
    ]);

    alert(`Alert "Disaster Alert: ${modalFormData.name}" sent to ALL barangays: ${barangays.join(", ")}`);
    closeAlertModal();
  };

  return (
    <div className='mx-1 mt-1 p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800'>
      <h1 className="text-2xl font-bold mb-4">Disaster Alert Admin Panel</h1>

      <div className="lg:flex gap-6">
        {/* LEFT SIDE: Form + Existing Alerts */}
        <div className="flex-1 space-y-6">
          {/* Add/Edit Alert Form */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{editIndex !== null ? "Edit Alert" : "Add Alert"}</h2>
            <form onSubmit={handleAddOrUpdateAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Alert Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="e.g., Heavy Flood Warning"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Alert Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Detailed information about the alert"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Alert Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select Type</option>
                    <option value="Flood">Flood</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Typhoon">Typhoon</option>
                    <option value="Fire">Fire</option>
                    <option value="Volcanic Eruption">Volcanic Eruption</option>
                    <option value="Power Outage">Power Outage</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Alert Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select Level</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-white ${editIndex !== null ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {editIndex !== null ? "Update Alert" : "Add Alert"}
              </button>
            </form>
          </div>

          {/* Existing Alerts Table */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Existing Alerts</h2>
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No alerts added yet.</p>
            ) : (
              <div className="w-full overflow-hidden">
                <table className="w-full table-auto text-base border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert, idx) => {
                      const levelColor =
                        alert.level === "High"
                          ? "text-red-600 font-semibold"
                          : alert.level === "Moderate"
                          ? "text-yellow-600 font-semibold"
                          : "text-green-600 font-semibold";
                      return (
                        <tr
                          key={idx}
                          className={`cursor-pointer transition duration-150
                          ${selectedAlertIndex === idx ? 'bg-yellow-100 dark:bg-yellow-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                          onClick={() => openAlertModal(idx)}
                        >
                          <td className="border-t px-4 py-3 font-medium break-words">Disaster Alert: {alert.name}</td>
                          <td className="border-t px-4 py-3 break-words truncate max-w-xs" title={alert.description || ''}>{alert.description || '-'}</td>
                          <td className="border-t px-4 py-3 break-words">{alert.type || '-'}</td>
                          <td className={`border-t px-4 py-3 break-words ${levelColor}`}>{alert.level || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Alert History */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Alert History</h2>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No alerts sent yet.</p>
            ) : (
              <ul className="space-y-3">
                {history.map((h, idx) => {
                  const levelColor =
                    h.level === "High"
                      ? "bg-red-600 text-white"
                      : h.level === "Moderate"
                      ? "bg-yellow-500 text-black"
                      : "bg-green-500 text-white";

                  return (
                    <li
                      key={idx}
                      className="p-3 border rounded-lg bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                      title={h.description}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${levelColor}`}>
                          {h.level}
                        </span>
                        <span className="text-gray-400 dark:text-gray-300 text-xs">{h.timestamp}</span>
                      </div>
                      <h3 className="font-semibold mt-1">Disaster Alert: {h.name}</h3>
                      {h.description && (
                        <p
                          className="text-sm text-gray-600 dark:text-gray-300 truncate"
                          title={h.description}
                        >
                          {h.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sent to: {h.sentTo.join(", ")}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedAlertIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Disaster Alert: {modalFormData.name}</h3>
              <button
                onClick={closeAlertModal}
                className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Alert Name *</label>
                <input
                  type="text"
                  name="name"
                  value={modalFormData.name}
                  onChange={handleModalChange}
                  className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Alert Description</label>
                <textarea
                  name="description"
                  value={modalFormData.description}
                  onChange={handleModalChange}
                  className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Alert Type *</label>
                  <select
                    name="type"
                    value={modalFormData.type}
                    onChange={handleModalChange}
                    className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select Type</option>
                    <option value="Flood">Flood</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Typhoon">Typhoon</option>
                    <option value="Fire">Fire</option>
                    <option value="Volcanic Eruption">Volcanic Eruption</option>
                    <option value="Power Outage">Power Outage</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Alert Level *</label>
                  <select
                    name="level"
                    value={modalFormData.level}
                    onChange={handleModalChange}
                    className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select Level</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Select Barangays to send alert</label>
                <div className="flex flex-col max-h-40 overflow-y-auto border rounded p-2 bg-white dark:bg-gray-700">
                  {barangays.map((b) => (
                    <label key={b} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedBarangays.includes(b)}
                        onChange={() => toggleBarangay(b)}
                        className="w-4 h-4"
                      />
                      {b}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={saveAlertChanges}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={sendAlert}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Send Alert
                </button>
                <button
                  onClick={sendAllAlert}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send All Alert
                </button>
                <button
                  onClick={deleteAlert}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisasterAlertAdmin;
