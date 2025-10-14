import React, { useState } from "react";

const AdminIncidentPanel = () => {
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      incidentType: "fire",
      location: "Barangay 1, Caloocan",
      description: "Kitchen fire in residential house.",
      files: [{ name: "fire1.jpg", preview: null, size: 102400 }],
      timestamp: "2025-09-01 10:30 AM",
    },
    {
      id: 2,
      incidentType: "flood",
      location: "Barangay 3, Caloocan",
      description: "Flooded street due to heavy rain.",
      files: [],
      timestamp: "2025-09-01 11:00 AM",
    },
  ]);

  const [selectedIncidentIndex, setSelectedIncidentIndex] = useState(null);

  const openIncidentModal = (idx) => setSelectedIncidentIndex(idx);
  const closeIncidentModal = () => setSelectedIncidentIndex(null);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Incident Reports
      </h1>

      {/* INCIDENT TABLE */}
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Type</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Location</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Description</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Files</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc, idx) => (
              <tr
                key={inc.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600"
                onClick={() => openIncidentModal(idx)}
              >
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200 capitalize font-medium">{inc.incidentType}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{inc.location}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 truncate max-w-xs">{inc.description}</td>
                <td className="px-6 py-4">
                  <span className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2 py-1 rounded-full">
                    {inc.files.length}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">{inc.timestamp}</td>
              </tr>
            ))}
            {incidents.length === 0 && (
              <tr>
                <td className="px-6 py-4 text-gray-500 text-center" colSpan={5}>
                  No incidents received yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW INCIDENT MODAL */}
      {selectedIncidentIndex !== null && (
        <IncidentViewModal
          incident={incidents[selectedIncidentIndex]}
          onClose={closeIncidentModal}
        />
      )}
    </div>
  );
};

// Modal for viewing incident only
const IncidentViewModal = ({ incident, onClose }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl p-6 space-y-4 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold">Incident Details</h2>
        <div className="space-y-2">
          <p><strong>Type:</strong> {incident.incidentType}</p>
          <p><strong>Location:</strong> {incident.location}</p>
          <p><strong>Description:</strong> {incident.description}</p>
          <p><strong>Timestamp:</strong> {incident.timestamp}</p>
          {incident.files.length > 0 && (
            <div>
              <p><strong>Files:</strong></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {incident.files.map((f, idx) => (
                  <div key={idx} className="border rounded p-2 flex flex-col items-center">
                    {f.preview ? (
                      <img src={f.preview} alt={f.name} className="w-full h-24 object-cover mb-1" />
                    ) : (
                      <div className="w-full h-24 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        🎥
                      </div>
                    )}
                    <p className="truncate text-sm">{f.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(f.size)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminIncidentPanel;
