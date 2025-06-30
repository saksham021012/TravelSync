import React, { useState, useEffect } from 'react';

const CreateTripModal = ({ isOpen, onClose, onSave, initialData = {}, mode = 'create' }) => {
    const [tripName, setTripName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [flightNumber, setFlightNumber] = useState('');
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState('');

    useEffect(() => {
        if (initialData && mode !== 'create') {
            setTripName(initialData.title || '');
            setStartDate(initialData.startDate ? initialData.startDate.slice(0, 10) : '');
            setEndDate(initialData.endDate ? initialData.endDate.slice(0, 10) : '');

            setFlightNumber(initialData.flightNumber || '');
            //locations array
            if (Array.isArray(initialData.locations)) {
                const locs = initialData.locations.map(loc => {
                    if (typeof loc === 'string') return loc;
                    if (typeof loc === 'object' && loc.city) return loc.city;
                    return '';
                }).filter(Boolean);
                setLocations(locs);
            } else {
                setLocations([]);
            }

        } else {
            setTripName('');
            setStartDate('');
            setEndDate('');
            setFlightNumber('');
            setLocations([]);
        }
        setNewLocation('');
    }, [initialData, mode]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };

    }, [isOpen]);

    const handleAddLocation = () => {
        if (newLocation.trim()) {
            setLocations([...locations, newLocation.trim()]);
            setNewLocation('');
        }
    };

    const handleRemoveLocation = (index) => {
        const updated = [...locations];
        updated.splice(index, 1);
        setLocations(updated);
    };

    const handleSubmit = () => {
        if (!tripName.trim() || !startDate || !endDate || !flightNumber.trim()) {
            alert('Please fill in all required fields: Trip Name, Start Date, End Date, and Flight Number.');
            return;
        }

        const data = {
            title: tripName.trim(),
            startDate,
            endDate,
            flightNumber: flightNumber.trim(),
            userLocations: locations,
        };

        onSave(data);
    };

    const handleViewItinerary = () => {
        window.location.href = '/my-itineraries';
    };

    const handleManageItinerary = () => {
        window.location.href = '/my-itineraries';
    };

    const isFormValid = tripName && startDate && endDate && flightNumber;
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 md:p-8 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-800">
                        {mode === 'edit' ? 'Edit Trip' : mode === 'view' ? 'Trip Details' : 'Create New Trip'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 text-2xl font-semibold hover:text-slate-700 px-2"
                    >
                        &times;
                    </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                    {/* Trip Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Trip Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={tripName}
                            onChange={(e) => setTripName(e.target.value)}
                            disabled={mode === 'view'}
                            placeholder="Enter trip name"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-200 disabled:bg-slate-100"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                disabled={mode === 'view'}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-200 disabled:bg-slate-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">End Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                disabled={mode === 'view'}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-200 disabled:bg-slate-100"
                            />
                        </div>
                    </div>

                    {/* Flight Number */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Flight Number <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={flightNumber}
                            onChange={(e) => setFlightNumber(e.target.value)}
                            disabled={mode === 'view' || mode === 'edit'}
                            placeholder="Enter flight number"
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-200 disabled:bg-slate-100"
                        />
                        {mode === 'edit' && (
                            <p className="text-xs text-red-500 mt-1">
                                To change the flight number, please delete this trip and create a new one.
                            </p>
                        )}
                    </div>

                    {/* Locations Section - Only show when creating */}
                    {mode === 'create' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Locations (Optional)</label>

                            {/* Input to add new location */}
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="Enter city name"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddLocation}
                                    className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                                >
                                    + Add
                                </button>
                            </div>

                            {/* Location List */}
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {locations.map((loc, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-md"
                                    >
                                        <span className="text-slate-700">{loc}</span>
                                        <button
                                            onClick={() => handleRemoveLocation(idx)}
                                            className="text-red-500 text-xl hover:text-red-600"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View Itinerary - Show when viewing */}
                    {mode === 'view' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">Itinerary</label>
                            <button
                                onClick={handleViewItinerary}
                                className="w-full px-4 cursor-pointer py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium text-center"
                            >
                                View Itinerary
                            </button>
                        </div>
                    )}

                    {/* Manage Itinerary - Show when editing */}
                    {mode === 'edit' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">Itinerary</label>
                            <button
                                onClick={handleManageItinerary}
                                className="w-full px-4 py-3 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium text-center"
                            >
                                Manage Itinerary
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-8 gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    >
                        {mode === 'view' ? 'Close' : 'Cancel'}
                    </button>
                    {mode !== 'view' && (
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                            className={`px-4 py-2 rounded-md cursor-pointer text-white transition ${isFormValid
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : 'bg-purple-300 cursor-not-allowed'
                                }`}
                        >
                            {mode === 'edit' ? 'Update Trip' : 'Create Trip'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateTripModal;