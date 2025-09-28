"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SearchFilters = ({ onFiltersChange, isOpen, setIsOpen }) => {
  const [filters, setFilters] = useState({
    search: "",
    prakriti: [],
    vikriti: [],
    ageGroup: [],
    gender: [],
    dietaryPreference: [],
    appointmentHistory: []
  });

  const prakritiOptions = [
    { value: "vata", label: "Vata", color: "bg-blue-100 text-blue-800" },
    { value: "pitta", label: "Pitta", color: "bg-red-100 text-red-800" },
    { value: "kapha", label: "Kapha", color: "bg-green-100 text-green-800" }
  ];

  const vikritiOptions = [
    { value: "vata", label: "Vata Imbalance", intensity: 0 },
    { value: "pitta", label: "Pitta Imbalance", intensity: 0 },
    { value: "kapha", label: "Kapha Imbalance", intensity: 0 }
  ];

  const ageGroups = [
    { value: "0-18", label: "0-18 years" },
    { value: "19-35", label: "19-35 years" },
    { value: "36-50", label: "36-50 years" },
    { value: "51-65", label: "51-65 years" },
    { value: "65+", label: "65+ years" }
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];

  const dietaryPreferences = [
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "non-vegetarian", label: "Non-Vegetarian" },
    { value: "ayurvedic", label: "Ayurvedic Diet" },
    { value: "keto", label: "Keto" },
    { value: "gluten-free", label: "Gluten-Free" }
  ];

  const appointmentHistoryOptions = [
    { value: "new", label: "New Patients" },
    { value: "regular", label: "Regular Patients" },
    { value: "follow-up", label: "Follow-up Required" },
    { value: "missed", label: "Missed Appointments" }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const handleVikritiIntensityChange = (vikriti, intensity) => {
    setFilters(prev => ({
      ...prev,
      vikriti: prev.vikriti.map(v => 
        v.value === vikriti ? { ...v, intensity } : v
      )
    }));
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      prakriti: [],
      vikriti: [],
      ageGroup: [],
      gender: [],
      dietaryPreference: [],
      appointmentHistory: []
    });
    onFiltersChange({
      search: "",
      prakriti: [],
      vikriti: [],
      ageGroup: [],
      gender: [],
      dietaryPreference: [],
      appointmentHistory: []
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Filters Panel */}
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: isOpen ? 0 : -400 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full w-96 bg-white shadow-2xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-[#4C8C4A]/20"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#4C8C4A]/20 bg-gradient-to-r from-[#4C8C4A]/5 to-[#2A9D8F]/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#7A5C3A]">Search & Filters</h2>
                <p className="text-sm text-[#7A5C3A]/70 font-[var(--font-noto-serif-devanagari)]">
                  रोगी खोज और फिल्टर
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 rounded-lg text-[#7A5C3A] hover:bg-[#4C8C4A]/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
                Search Patients
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by name, ID, or condition..."
                  className="w-full px-4 py-3 pl-10 border border-[#4C8C4A]/20 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7A5C3A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Prakriti Type */}
            <div>
              <label className="block text-sm font-semibold text-[#7A5C3A] mb-3">
                Prakriti Type
              </label>
              <div className="space-y-2">
                {prakritiOptions.map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ x: 4 }}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.prakriti.includes(option.value)}
                      onChange={() => handleFilterChange('prakriti', option.value)}
                      className="w-4 h-4 text-[#4C8C4A] border-[#4C8C4A]/20 rounded focus:ring-[#4C8C4A]/20"
                    />
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${option.color}`}>
                      {option.label}
                    </span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Vikriti with Intensity Sliders */}
            <div>
              <label className="block text-sm font-semibold text-[#7A5C3A] mb-3">
                Vikriti (Imbalance Intensity)
              </label>
              <div className="space-y-4">
                {vikritiOptions.map((option) => (
                  <div key={option.value} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#7A5C3A]">
                        {option.label}
                      </span>
                      <span className="text-xs text-[#7A5C3A]/60">
                        {option.intensity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={option.intensity}
                      onChange={(e) => handleVikritiIntensityChange(option.value, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-sm font-semibold text-[#7A5C3A] mb-3">
                Age Group
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ageGroups.map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-[#4C8C4A]/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.ageGroup.includes(option.value)}
                      onChange={() => handleFilterChange('ageGroup', option.value)}
                      className="w-4 h-4 text-[#4C8C4A] border-[#4C8C4A]/20 rounded focus:ring-[#4C8C4A]/20"
                    />
                    <span className="text-sm text-[#7A5C3A]">{option.label}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-[#7A5C3A] mb-3">
                Gender
              </label>
              <div className="space-y-2">
                {genderOptions.map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ x: 4 }}
                    className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#4C8C4A]/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.gender.includes(option.value)}
                      onChange={() => handleFilterChange('gender', option.value)}
                      className="w-4 h-4 text-[#4C8C4A] border-[#4C8C4A]/20 rounded focus:ring-[#4C8C4A]/20"
                    />
                    <span className="text-sm text-[#7A5C3A]">{option.label}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-sm font-semibold text-[#7A5C3A] mb-3">
                Dietary Preference
              </label>
              <div className="space-y-2">
                {dietaryPreferences.map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ x: 4 }}
                    className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#4C8C4A]/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.dietaryPreference.includes(option.value)}
                      onChange={() => handleFilterChange('dietaryPreference', option.value)}
                      className="w-4 h-4 text-[#4C8C4A] border-[#4C8C4A]/20 rounded focus:ring-[#4C8C4A]/20"
                    />
                    <span className="text-sm text-[#7A5C3A]">{option.label}</span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Appointment History */}
            <div>
              <label className="block text-sm font-semibold text-[#7A5C3A] mb-3">
                Appointment History
              </label>
              <div className="space-y-2">
                {appointmentHistoryOptions.map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ x: 4 }}
                    className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#4C8C4A]/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.appointmentHistory.includes(option.value)}
                      onChange={() => handleFilterChange('appointmentHistory', option.value)}
                      className="w-4 h-4 text-[#4C8C4A] border-[#4C8C4A]/20 rounded focus:ring-[#4C8C4A]/20"
                    />
                    <span className="text-sm text-[#7A5C3A]">{option.label}</span>
                  </motion.label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-[#4C8C4A]/20 bg-gradient-to-r from-[#4C8C4A]/5 to-[#2A9D8F]/5">
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="flex-1 px-4 py-3 border border-[#4C8C4A]/20 text-[#7A5C3A] rounded-xl font-semibold hover:bg-[#4C8C4A]/10 transition-all duration-300"
              >
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={applyFilters}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Apply Filters
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SearchFilters;
