import React, { useState } from "react";
import { Phone, Plus } from "lucide-react";

export default function EmergencyHotlines() {
  const [hotlines, setHotlines] = useState([
    {
      label: "📱 Mobile Contact Numbers (rescue & DRRMO)",
      numbers: ["0916‑797‑6365", "0947‑796‑4372"],
    },
    {
      label: "🏥 Caloocan City DRRMO Rescue Trunkline",
      numbers: ["(02) 5310‑7536 | local 2287"],
    },
    {
      label: "📞 Other Useful Local Hotlines",
      numbers: [
        "Caloocan City North Medical Center: 5310‑1463 (Emergency Room)",
        "Caloocan City Hall Security / PNP Precinct: (02) 8288‑8811",
      ],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editNumbers, setEditNumbers] = useState([]);

  // Add new hotline
  const addHotline = () => {
    if (!newLabel || !newNumber) {
      alert("Please fill in both label and number.");
      return;
    }
    setHotlines((prev) => [...prev, { label: newLabel, numbers: [newNumber] }]);
    setNewLabel("");
    setNewNumber("");
    setShowAddModal(false);
  };

  // Open edit modal for entire category
  const openEditModal = (idx) => {
    setEditIndex(idx);
    setEditLabel(hotlines[idx].label);
    setEditNumbers([...hotlines[idx].numbers]);
    setShowEditModal(true);
  };

  // Update category and numbers
  const saveEdit = () => {
    if (!editLabel || editNumbers.some((num) => !num)) {
      alert("Please fill in label and all numbers.");
      return;
    }
    const updated = [...hotlines];
    updated[editIndex] = { label: editLabel, numbers: editNumbers };
    setHotlines(updated);
    setShowEditModal(false);
  };

  // Delete entire category
  const deleteCategory = () => {
    const updated = [...hotlines];
    updated.splice(editIndex, 1);
    setHotlines(updated);
    setShowEditModal(false);
  };

  // Update a specific number in edit modal
  const updateNumber = (idx, value) => {
    const updatedNumbers = [...editNumbers];
    updatedNumbers[idx] = value;
    setEditNumbers(updatedNumbers);
  };

  // Delete a number from the category
  const deleteNumber = (idx) => {
    const updatedNumbers = [...editNumbers];
    updatedNumbers.splice(idx, 1);
    setEditNumbers(updatedNumbers);
  };

  // Add a new number in edit modal
  const addNumber = () => setEditNumbers((prev) => [...prev, ""]);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 space-y-6">
      <h2 className="text-2xl font-bold">Emergency Hotlines</h2>

      <button
        onClick={() => setShowAddModal(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add New Hotline
      </button>

      <div className="space-y-6 mt-4">
        {hotlines.map((h, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => openEditModal(idx)}
          >
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {h.label}
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {h.numbers.map((num, i) => (
                <li key={i}>{num}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">Add New Hotline</h3>
            <input
              type="text"
              placeholder="Category / Label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              placeholder="Number"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addHotline}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">Edit Hotline Category</h3>
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <div className="space-y-2">
              {editNumbers.map((num, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={num}
                    onChange={(e) => updateNumber(i, e.target.value)}
                    className="flex-1 p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={() => deleteNumber(i)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addNumber}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Add Number
            </button>
            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
              >
                Save
              </button>
              <button
                onClick={deleteCategory}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
