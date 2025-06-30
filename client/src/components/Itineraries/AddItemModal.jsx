// components/Itinerary/AddItemModal.jsx
import React, { useEffect, useState } from 'react';
// Removed react-icons import to avoid compatibility issues

const AddItemModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    startTime: '',
    endTime: '',
  });

  const requiredFields = ['title', 'type', 'startTime', 'endTime'];

  const isValid = requiredFields.every(field => formData[field]?.trim() !== '');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        location: initialData.location || '',
        type: initialData.type || 'activity',
        startTime: initialData.time || '10:00 AM',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        location: '',
        type: 'activity',
        startTime: '10:00 AM',
      });
    }
  }, [initialData]);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleEsc);

      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    } else {
      document.body.style.overflow = '';
      setFormData({
        title: '',
        description: '',
        location: '',
        type: '',
        startTime: '',
        endTime: '',
      });
    }
  }, [isOpen, onClose]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isValid) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-white/10 flex items-center justify-center z-50 px-4 sm:px-6">
      <div className="bg-white rounded-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl overflow-y-auto max-h-[90vh] transform transition-all p-4 sm:p-6">
        <div className="flex justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-black transition duration-150 text-2xl sm:text-3xl font-semibold"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:ring-2 focus:ring-purple-200 focus:outline-none"
              placeholder="Enter activity title"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:ring-2 focus:ring-purple-200 focus:outline-none min-h-[80px]"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:ring-2 focus:ring-purple-200 focus:outline-none"
              placeholder="Enter location"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none"
              required
            >
              <option value="">Select type</option>
              <option value="Activity"> Activity</option>
              <option value="Food"> Food</option>
              <option value="Transport"> Transport</option>
              <option value="Hotel"> Hotel</option>
              <option value="Custom"> Custom</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium text-gray-700 mb-1">End Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  );

};

export default AddItemModal;