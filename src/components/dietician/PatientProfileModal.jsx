"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PatientProfileModal = ({ patient, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("assessment");

  const tabs = [
    { id: "assessment", name: "Ayurvedic Assessment", sanskrit: "आयुर्वेदिक मूल्यांकन", icon: "🌿" },
    { id: "metrics", name: "Health Metrics", sanskrit: "स्वास्थ्य मापदंड", icon: "📊" },
    { id: "history", name: "Medical History", sanskrit: "चिकित्सा इतिहास", icon: "📋" },
    { id: "notes", name: "Notes", sanskrit: "नोट्स", icon: "📝" },
    { id: "diet", name: "Diet Plans & Logs", sanskrit: "आहार योजना और लॉग", icon: "🍽️" },
    { id: "communication", name: "Communication", sanskrit: "संचार", icon: "💬" }
  ];

  const renderDoshaChart = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">Dosha Balance</h3>
      <div className="grid grid-cols-3 gap-6">
        {[
          { name: "Vata", value: 65, color: "from-blue-400 to-blue-600", bgColor: "bg-blue-50" },
          { name: "Pitta", value: 80, color: "from-red-400 to-red-600", bgColor: "bg-red-50" },
          { name: "Kapha", value: 45, color: "from-green-400 to-green-600", bgColor: "bg-green-50" }
        ].map((dosha, index) => (
          <motion.div
            key={dosha.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`${dosha.bgColor} rounded-2xl p-6 text-center`}
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className={`text-gradient-to-r ${dosha.color}`}
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - dosha.value / 100)}`}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - dosha.value / 100) }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#7A5C3A]">{dosha.value}%</span>
              </div>
            </div>
            <h4 className="font-semibold text-[#7A5C3A]">{dosha.name}</h4>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderHealthMetrics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">Health Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Dietary Habits", value: "Vegetarian", status: "Good" },
          { title: "Meal Frequency", value: "3 meals/day", status: "Optimal" },
          { title: "Sleep Quality", value: "7-8 hours", status: "Good" },
          { title: "Bowel Movement", value: "Regular", status: "Good" },
          { title: "Water Intake", value: "2.5L/day", status: "Optimal" },
          { title: "Exercise", value: "30 min/day", status: "Good" }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-[#4C8C4A]/10 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-[#7A5C3A]">{metric.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                metric.status === 'Optimal' ? 'bg-green-100 text-green-800' :
                metric.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {metric.status}
              </span>
            </div>
            <p className="text-[#7A5C3A]/70">{metric.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">Medical History Timeline</h3>
      <div className="space-y-4">
        {[
          { date: "2024-01-15", condition: "Diabetes Type 2", treatment: "Metformin", status: "Ongoing" },
          { date: "2023-11-20", condition: "Hypertension", treatment: "Lifestyle changes", status: "Controlled" },
          { date: "2023-08-10", condition: "Digestive Issues", treatment: "Ayurvedic herbs", status: "Resolved" }
        ].map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-[#4C8C4A]/10"
          >
            <div className="w-3 h-3 bg-[#4C8C4A] rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-[#7A5C3A]">{entry.condition}</h4>
                <span className="text-sm text-[#7A5C3A]/60">{entry.date}</span>
              </div>
              <p className="text-[#7A5C3A]/70 mb-2">Treatment: {entry.treatment}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                entry.status === 'Ongoing' ? 'bg-red-100 text-red-800' :
                entry.status === 'Controlled' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {entry.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#7A5C3A]">Notes</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-[#4C8C4A] text-white rounded-lg text-sm font-semibold"
        >
          Add Note
        </motion.button>
      </div>
      <div className="space-y-4">
        {[
          { date: "2024-01-20", note: "Patient showing good progress with new diet plan. Weight reduced by 2kg this month.", author: "Dr. Priya Sharma" },
          { date: "2024-01-15", note: "Patient complained of digestive issues. Recommended ginger tea and avoiding cold foods.", author: "Dr. Priya Sharma" },
          { date: "2024-01-10", note: "Initial consultation completed. Patient is motivated to follow Ayurvedic lifestyle.", author: "Dr. Priya Sharma" }
        ].map((note, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-[#4C8C4A]/10"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-[#7A5C3A]">{note.author}</span>
              <span className="text-xs text-[#7A5C3A]/60">{note.date}</span>
            </div>
            <p className="text-[#7A5C3A]/70">{note.note}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderDietPlans = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">Diet Plans & Logs</h3>
      <div className="space-y-4">
        {[
          { name: "Current Diet Plan", status: "Active", compliance: 85, startDate: "2024-01-01" },
          { name: "Previous Diet Plan", status: "Completed", compliance: 92, startDate: "2023-11-01" }
        ].map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-[#4C8C4A]/10"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-[#7A5C3A]">{plan.name}</h4>
                <p className="text-sm text-[#7A5C3A]/60">Started: {plan.startDate}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                plan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {plan.status}
              </span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm text-[#7A5C3A]/70 mb-1">
                <span>Compliance</span>
                <span>{plan.compliance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${plan.compliance}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  className="bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] h-2 rounded-full"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-[#4C8C4A]/10 text-[#4C8C4A] rounded-lg text-sm font-medium"
              >
                View Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-[#F4A300]/10 text-[#F4A300] rounded-lg text-sm font-medium"
              >
                Export
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">Communication</h3>
      <div className="bg-white rounded-xl p-4 border border-[#4C8C4A]/10 h-96 flex flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {[
            { sender: "patient", message: "Hello Doctor, I'm feeling much better with the new diet plan.", time: "10:30 AM" },
            { sender: "doctor", message: "That's great to hear! Keep following the meal timings.", time: "10:35 AM" },
            { sender: "patient", message: "Should I continue with the ginger tea?", time: "2:15 PM" },
            { sender: "doctor", message: "Yes, continue for another week. Let me know if you have any concerns.", time: "2:20 PM" }
          ].map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                msg.sender === 'doctor' 
                  ? 'bg-[#4C8C4A] text-white' 
                  : 'bg-gray-100 text-[#7A5C3A]'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'doctor' ? 'text-white/70' : 'text-[#7A5C3A]/60'
                }`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-[#4C8C4A]/20 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A]"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#4C8C4A] text-white rounded-xl font-semibold"
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "assessment": return renderDoshaChart();
      case "metrics": return renderHealthMetrics();
      case "history": return renderMedicalHistory();
      case "notes": return renderNotes();
      case "diet": return renderDietPlans();
      case "communication": return renderCommunication();
      default: return renderDoshaChart();
    }
  };

  if (!patient) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#4C8C4A]/20 bg-gradient-to-r from-[#4C8C4A]/5 to-[#2A9D8F]/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4C8C4A] to-[#2A9D8F] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#7A5C3A]">{patient.name}</h2>
                    <p className="text-[#7A5C3A]/70">
                      {patient.age} years • {patient.gender} • ID: {patient.id}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-[#7A5C3A] hover:bg-[#4C8C4A]/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#4C8C4A]/20">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id
                        ? "text-[#4C8C4A] border-b-2 border-[#4C8C4A] bg-[#4C8C4A]/5"
                        : "text-[#7A5C3A]/70 hover:text-[#4C8C4A] hover:bg-[#4C8C4A]/5"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderTabContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PatientProfileModal;
