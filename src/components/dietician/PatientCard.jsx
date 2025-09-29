"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import dataService from "../../services/dataService";

const PatientCard = ({ patient, onClick, index }) => {
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDeletePatient = (e) => {
    e.stopPropagation(); // Prevent card click
    if (showDeleteConfirm) {
      // Perform delete
      try {
        dataService.deletePatient(patient.id);
        // Dispatch custom event to refresh patient list
        window.dispatchEvent(new CustomEvent('patientsUpdated'));
        alert(`Patient ${patient.name} has been deleted successfully.`);
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Error deleting patient. Please try again.');
      }
      setShowDeleteConfirm(false);
    } else {
      // Show confirmation
      setShowDeleteConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const getDoshaColor = (dosha) => {
    switch (dosha.toLowerCase()) {
      case 'vata': return 'from-blue-400 to-blue-600';
      case 'pitta': return 'from-red-400 to-red-600';
      case 'kapha': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(76, 140, 74, 0.15)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl p-6 shadow-lg border border-[#4C8C4A]/10 cursor-pointer transition-all duration-300 hover:shadow-2xl group relative"
    >
      {/* Delete Button - appears on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleDeletePatient}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
              showDeleteConfirm 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
            }`}
            title={showDeleteConfirm ? `Click again to delete ${patient.name}` : "Delete patient"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
      {/* Patient Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#4C8C4A] to-[#2A9D8F] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {patient.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </motion.div>
          
          <div>
            <h3 className="text-lg font-bold text-[#7A5C3A] group-hover:text-[#4C8C4A] transition-colors">
              {patient.name}
            </h3>
            <p className="text-sm text-[#7A5C3A]/70">
              {patient.age} years • {patient.gender}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(patient.priority)}`}>
            {patient.priority} Priority
          </span>
          <span className="text-xs text-[#7A5C3A]/60">
            ID: {patient.id}
          </span>
        </div>
      </div>

      {/* Dosha Information */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#7A5C3A]">Prakriti</span>
          <span className="text-xs text-[#7A5C3A]/60">Last Visit: {patient.lastVisit}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getDoshaColor(patient.prakriti)}`}></div>
          <span className="text-sm font-medium text-[#7A5C3A] capitalize">
            {patient.prakriti} Dominant
          </span>
          {patient.vikriti && (
            <>
              <span className="text-[#7A5C3A]/40">•</span>
              <span className="text-xs text-[#7A5C3A]/60">
                Vikriti: {typeof patient.vikriti === 'object' 
                  ? Object.entries(patient.vikriti)
                      .filter(([_, value]) => value > 0)
                      .map(([dosha, value]) => `${dosha}: ${value}%`)
                      .join(', ')
                  : patient.vikriti}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Health Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#7A5C3A]">Health Status</span>
          <span className="text-xs text-[#7A5C3A]/60">
            {patient.condition}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {patient.tags.map((tag, tagIndex) => (
            <motion.span
              key={tagIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: tagIndex * 0.1 }}
              className="px-2 py-1 bg-[#4C8C4A]/10 text-[#4C8C4A] text-xs rounded-lg font-medium"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Diet Plan Information */}
      {isClient && patient.lastDietPlan && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#7A5C3A]">Latest Diet Plan</span>
            <span className="text-xs text-[#7A5C3A]/60">
              {patient.lastDietPlanDate ? new Date(patient.lastDietPlanDate).toLocaleDateString() : 'Recently updated'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-[#7A5C3A]">
              Plan ID: {patient.lastDietPlan}
            </span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
            >
              Active
            </motion.span>
          </div>
        </div>
      )}

      {/* Progress Indicators */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-[#7A5C3A]/70 mb-1">
            <span>Diet Compliance</span>
            <span>{patient.compliance}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${patient.compliance}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              className="bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] h-2 rounded-full"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-[#7A5C3A]/70 mb-1">
            <span>Weight Progress</span>
            <span>{patient.weightChange > 0 ? '+' : ''}{patient.weightChange}kg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.abs(patient.weightChange) * 10}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.7 }}
              className={`h-2 rounded-full ${
                patient.weightChange > 0 
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : patient.weightChange < 0
                  ? 'bg-gradient-to-r from-red-400 to-red-600'
                  : 'bg-gradient-to-r from-gray-400 to-gray-600'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.9 }}
        className="flex justify-between items-center mt-4 pt-4 border-t border-[#4C8C4A]/10"
      >
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-[#4C8C4A] hover:bg-[#4C8C4A]/10 rounded-lg transition-colors"
            title="View Profile"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-[#F4A300] hover:bg-[#F4A300]/10 rounded-lg transition-colors"
            title="Send Message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          View Details
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PatientCard;
