"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { DashboardNav } from "../../../components/dietician";
import dataService from "../../../services/dataService";


    // Patient Overview Panel
    const PatientOverview = () => {
      const [patients, setPatients] = useState([]);
      
      useEffect(() => {
        const refreshPatients = () => {
          const allPatients = dataService.getAllPatients();
          const upcomingAppointments = dataService.getUpcomingAppointments(7);
          
          const recentPatients = allPatients.slice(0, 4).map(patient => {
            const patientAppointment = upcomingAppointments.find(apt => apt.patientId === patient.id);
            return {
              id: patient.id,
              name: patient.name,
              time: patientAppointment ? patientAppointment.time : "No upcoming appointment",
              status: patient.priority,
              statusColor: patient.priority === "High" ? "bg-[#F4A300]" :
                           patient.priority === "Medium" ? "bg-[#4C8C4A]" : "bg-[#2A9D8F]",
              prakriti: patient.prakriti,
              lastVisit: dataService.formatDate(patient.lastVisit),
              nextAppointment: patientAppointment ? dataService.formatDate(patientAppointment.date) : "Not scheduled"
            };
          });
          setPatients(recentPatients);
        };
        
        refreshPatients();
        
        // Listen for custom events to refresh when new patients are added
        const handlePatientsUpdate = () => {
          refreshPatients();
        };
        
        window.addEventListener('patientsUpdated', handlePatientsUpdate);
        
        return () => {
          window.removeEventListener('patientsUpdated', handlePatientsUpdate);
        };
      }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#7A5C3A]">Today's Patients</h3>
        <span className="text-sm font-[var(--font-noto-serif-devanagari)] text-[#7A5C3A]/70">
          आज के रोगी
        </span>
      </div>

      <div className="space-y-4">
        {patients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 10px 25px rgba(76, 140, 74, 0.15)" 
            }}
            className="p-4 border border-[#4C8C4A]/10 rounded-xl hover:border-[#4C8C4A]/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4C8C4A]/20 to-[#2A9D8F]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#7A5C3A] font-semibold text-sm">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7A5C3A]">{patient.name}</h4>
                  <p className="text-sm text-[#7A5C3A]/70">{patient.time} • {patient.prakriti}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${patient.statusColor}`}>
                  {patient.status}
                </span>
                <button className="p-1 hover:bg-[#4C8C4A]/10 rounded-full transition-colors">
                  <svg className="w-4 h-4 text-[#7A5C3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Appointment Calendar
const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("week");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const refreshAppointments = () => {
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = dataService.getAppointmentsByDate(today);
      setAppointments(todayAppointments);
    };
    
    refreshAppointments();
    
    // Listen for appointment updates
    const handleAppointmentsUpdate = () => {
      refreshAppointments();
    };
    
    window.addEventListener('patientsUpdated', handleAppointmentsUpdate);
    
    return () => {
      window.removeEventListener('patientsUpdated', handleAppointmentsUpdate);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-[#7A5C3A]">Appointment Calendar</h3>
          <p className="text-sm font-[var(--font-noto-serif-devanagari)] text-[#7A5C3A]/70">
            परामर्श समय
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              view === "day" 
                ? "bg-[#4C8C4A] text-white" 
                : "bg-[#4C8C4A]/10 text-[#7A5C3A] hover:bg-[#4C8C4A]/20"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              view === "week" 
                ? "bg-[#4C8C4A] text-white" 
                : "bg-[#4C8C4A]/10 text-[#7A5C3A] hover:bg-[#4C8C4A]/20"
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-[#7A5C3A]/70 py-2">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const date = i - 6;
          const isToday = date === new Date().getDate();
          const hasAppointment = [10, 11, 14, 15].includes(date);
          
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                isToday
                  ? "bg-[#4C8C4A] text-white"
                  : hasAppointment
                  ? "bg-[#F4A300]/20 text-[#7A5C3A] hover:bg-[#F4A300]/30"
                  : "text-[#7A5C3A]/50 hover:bg-[#4C8C4A]/10"
              }`}
            >
              {date > 0 && date <= 31 ? date : ""}
            </motion.button>
          );
        })}
      </div>

      {/* Today's Appointments */}
      <div className="space-y-3">
        <h4 className="font-semibold text-[#7A5C3A]">Today's Schedule</h4>
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-[#4C8C4A]/5 to-[#2A9D8F]/5 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#4C8C4A] rounded-full"></div>
                <span className="font-medium text-[#7A5C3A]">{appointment.time}</span>
                <span className="text-[#7A5C3A]/70">{appointment.patientName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-[#2A9D8F]/20 text-[#2A9D8F] rounded-full">
                  {appointment.type}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  appointment.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                  appointment.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-[#7A5C3A]/60">
            <span className="text-4xl mb-2 block">📅</span>
            <p>No appointments scheduled for today</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Pending Diet Approvals
const PendingApprovals = () => {
  const [filter, setFilter] = useState("all");
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      patient: "Rajesh Kumar",
      dietType: "Pitta Balancing",
      urgency: "High",
      urgencyColor: "bg-red-500",
      lastFeedback: "2 hours ago",
      changes: 3
    },
    {
      id: 2,
      patient: "Priya Patel",
      dietType: "Vata Pacifying",
      urgency: "Medium",
      urgencyColor: "bg-yellow-500",
      lastFeedback: "1 day ago",
      changes: 1
    },
    {
      id: 3,
      patient: "Amit Singh",
      dietType: "Kapha Reducing",
      urgency: "Low",
      urgencyColor: "bg-green-500",
      lastFeedback: "3 days ago",
      changes: 2
    }
  ]);

  const approveDiet = (id) => {
    setApprovals(approvals.filter(approval => approval.id !== id));
    // In a real app, this would make an API call
    console.log(`Approved diet plan for patient ${id}`);
  };

  const requestEdit = (id) => {
    // In a real app, this would open an edit modal or redirect
    console.log(`Requested edit for diet plan ${id}`);
    alert(`Edit requested for ${approvals.find(a => a.id === id)?.patient}'s diet plan`);
  };

  const filteredApprovals = filter === "all" 
    ? approvals 
    : approvals.filter(a => a.urgency.toLowerCase() === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#7A5C3A]">Pending Diet Approvals</h3>
        <div className="flex space-x-2">
          {["all", "high", "medium", "low"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === filterType
                  ? "bg-[#4C8C4A] text-white"
                  : "bg-[#4C8C4A]/10 text-[#7A5C3A] hover:bg-[#4C8C4A]/20"
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredApprovals.map((approval, index) => (
          <motion.div
            key={approval.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="p-4 border border-[#4C8C4A]/10 rounded-xl hover:border-[#4C8C4A]/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4C8C4A]/20 to-[#2A9D8F]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#7A5C3A] font-semibold">
                    {approval.patient.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7A5C3A]">{approval.patient}</h4>
                  <p className="text-sm text-[#7A5C3A]/70">{approval.dietType}</p>
                  <p className="text-xs text-[#7A5C3A]/50">{approval.lastFeedback} • {approval.changes} changes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${approval.urgencyColor}`}>
                  {approval.urgency}
                </span>
                <div className="flex space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => approveDiet(approval.id)}
                    className="px-3 py-1 bg-[#4C8C4A] text-white text-sm rounded-lg hover:bg-[#4C8C4A]/90 transition-colors"
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => requestEdit(approval.id)}
                    className="px-3 py-1 bg-[#7A5C3A]/10 text-[#7A5C3A] text-sm rounded-lg hover:bg-[#7A5C3A]/20 transition-colors"
                  >
                    Edit
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Real-time Alerts & Notifications
const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState(dataService.getAllNotifications());

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true }
        : notification
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#7A5C3A]">Alerts & Notifications</h3>
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl border-l-4 ${
              notification.type === "critical" 
                ? "bg-red-50 border-red-500" 
                : notification.type === "warning"
                ? "bg-yellow-50 border-yellow-500"
                : notification.type === "success"
                ? "bg-green-50 border-green-500"
                : "bg-blue-50 border-blue-500"
            } ${notification.read ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{notification.icon}</div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${notification.read ? 'line-through' : ''} text-[#7A5C3A]`}>
                  {notification.title}
                </p>
                <p className="text-xs text-[#7A5C3A]/70 mt-1">{notification.time}</p>
              </div>
              <div className="flex space-x-1">
                {!notification.read && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => markAsRead(notification.id)}
                    className="p-1 text-[#7A5C3A]/50 hover:text-[#4C8C4A] transition-colors"
                    title="Mark as read"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteNotification(notification.id)}
                  className="p-1 text-[#7A5C3A]/50 hover:text-red-500 transition-colors"
                  title="Delete notification"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Animated Chart Component
const AnimatedChart = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const data = [
    { month: "Jan", adherence: 85, patients: 120 },
    { month: "Feb", adherence: 87, patients: 125 },
    { month: "Mar", adherence: 89, patients: 130 },
    { month: "Apr", adherence: 91, patients: 135 },
    { month: "May", adherence: 88, patients: 140 },
    { month: "Jun", adherence: 92, patients: 145 },
    { month: "Jul", adherence: 89, patients: 150 }
  ];

  const maxAdherence = Math.max(...data.map(d => d.adherence));
  const maxPatients = Math.max(...data.map(d => d.patients));

  return (
    <div className="h-64 bg-gradient-to-br from-[#4C8C4A]/5 to-[#2A9D8F]/5 rounded-xl p-6 relative overflow-hidden">
      {/* Chart Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-4"
      >
        <h4 className="text-lg font-semibold text-[#7A5C3A]">Monthly Trends</h4>
        <p className="text-sm text-[#7A5C3A]/70">Adherence vs Patient Growth</p>
      </motion.div>

      {/* Chart Container */}
      <div className="h-40 mb-6">
        <div className="flex justify-between items-end h-full space-x-3">
          {data.map((item, index) => (
            <div key={item.month} className="flex-1 flex flex-col items-center">
              <div className="relative w-full h-full flex items-end justify-center space-x-1">
                {/* Adherence Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isVisible ? `${(item.adherence / maxAdherence) * 100}%` : 0 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="w-4 bg-gradient-to-t from-[#4C8C4A] to-[#2A9D8F] rounded-t-lg relative group"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-[#7A5C3A] bg-white px-2 py-1 rounded shadow-sm"
                  >
                    {item.adherence}%
                  </motion.div>
                </motion.div>
                
                {/* Patients Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isVisible ? `${(item.patients / maxPatients) * 100}%` : 0 }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                  className="w-4 bg-gradient-to-t from-[#F4A300] to-[#2A9D8F] rounded-t-lg relative group"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-[#7A5C3A] bg-white px-2 py-1 rounded shadow-sm"
                  >
                    {item.patients}
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Month Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.8 }}
                className="text-xs text-[#7A5C3A]/70 mt-3 font-medium"
              >
                {item.month}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="flex justify-center space-x-8"
      >
        <div className="flex items-center space-x-2 bg-white/50 px-3 py-2 rounded-lg">
          <div className="w-4 h-4 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] rounded"></div>
          <span className="text-sm font-medium text-[#7A5C3A]">Adherence %</span>
        </div>
        <div className="flex items-center space-x-2 bg-white/50 px-3 py-2 rounded-lg">
          <div className="w-4 h-4 bg-gradient-to-r from-[#F4A300] to-[#2A9D8F] rounded"></div>
          <span className="text-sm font-medium text-[#7A5C3A]">Patient Count</span>
        </div>
      </motion.div>
    </div>
  );
};

// Summary Statistics & Analytics
const AnalyticsPanel = () => {
  const metrics = [
    { label: "Active Patients", value: "127", change: "+12%", color: "text-[#4C8C4A]" },
    { label: "Adherence %", value: "89%", change: "+5%", color: "text-[#2A9D8F]" },
    { label: "Follow-ups Due", value: "23", change: "-8%", color: "text-[#F4A300]" },
    { label: "Overdue Check-ins", value: "7", change: "-15%", color: "text-[#7A5C3A]" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#7A5C3A]">Analytics Overview</h3>
        <span className="text-sm font-[var(--font-noto-serif-devanagari)] text-[#7A5C3A]/70">
          विश्लेषण
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-gradient-to-br from-[#4C8C4A]/5 to-[#2A9D8F]/5 rounded-xl text-center"
          >
            <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
            <div className="text-sm text-[#7A5C3A]/70 mb-1">{metric.label}</div>
            <div className="text-xs text-green-600">{metric.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Animated Chart */}
      <AnimatedChart />
    </motion.div>
  );
};

// Natural Language Query Search
const NLQSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([
    "Show patients with Pitta imbalance",
    "Find patients with high blood pressure",
    "List patients due for follow-up",
    "Show Vata constitution patients"
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold text-[#7A5C3A] mb-4">Natural Language Query</h3>
      
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask: Show patients with Pitta imbalance"
          className="w-full px-4 py-3 pr-12 border border-[#4C8C4A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4C8C4A]/30 focus:border-[#4C8C4A]/50 transition-all duration-300"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-[#7A5C3A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {query && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-2"
        >
          <p className="text-sm text-[#7A5C3A]/70">Suggestions:</p>
          {suggestions
            .filter(s => s.toLowerCase().includes(query.toLowerCase()))
            .map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => setQuery(suggestion)}
                className="block w-full text-left p-2 text-sm text-[#7A5C3A] hover:bg-[#4C8C4A]/10 rounded-lg transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// Quick Action Buttons
const QuickActions = () => {
  const actions = [
    { 
      icon: "➕", 
      label: "New Patient", 
      color: "from-[#4C8C4A] to-[#2A9D8F]",
      action: () => alert("Opening new patient registration form...")
    },
    { 
      icon: "🍵", 
      label: "Start Diet Plan", 
      color: "from-[#F4A300] to-[#4C8C4A]",
      action: () => alert("Opening diet plan creation wizard...")
    },
    { 
      icon: "✉️", 
      label: "Send Message", 
      color: "from-[#2A9D8F] to-[#4C8C4A]",
      action: () => alert("Opening message composer...")
    },
    { 
      icon: "📑", 
      label: "Generate Report", 
      color: "from-[#7A5C3A] to-[#4C8C4A]",
      action: () => alert("Generating analytics report...")
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="flex flex-col space-y-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: "0 10px 25px rgba(76, 140, 74, 0.3)" 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className={`px-4 py-3 bg-gradient-to-r ${action.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2`}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
export default function DieticianDashboard() {
  return (
    <div className="min-h-screen bg-[#FAF8F2] pt-20">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <PatientOverview />
            <AppointmentCalendar />
            <PendingApprovals />
            <AnalyticsPanel />
            <NLQSearch />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <NotificationsPanel />
          </div>
        </div>
      </div>

      <QuickActions />
    </div>
  );
}

