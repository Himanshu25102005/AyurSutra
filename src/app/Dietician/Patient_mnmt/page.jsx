"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DashboardNav, 
  Sidebar, 
  PatientCard, 
  OverviewTiles, 
  SearchFilters, 
  PatientProfileModal 
} from "../../../components/dietician";
import ScheduleAppointment from "../../../components/dietician/ScheduleAppointment";
import dataService from "../../../services/dataService";

export default function PatientManagement() {
  const [activeSection, setActiveSection] = useState("patients");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // State for patients data to allow refreshing
  const [patients, setPatients] = useState(dataService.getAllPatients());
  const [overviewData, setOverviewData] = useState(dataService.getOverviewStats());
  
  // Refresh data when component mounts or when returning from Add Patient page
  useEffect(() => {
    const refreshData = () => {
      setPatients(dataService.getAllPatients());
      setOverviewData(dataService.getOverviewStats());
    };
    
    refreshData();
    
    // Listen for custom events to refresh when new patients are added
    const handlePatientsUpdate = () => {
      refreshData();
    };
    
    window.addEventListener('patientsUpdated', handlePatientsUpdate);
    
    return () => {
      window.removeEventListener('patientsUpdated', handlePatientsUpdate);
    };
  }, []);
  
  // Calculate dynamic overview data based on current filters
  const getDynamicOverviewData = () => {
    const currentPatients = dataService.filterPatients({
      search: searchQuery,
      ...filters
    });
    
    const vataCount = currentPatients.filter(p => p.prakriti.toLowerCase() === 'vata').length;
    const pittaCount = currentPatients.filter(p => p.prakriti.toLowerCase() === 'pitta').length;
    const kaphaCount = currentPatients.filter(p => p.prakriti.toLowerCase() === 'kapha').length;
    const highPriorityCount = currentPatients.filter(p => p.priority.toLowerCase() === 'high').length;
    const upcomingCount = currentPatients.filter(p => p.tags.includes('Regular Patient')).length;
    
    return {
      totalPatients: currentPatients.length,
      vataPatients: vataCount,
      pittaPatients: pittaCount,
      kaphaPatients: kaphaCount,
      highPriority: highPriorityCount,
      upcomingAppointments: upcomingCount
    };
  };
  
  const dynamicOverviewData = getDynamicOverviewData();

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setIsProfileModalOpen(true);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log("Filters applied:", newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const hasActiveFilters = () => {
    return searchQuery || 
           (filters.prakriti && filters.prakriti.length > 0) ||
           (filters.ageGroup && filters.ageGroup.length > 0) ||
           (filters.gender && filters.gender.length > 0) ||
           (filters.dietaryPreference && filters.dietaryPreference.length > 0) ||
           (filters.appointmentHistory && filters.appointmentHistory.length > 0);
  };

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleTileClick = (tileType) => {
    console.log(`Clicked on tile: ${tileType}`);
    
    switch (tileType) {
      case 'totalpatients':
        // Show all patients
        setFilters({});
        setSearchQuery("");
        showToastNotification("Showing all patients");
        break;
      case 'vatapatients':
        // Filter by Vata patients
        setFilters({ ...filters, prakriti: ['vata'] });
        showToastNotification("Filtered by Vata patients");
        break;
      case 'pittapatients':
        // Filter by Pitta patients
        setFilters({ ...filters, prakriti: ['pitta'] });
        showToastNotification("Filtered by Pitta patients");
        break;
      case 'kaphapatients':
        // Filter by Kapha patients
        setFilters({ ...filters, prakriti: ['kapha'] });
        showToastNotification("Filtered by Kapha patients");
        break;
      case 'highpriority':
        // Filter by high priority patients
        setFilters({ ...filters, appointmentHistory: ['follow-up'] });
        showToastNotification("Filtered by high priority patients");
        break;
      case 'upcomingappointments':
        // Filter by patients with upcoming appointments
        setFilters({ ...filters, appointmentHistory: ['regular'] });
        showToastNotification("Filtered by patients with upcoming appointments");
        break;
      default:
        console.log(`No specific action for tile: ${tileType}`);
    }
  };

  // Use data service for filtering
  const filteredPatients = dataService.filterPatients({
    search: searchQuery,
    ...filters
  });

  return (
    <div className="min-h-screen mt-20 bg-[#FAF8F2]">
      <DashboardNav />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onScheduleAppointment={() => setIsScheduleModalOpen(true)}
        />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-80'}`}>
          <div className="p-6">
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
                    Patient Management
                  </h1>
                  <p className="text-lg text-[#7A5C3A]/70 font-[var(--font-noto-serif-devanagari)]">
                    रोगी प्रबंधन - Manage your patients efficiently
                  </p>
                </div>

                {/* Mobile Sidebar Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="lg:hidden mb-4 px-4 py-2 bg-[#4C8C4A] text-white rounded-lg font-semibold"
                >
                  {isSidebarCollapsed ? "Show Menu" : "Hide Menu"}
                </motion.button>
              </div>

              {/* Search and Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search patients by name, ID, or condition..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-[#4C8C4A]/20 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7A5C3A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#7A5C3A]/50 hover:text-[#4C8C4A] transition-colors"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Clear Filters Button */}
                  {hasActiveFilters() && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAllFilters}
                      className="px-4 py-3 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Clear Filters</span>
                    </motion.button>
                  )}

                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        viewMode === "grid" 
                          ? "bg-white text-[#4C8C4A] shadow-sm" 
                          : "text-[#7A5C3A]/70 hover:text-[#4C8C4A]"
                      }`}
                    >
                      Grid
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode("table")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                        viewMode === "table" 
                          ? "bg-white text-[#4C8C4A] shadow-sm" 
                          : "text-[#7A5C3A]/70 hover:text-[#4C8C4A]"
                      }`}
                    >
                      Table
                    </motion.button>
                  </div>

                  {/* Filters Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={`px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 ${
                      hasActiveFilters() 
                        ? "bg-gradient-to-r from-[#F4A300] to-[#4C8C4A] text-white" 
                        : "bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    <span>Filters</span>
                    {hasActiveFilters() && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </motion.button>

                      {/* Add Patient Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = "/Dietician/Patient_mnmt/Add_Patient"}
                        className="px-4 py-3 bg-gradient-to-r from-[#F4A300] to-[#4C8C4A] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Patient</span>
                      </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Active Filters Display */}
            {hasActiveFilters() && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 p-4 bg-gradient-to-r from-[#4C8C4A]/5 to-[#2A9D8F]/5 rounded-xl border border-[#4C8C4A]/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#7A5C3A]">Active Filters</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearAllFilters}
                    className="text-xs text-[#7A5C3A]/70 hover:text-[#4C8C4A] transition-colors"
                  >
                    Clear All
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1 bg-[#4C8C4A] text-white text-sm rounded-full flex items-center space-x-2"
                    >
                      <span>Search: "{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="w-4 h-4 hover:bg-white/20 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.span>
                  )}
                  {filters.prakriti && filters.prakriti.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      Prakriti: {filters.prakriti.join(", ")}
                    </motion.span>
                  )}
                  {filters.ageGroup && filters.ageGroup.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      Age: {filters.ageGroup.join(", ")}
                    </motion.span>
                  )}
                  {filters.gender && filters.gender.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                    >
                      Gender: {filters.gender.join(", ")}
                    </motion.span>
                  )}
                  {filters.dietaryPreference && filters.dietaryPreference.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                    >
                      Diet: {filters.dietaryPreference.join(", ")}
                    </motion.span>
                  )}
                  {filters.appointmentHistory && filters.appointmentHistory.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                    >
                      History: {filters.appointmentHistory.join(", ")}
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}

                {/* Overview Tiles */}
                <OverviewTiles data={dynamicOverviewData} onTileClick={handleTileClick} />

            {/* Patients Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#7A5C3A]">
                  Patients ({filteredPatients.length})
                </h2>
                <div className="text-sm text-[#7A5C3A]/70">
                  Showing {filteredPatients.length} of {patients.length} patients
                </div>
              </div>

              {/* Patients Grid/Table */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPatients.map((patient, index) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      onClick={() => handlePatientClick(patient)}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-[#4C8C4A]/5 to-[#2A9D8F]/5">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#7A5C3A]">Patient</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#7A5C3A]">Prakriti</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#7A5C3A]">Condition</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#7A5C3A]">Priority</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#7A5C3A]">Compliance</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#7A5C3A]">Last Visit</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#7A5C3A]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#4C8C4A]/10">
                        {filteredPatients.map((patient, index) => (
                          <motion.tr
                            key={patient.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="hover:bg-[#4C8C4A]/5 transition-colors cursor-pointer"
                            onClick={() => handlePatientClick(patient)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#4C8C4A] to-[#2A9D8F] rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">
                                    {patient.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-semibold text-[#7A5C3A]">{patient.name}</div>
                                  <div className="text-sm text-[#7A5C3A]/70">{patient.age} years • {patient.gender}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-[#4C8C4A]/10 text-[#4C8C4A] rounded-full text-sm font-medium">
                                {patient.prakriti}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[#7A5C3A]">{patient.condition}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                patient.priority === 'High' ? 'bg-red-100 text-red-800' :
                                patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {patient.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] h-2 rounded-full"
                                    style={{ width: `${patient.compliance}%` }}
                                  />
                                </div>
                                <span className="text-sm text-[#7A5C3A]">{patient.compliance}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#7A5C3A]">{patient.lastVisit}</td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 text-[#4C8C4A] hover:bg-[#4C8C4A]/10 rounded-lg transition-colors"
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
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <SearchFilters 
        onFiltersChange={handleFiltersChange}
        isOpen={isFiltersOpen}
        setIsOpen={setIsFiltersOpen}
      />

      {/* Patient Profile Modal */}
      <PatientProfileModal
        patient={selectedPatient}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedPatient(null);
        }}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-[#4C8C4A]/20 p-4 max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#7A5C3A]">{toastMessage}</p>
                  <p className="text-xs text-[#7A5C3A]/70">Filter applied successfully</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowToast(false)}
                  className="w-6 h-6 text-[#7A5C3A]/50 hover:text-[#4C8C4A] transition-colors"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Appointment Modal */}
      <ScheduleAppointment 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
}
