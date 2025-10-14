import React, { useState } from "react";
import { Plus, Send } from "lucide-react";

export default function SafetyGuidelinesAdmin({ onSendToUser }) {
  const [guidelines, setGuidelines] = useState([
    {
      category: "Fire",
      tips: [
        "Install smoke detectors in every room.",
        "Keep a fire extinguisher accessible.",
        "Plan evacuation routes for your family."
      ],
    },
    {
      category: "Flood",
      tips: [
        "Move to higher ground immediately.",
        "Keep emergency supplies in waterproof containers.",
        "Do not walk or drive through floodwaters."
      ],
    },
    {
      category: "Earthquake",
      tips: [
        "Drop, cover, and hold on during shaking.",
        "Secure heavy furniture to walls.",
        "Keep emergency kits ready."
      ],
    },
    {
      category: "Power Outage",
      tips: [
        "Keep flashlights and batteries ready.",
        "Unplug electrical appliances to avoid surge damage.",
        "Use generators safely outdoors only."
      ],
    },
    {
      category: "Volcanic Eruption",
      tips: [
        "Stay indoors and keep windows closed.",
        "Wear masks to prevent ash inhalation.",
        "Have emergency evacuation plans ready."
      ],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentTips, setCurrentTips] = useState([""]);

  // Open modal for new or edit
  const openModal = (idx = null) => {
    if (idx !== null) {
      setEditIndex(idx);
      setCurrentCategory(guidelines[idx].category);
      setCurrentTips([...guidelines[idx].tips]);
    } else {
      setEditIndex(null);
      setCurrentCategory("");
      setCurrentTips([""]);
    }
    setShowModal(true);
  };

  // Add new tip input
  const addTip = () => setCurrentTips((prev) => [...prev, ""]);

  // Update tip
  const updateTip = (i, value) => {
    const updated = [...currentTips];
    updated[i] = value;
    setCurrentTips(updated);
  };

  // Delete tip
  const deleteTip = (i) => {
    const updated = [...currentTips];
    updated.splice(i, 1);
    setCurrentTips(updated);
  };

  // Save guideline (new or edited)
  const saveGuideline = () => {
    if (!currentCategory || currentTips.some((t) => !t)) {
      alert("Please fill in category and all tips.");
      return;
    }

    const updatedGuidelines = [...guidelines];
    if (editIndex !== null) {
      updatedGuidelines[editIndex] = { category: currentCategory, tips: currentTips };
    } else {
      updatedGuidelines.push({ category: currentCategory, tips: currentTips });
    }
    setGuidelines(updatedGuidelines);
    setShowModal(false);
  };

  // Delete guideline
  const deleteGuideline = () => {
    const updated = [...guidelines];
    updated.splice(editIndex, 1);
    setGuidelines(updated);
    setShowModal(false);
  };

  // Send guideline to user page
  const sendToUser = (idx) => {
    if (onSendToUser) {
      onSendToUser(guidelines[idx]);
      alert(`Guidelines for ${guidelines[idx].category} sent to users.`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 space-y-6">
      <h2 className="text-2xl font-bold">Safety Guidelines & Preparedness</h2>

      <button
        onClick={() => openModal()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add New Guideline
      </button>

      <div className="space-y-4 mt-4">
        {guidelines.map((g, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => openModal(idx)}
          >
            <h3 className="font-semibold text-lg mb-2">{g.category}</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {g.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
            <button
              onClick={(e) => { e.stopPropagation(); sendToUser(idx); }}
              className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send to Users
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">{editIndex !== null ? "Edit Guideline" : "Add Guideline"}</h3>
            <input
              type="text"
              placeholder="Category (e.g., Fire)"
              value={currentCategory}
              onChange={(e) => setCurrentCategory(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <div className="space-y-2">
              {currentTips.map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => updateTip(i, e.target.value)}
                    className="flex-1 p-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={() => deleteTip(i)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addTip}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Add Tip
            </button>
            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
              {editIndex !== null && (
                <button
                  onClick={deleteGuideline}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Delete
                </button>
              )}
              <button
                onClick={saveGuideline}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
