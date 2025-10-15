import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Training() {
  const [events, setEvents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isScheduledDatesOpen, setIsScheduledDatesOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [deletedEvent, setDeletedEvent] = useState(null);
  const [undoCountdown, setUndoCountdown] = useState(0);
  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    type: '',
    participants: '',
    description: '',
    status: 'Scheduled'
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/coordination/tds.php');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Undo functionality
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let timer;
    if (undoCountdown > 0) {
      timer = setTimeout(() => {
        setUndoCountdown(undoCountdown - 1);
      }, 1000);
    } else if (undoCountdown === 0 && deletedEvent) {
      // Permanently delete after countdown reaches 0
      setEvents(prevEvents => prevEvents.filter(ev => ev.id !== deletedEvent.id));
      setDeletedEvent(null);
    }
    return () => clearTimeout(timer);
  }, [undoCountdown, deletedEvent]);

  // Navigation functions
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const handleDatePickerChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setCurrentYear(parseInt(year));
    setCurrentMonth(parseInt(month) - 1);
    setIsDatePickerOpen(false);
  };

  const openScheduledDates = () => {
    setIsScheduledDatesOpen(true);
  };

  const closeScheduledDates = () => {
    setIsScheduledDatesOpen(false);
  };

  const getScheduledDates = () => {
    const dates = [...new Set(events.map(event => event.date))];
    return dates.sort();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => event.date === date);
  };

  const isToday = (date) => {
    const today = new Date();
    return date === today.toISOString().split('T')[0];
  };

  const handleAdd = (date = '') => {
    setForm({
      title: '',
      date: date || '',
      time: '',
      duration: '',
      location: '',
      type: '',
      participants: '',
      description: '',
      status: 'Scheduled'
    });
    setIsEdit(false);
    setCurrentEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      date: event.date,
      time: event.time,
      duration: event.duration,
      location: event.location,
      type: event.type,
      participants: event.participants,
      description: event.description,
      status: event.status
    });
    setIsEdit(true);
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:8000/api/coordination/tds.php?id=${currentEvent.id}`, form);
      } else {
        await axios.post('http://localhost:8000/api/coordination/tds.php', form);
      }
      fetchEvents();
      setIsModalOpen(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    const eventToDelete = events.find(ev => ev.id === id);
    try {
        await axios.delete(`http://localhost:8000/api/coordination/tds.php?id=${id}`);
      setDeletedEvent(eventToDelete);
      setUndoCountdown(5);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleUndo = async () => {
    if (deletedEvent) {
      try {
        await axios.post('http://localhost:8000/api/coordination/tds.php', deletedEvent);
        setDeletedEvent(null);
        setUndoCountdown(0);
        fetchEvents();
      } catch (error) {
        console.error('Error undoing delete:', error);
        alert('Failed to undo delete');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEvent(null);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
  const calendar = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendar.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(event => event.date.split('T')[0] === date);
    calendar.push({
      day,
      date,
      events: dayEvents
    });
  }

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden mx-1 mt-1 p-2 sm:p-4 lg:p-6 dark:bg-slate-900 bg-white dark:text-slate-300 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
      <div className="max-w-6xl mx-auto pb-8 min-h-full">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Training & Drill Scheduling</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={openScheduledDates}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium"
            >
              View Scheduled Dates
            </button>
            <button
              onClick={() => handleAdd()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              + Add Event
            </button>
          </div>
        </div>

        {/* Undo Notification */}
        {deletedEvent && undoCountdown > 0 && (
          <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Event Deleted</p>
                <p className="text-sm">{deletedEvent.title}</p>
                <p className="text-xs">Undo in {undoCountdown}s</p>
              </div>
              <button
                onClick={handleUndo}
                className="ml-4 px-3 py-1 bg-white text-red-500 rounded text-sm font-medium hover:bg-gray-100"
              >
                Undo
              </button>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                ←
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                →
              </button>
            </div>
            <button
              onClick={openDatePicker}
              className="text-xl sm:text-2xl font-bold hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              {monthNames[currentMonth]} {currentYear}
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center font-semibold text-sm text-gray-600 dark:text-slate-400">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendar.map((day, index) => (
              <div
                key={index}
                className={`min-h-[80px] sm:min-h-[100px] p-2 border border-gray-200 dark:border-slate-700 ${
                  day ? 'hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer' : 'bg-gray-50 dark:bg-slate-900'
                } ${day && isToday(day.date) ? 'bg-blue-100 dark:bg-blue-900/20' : ''}`}
                onClick={() => day && handleAdd(day.date)}
              >
                {day && (
                  <>
                    <div className="text-sm font-medium mb-1">{day.day}</div>
                    {day.events.length > 0 && (
                      <div className="space-y-1">
                        {day.events.slice(0, 2).map(event => {
                          const time12 = new Date(`1970-01-01T${event.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                          return (
                            <div
                              key={event.id}
                              className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 truncate"
                              title={`${event.title} - ${time12}`}
                            >
                              {event.title} - {time12}
                            </div>
                          );
                        })}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-slate-400">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Event</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Date & Time</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Location</th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Type</th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-3 sm:px-6 py-4">
                      <div>
                        <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-slate-200">{event.title}</div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">{event.participants}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div>{event.date}</div>
                      <div className="text-gray-500 dark:text-slate-400">{event.time} ({event.duration})</div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-sm">{event.location}</td>
                    <td className="hidden lg:table-cell px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.type === 'Training' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        event.type === 'Drill' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {event.type}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-center">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(event)}
                          className="px-2 sm:px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
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
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl my-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold">{isEdit ? 'Edit Event' : 'Add New Event'}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Event Title</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="e.g., 2 hours"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Training">Training</option>
                      <option value="Drill">Drill</option>
                      <option value="Meeting">Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Participants</label>
                    <input
                      type="text"
                      name="participants"
                      value={form.participants}
                      onChange={handleChange}
                      placeholder="e.g., All Staff"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                      required
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    {isEdit ? 'Update Event' : 'Add Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Date Picker Modal */}
        {isDatePickerOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Select Month & Year</h3>
              <input
                type="month"
                value={`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`}
                onChange={handleDatePickerChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsDatePickerOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Dates Modal */}
        {isScheduledDatesOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-2xl my-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Scheduled Dates</h2>
                <button
                  onClick={closeScheduledDates}
                  className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                {getScheduledDates().map(date => (
                  <div key={date} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</h3>
                    <div className="space-y-2">
                      {getEventsForDate(date).map(event => (
                        <div key={event.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-slate-700 rounded">
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-gray-600 dark:text-slate-400">
                              {event.time} - {event.location}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            event.type === 'Training' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            event.type === 'Drill' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Training;
