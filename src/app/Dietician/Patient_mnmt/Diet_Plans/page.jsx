"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNav } from "../../../../components/dietician";
import dataService from "../../../../services/dataService";

export default function DietPlans() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("30days");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedPlanForCompare, setSelectedPlanForCompare] = useState(null);
  const [patients, setPatients] = useState([]);
  const [allDietPlans, setAllDietPlans] = useState([]);

  // Fetch data from service
  useEffect(() => {
    const fetchData = () => {
      const allPatients = dataService.getAllPatients();
      const allPlans = dataService.getAllDietPlans();
      
      setPatients(allPatients);
      
      // Combine diet plans with patient information
      const plansWithPatientInfo = allPlans.map(plan => {
        const patient = allPatients.find(p => p.id === plan.patientId);
        return {
          ...plan,
          patientName: patient ? patient.name : 'Unknown Patient',
          patientId: plan.patientId,
          patientAGE: patient ? patient.age : 0,
          patientGender: patient ? patient.gender : 'Unknown',
          patientPrakriti: patient ? patient.prakriti : 'Unknown',
          patientCondition: patient ? patient.condition : 'Unknown',
          patientCompliance: patient ? patient.compliance : 0,
          patientPriority: patient ? patient.priority : 'Low',
          patientTags: patient ? patient.tags : []
        };
      });
      
      setAllDietPlans(plansWithPatientInfo);
    };
    
    fetchData();
    
    // Listen for data updates
    const handleDataUpdate = () => {
      fetchData();
    };
    
    window.addEventListener('patientsUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('patientsUpdated', handleDataUpdate);
    };
  }, []);

  // Filter plans based on search
  const filteredPlans = allDietPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current active plans
  const activePlans = filteredPlans.filter(plan => plan.status === 'Active');
  
  // Get completed plans
  const completedPlans = filteredPlans.filter(plan => plan.status === 'Completed');
  
  // Get plans needing attention (low compliance or high priority)
  const attentionPlans = filteredPlans.filter(plan => 
    plan.compliance < 70 || plan.patientPriority === 'High'
  );


  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "active", label: "Active Plans", icon: "🟢" },
    { id: "completed", label: "Completed Plans", icon: "✅" },
    { id: "attention", label: "Need Attention", icon: "⚠️" },
    { id: "all", label: "All Plans", icon: "📋" }
  ];

  const getDoshaColor = (dosha) => {
    switch (dosha.toLowerCase()) {
      case 'vata': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pitta': return 'bg-red-100 text-red-800 border-red-200';
      case 'kapha': return 'bg-green-100 text-green-800 border-green-200';
      case 'all': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRasaColor = (rasa) => {
    switch (rasa.toLowerCase()) {
      case 'sweet': return 'text-green-600';
      case 'sour': return 'text-yellow-600';
      case 'salty': return 'text-blue-600';
      case 'bitter': return 'text-purple-600';
      case 'pungent': return 'text-red-600';
      case 'astringent': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <DashboardNav />
      
      <div className="pt-20 px-6 mt-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#7A5C3A] mb-2">
                Diet Plans
              </h1>
              <p className="text-lg text-[#7A5C3A]/70 font-[var(--font-noto-serif-devanagari)]">
                आहार योजना - Comprehensive diet management and tracking
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 border border-[#4C8C4A]/20 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7A5C3A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export PDF</span>
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] text-white shadow-lg"
                    : "bg-white text-[#7A5C3A] hover:bg-[#4C8C4A]/10 border border-[#4C8C4A]/20"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <AllPlansTable 
              plans={allDietPlans.slice(0, 10)}
              getDoshaColor={getDoshaColor}
            />
          )}
          {activeTab === "active" && (
            <ActivePlansSection 
              plans={activePlans}
              getDoshaColor={getDoshaColor}
            />
          )}
          {activeTab === "completed" && (
            <CompletedPlansSection 
              plans={completedPlans}
              getDoshaColor={getDoshaColor}
            />
          )}
          {activeTab === "attention" && (
            <AttentionPlansSection 
              plans={attentionPlans}
              getDoshaColor={getDoshaColor}
            />
          )}
          {activeTab === "all" && (
            <AllPlansTable 
              plans={filteredPlans}
              getDoshaColor={getDoshaColor}
              onPatientSelect={setSelectedPatient}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <CompareModal
            plan1={currentPlan}
            plan2={selectedPlanForCompare}
            onClose={() => {
              setShowCompareModal(false);
              setSelectedPlanForCompare(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Current Plan Section
const CurrentPlanSection = ({ plan, getDoshaColor, getRasaColor }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Plan Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#7A5C3A] mb-2">{plan.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-[#7A5C3A]/70">
              <span>Version: {plan.version}</span>
              <span>•</span>
              <span>Start: {plan.startDate}</span>
              <span>•</span>
              <span>End: {plan.endDate}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Active
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-[#7A5C3A] hover:bg-[#4C8C4A]/10 rounded-lg transition-colors"
            >
              <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Meal Plan Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#4C8C4A]/10">
                      <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Food Item</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Portion</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Calories</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Dosha</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Rasa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.meals.map((meal, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ 
                          backgroundColor: "#4C8C4A/5",
                          scale: 1.01
                        }}
                        className="border-b border-[#4C8C4A]/5 hover:bg-[#4C8C4A]/5 transition-all duration-200"
                      >
                        <td className="py-3 px-4 text-[#7A5C3A] font-medium">{meal.time}</td>
                        <td className="py-3 px-4 text-[#7A5C3A]">{meal.name}</td>
                        <td className="py-3 px-4 text-[#7A5C3A]/70">{meal.portion}</td>
                        <td className="py-3 px-4 text-[#7A5C3A]">{meal.calories}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDoshaColor(meal.dosha)}`}>
                            {meal.dosha}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm font-medium ${getRasaColor(meal.rasa)}`}>
                            {meal.rasa}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-[#4C8C4A]/10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#4C8C4A]/10 text-[#4C8C4A] rounded-xl font-semibold hover:bg-[#4C8C4A]/20 transition-colors"
                >
                  Edit Plan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Download PDF
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Simple All Plans Table Component
const AllPlansTable = ({ plans, getDoshaColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#4C8C4A]/10">
                <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Plan Name</th>
                <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Patient</th>
                <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Condition</th>
                <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Compliance</th>
                <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-[#7A5C3A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <motion.tr
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "#4C8C4A/5" }}
                  className="border-b border-[#4C8C4A]/5 hover:bg-[#4C8C4A]/5 transition-all duration-200"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-semibold text-[#7A5C3A]">{plan.name}</div>
                      <div className="text-sm text-[#7A5C3A]/70">{plan.duration}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#4C8C4A] to-[#2A9D8F] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {plan.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-[#7A5C3A]">{plan.patientName}</div>
                        <div className="text-sm text-[#7A5C3A]/70">ID: {plan.patientId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#7A5C3A]">{plan.patientCondition}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] h-2 rounded-full"
                          style={{ width: `${plan.compliance}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-[#7A5C3A]">{plan.compliance}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      plan.status === 'Active' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-[#4C8C4A] hover:bg-[#4C8C4A]/10 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Simple section components for active, completed, attention
const ActivePlansSection = ({ plans }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
    {plans.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <span className="text-6xl mb-4 block">🟢</span>
        <h3 className="text-xl font-bold text-[#7A5C3A] mb-2">No Active Plans</h3>
        <p className="text-[#7A5C3A]/70">There are currently no active diet plans.</p>
      </div>
    ) : (
      plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#7A5C3A]">{plan.name}</h4>
              <p className="text-sm text-[#7A5C3A]/70">{plan.patientName} • {plan.patientCondition}</p>
              <p className="text-sm text-[#7A5C3A]/70">Compliance: {plan.compliance}% • Duration: {plan.duration}</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Active
            </span>
          </div>
        </motion.div>
      ))
    )}
  </motion.div>
);

const CompletedPlansSection = ({ plans }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
    {plans.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <span className="text-6xl mb-4 block">✅</span>
        <h3 className="text-xl font-bold text-[#7A5C3A] mb-2">No Completed Plans</h3>
        <p className="text-[#7A5C3A]/70">There are currently no completed diet plans.</p>
      </div>
    ) : (
      plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#7A5C3A]">{plan.name}</h4>
              <p className="text-sm text-[#7A5C3A]/70">{plan.patientName} • {plan.patientCondition}</p>
              <p className="text-sm text-[#7A5C3A]/70">Compliance: {plan.compliance}%</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              Completed
            </span>
          </div>
        </motion.div>
      ))
    )}
  </motion.div>
);

const AttentionPlansSection = ({ plans }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
    {plans.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <span className="text-6xl mb-4 block">🎉</span>
        <h3 className="text-xl font-bold text-[#7A5C3A] mb-2">All Plans On Track!</h3>
        <p className="text-[#7A5C3A]/70">No diet plans need immediate attention.</p>
      </div>
    ) : (
      plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl border-l-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-500"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                />
                <h4 className="font-semibold text-[#7A5C3A]">{plan.name}</h4>
              </div>
              <p className="text-sm text-[#7A5C3A]/70">{plan.patientName} • {plan.patientCondition}</p>
              <p className="text-sm text-red-700">
                ⚠️ Compliance: {plan.compliance}% • Priority: {plan.patientPriority}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
            >
              Follow Up
            </motion.button>
          </div>
        </motion.div>
      ))
    )}
  </motion.div>
);

// History Section
const HistorySection = ({ plans, onCompare }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-6"
      >
        <h3 className="text-xl font-bold text-[#7A5C3A] mb-6">Plan Timeline</h3>
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-[#4C8C4A]/5 to-[#2A9D8F]/5 rounded-xl hover:from-[#4C8C4A]/10 hover:to-[#2A9D8F]/10 transition-all duration-300"
            >
              <div className="w-3 h-3 bg-[#4C8C4A] rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[#7A5C3A]">{plan.name}</h4>
                    <p className="text-sm text-[#7A5C3A]/70">{plan.date} • {plan.version}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {plan.status}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCompare(plan)}
                      className="px-3 py-1 bg-[#4C8C4A] text-white rounded-lg text-sm hover:bg-[#2A9D8F] transition-colors"
                    >
                      Compare
                    </motion.button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {plan.changes.map((change, changeIndex) => (
                    <span
                      key={changeIndex}
                      className="px-2 py-1 bg-[#4C8C4A]/10 text-[#4C8C4A] rounded-full text-xs"
                    >
                      {change}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Progress Section
const ProgressSection = ({ data, dateRange, setDateRange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#7A5C3A]">Progress Tracking</h3>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-[#4C8C4A]/20 rounded-lg focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
        </div>

        {/* Progress Chart */}
        <div className="h-64 bg-gradient-to-br from-[#4C8C4A]/5 to-[#2A9D8F]/5 rounded-xl p-4">
          <div className="flex justify-between items-end h-full space-x-2">
            {data.map((item, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="flex-1 flex flex-col items-center space-y-2"
              >
                <div className="w-full bg-white rounded-t-lg flex flex-col justify-end h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.compliance / 100) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                    className="bg-gradient-to-t from-[#4C8C4A] to-[#2A9D8F] rounded-t-lg"
                  />
                </div>
                <span className="text-xs text-[#7A5C3A]/70">{item.compliance}%</span>
                <span className="text-xs text-[#7A5C3A]/50">{item.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Meal Logs Section
const MealLogsSection = ({ logs }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {logs.map((log, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#7A5C3A]">{log.date}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#7A5C3A]/70">
                {log.actual}/{log.planned} meals
              </span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(log.actual / log.planned) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  className="bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] h-2 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-[#7A5C3A]">Notes: </span>
              <span className="text-sm text-[#7A5C3A]/70">{log.notes}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-[#7A5C3A]">Symptoms: </span>
              <span className="text-sm text-[#7A5C3A]/70">{log.symptoms}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Alerts Section
const AlertsSection = ({ alerts, getAlertColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`p-4 rounded-xl border-l-4 ${getAlertColor(alert.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-[#7A5C3A] mb-1">{alert.title}</h4>
              <p className="text-sm text-[#7A5C3A]/70 mb-3">{alert.message}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-[#4C8C4A] text-white rounded-lg text-sm hover:bg-[#2A9D8F] transition-colors"
              >
                {alert.action}
              </motion.button>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {alert.priority}
              </span>
              {alert.priority === 'high' && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Compare Modal
const CompareModal = ({ plan1, plan2, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: 100 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#4C8C4A]/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#7A5C3A]">Compare Plans</h2>
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

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">{plan1.name}</h3>
              <div className="space-y-2 text-sm text-[#7A5C3A]/70">
                <p>Version: {plan1.version}</p>
                <p>Start: {plan1.startDate}</p>
                <p>End: {plan1.endDate}</p>
                <p>Meals: {plan1.meals.length}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">{plan2.name}</h3>
              <div className="space-y-2 text-sm text-[#7A5C3A]/70">
                <p>Version: {plan2.version}</p>
                <p>Date: {plan2.date}</p>
                <p>Status: {plan2.status}</p>
                <p>Changes: {plan2.changes.length}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
