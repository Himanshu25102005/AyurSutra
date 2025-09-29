"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dataService from "../../services/dataService";

const ScheduleAppointment = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("routine");
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState("weekly");
  const [videoLink, setVideoLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Load appointments from dataService
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const allPatients = dataService.getAllPatients();
    const allAppointments = dataService.getAllAppointments();
    setPatients(allPatients);
    setAppointments(allAppointments);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];

  const appointmentTypes = [
    { value: "initial", label: "Initial Assessment" },
    { value: "routine", label: "Routine Follow-Up" },
    { value: "review", label: "Diet Review" },
    { value: "special", label: "Special Consultation" }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled": return "bg-green-100 text-green-800 border-green-200";
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "missed": return "bg-red-100 text-red-800 border-red-200";
      case "cancelled": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled": return "📅";
      case "confirmed": return "✅";
      case "pending": return "⏳";
      case "completed": return "✅";
      case "missed": return "❌";
      case "cancelled": return "❌";
      default: return "📅";
    }
  };

  const handleBookAppointment = () => {
    if (selectedPatient && selectedDate && selectedTime) {
      const appointmentData = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        type: appointmentTypes.find(t => t.value === appointmentType)?.label || "Routine Follow-Up",
        status: "Scheduled",
        notes: notes,
        videoLink: videoLink || null,
        isRecurring: isRecurring,
        recurringType: isRecurring ? recurringType : null
      };
      
      // Save to dataService
      const newAppointment = dataService.addAppointment(appointmentData);
      
      // Update local state
      setAppointments(prev => [...prev, newAppointment]);
      setShowSuccess(true);
      
      // Reset form
      setSelectedPatient(null);
      setSelectedTime("");
      setNotes("");
      setVideoLink("");
      setSearchQuery("");
      
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const CalendarView = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const getAppointmentsForDate = (day) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return appointments.filter(apt => apt.date === dateStr);
    };

    return (
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#4C8C6A]">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
              className="p-2 rounded-lg bg-[#8BC34A]/10 text-[#4C8C6A] hover:bg-[#8BC34A]/20 transition-colors"
            >
              ←
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
              className="p-2 rounded-lg bg-[#8BC34A]/10 text-[#4C8C6A] hover:bg-[#8BC34A]/20 transition-colors"
            >
              →
            </motion.button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-[#4C8C6A] py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (!day) return <div key={index} className="h-16"></div>;
              
              const dayAppointments = getAppointmentsForDate(day);
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              
              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  className={`h-16 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                    isToday 
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37]' 
                      : 'bg-gray-50 border-gray-200 hover:border-[#8BC34A]'
                  }`}
                >
                  <div className="text-sm font-semibold text-[#4C8C6A] mb-1">{day}</div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map(apt => (
                      <div
                        key={apt.id}
                        className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(apt.status)}`}
                        title={`${apt.patientName} - ${apt.time}`}
                      >
                        {getStatusIcon(apt.status)} {apt.time}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-[#4C8C6A]/60">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const BookingForm = () => (
    <div className="space-y-6">
      {/* Patient Search */}
      <div>
        <label className="block text-sm font-semibold text-[#4C8C6A] mb-2">
          Select Patient
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-[#8BC34A]/30 rounded-xl focus:ring-2 focus:ring-[#8BC34A]/20 focus:border-[#8BC34A] transition-all"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4C8C6A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {searchQuery && (
          <div className="mt-2 max-h-48 overflow-y-auto bg-white border border-[#8BC34A]/20 rounded-xl shadow-lg">
            {filteredPatients.map(patient => (
              <motion.div
                key={patient.id}
                whileHover={{ backgroundColor: "#8BC34A/5" }}
                onClick={() => {
                  setSelectedPatient(patient);
                  setSearchQuery(patient.name);
                }}
                className="p-3 cursor-pointer border-b border-[#8BC34A]/10 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8BC34A] to-[#4C8C6A] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#4C8C6A]">{patient.name}</div>
                    <div className="text-sm text-[#4C8C6A]/70">ID: {patient.id}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#4C8C6A] mb-2">
            Appointment Date
          </label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-[#8BC34A]/30 rounded-xl focus:ring-2 focus:ring-[#8BC34A]/20 focus:border-[#8BC34A] transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-[#4C8C6A] mb-2">
            Time Slot
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-4 py-3 border border-[#8BC34A]/30 rounded-xl focus:ring-2 focus:ring-[#8BC34A]/20 focus:border-[#8BC34A] transition-all"
          >
            <option value="">Select time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointment Type */}
      <div>
        <label className="block text-sm font-semibold text-[#4C8C6A] mb-2">
          Purpose of Appointment
        </label>
        <select
          value={appointmentType}
          onChange={(e) => setAppointmentType(e.target.value)}
          className="w-full px-4 py-3 border border-[#8BC34A]/30 rounded-xl focus:ring-2 focus:ring-[#8BC34A]/20 focus:border-[#8BC34A] transition-all"
        >
          {appointmentTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Recurring Appointment */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 text-[#8BC34A] border-[#8BC34A]/30 rounded focus:ring-[#8BC34A]/20"
          />
          <span className="text-sm font-semibold text-[#4C8C6A]">Recurring Appointment</span>
        </label>
        
        {isRecurring && (
          <select
            value={recurringType}
            onChange={(e) => setRecurringType(e.target.value)}
            className="px-3 py-2 border border-[#8BC34A]/30 rounded-lg focus:ring-2 focus:ring-[#8BC34A]/20 focus:border-[#8BC34A] transition-all"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        )}
      </div>

      {/* Video Link */}
      <div>
        <label className="block text-sm font-semibold text-[#4C8C6A] mb-2">
          Video Consultation Link (Optional)
        </label>
        <input
          type="url"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="https://meet.google.com/..."
          className="w-full px-4 py-3 border border-[#8BC34A]/30 rounded-xl focus:ring-2 focus:ring-[#8BC34A]/20 focus:border-[#8BC34A] transition-all"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-[#4C8C6A] mb-2">
          Notes/Agenda
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any specific notes or agenda items for this appointment..."
          rows={4}
          className="w-full px-4 py-3 border border-[#8BC34A]/30 rounded-xl focus:ring-2 focus:ring-[#8BC34A]/20 focus:border-[#8BC34A] transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBookAppointment}
        disabled={!selectedPatient || !selectedTime}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all ${
          selectedPatient && selectedTime
            ? "bg-gradient-to-r from-[#8BC34A] to-[#4C8C6A] hover:shadow-lg"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {showSuccess ? "✅ Appointment Booked!" : "📅 Book Appointment"}
      </motion.button>
    </div>
  );

  const AppointmentHistory = () => (
    <div className="space-y-4">
      {appointments
        .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))
        .map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-[#8BC34A]/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8BC34A] to-[#4C8C6A] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {appointment.patientName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#4C8C6A]">{appointment.patientName}</h4>
                    <p className="text-sm text-[#4C8C6A]/70">{appointment.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-[#4C8C6A]/70 mb-2">
                  <span>📅 {new Date(appointment.date).toLocaleDateString()}</span>
                  <span>🕐 {appointment.time}</span>
                </div>
                
                {appointment.notes && (
                  <p className="text-sm text-[#4C8C6A]/80 bg-[#F5F3E7] p-3 rounded-lg">
                    {appointment.notes}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)} {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-[#4C8C6A]/50 hover:text-[#4C8C6A] hover:bg-[#8BC34A]/10 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-gradient-to-br from-[#F5F3E7] to-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8BC34A] to-[#4C8C6A] p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Schedule Appointment</h2>
                  <p className="text-white/80">Manage patient consultations with ease</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#8BC34A]/20">
            <div className="flex">
              {[
                { id: "calendar", label: "📅 Calendar View", icon: "📅" },
                { id: "book", label: "📋 Book Appointment", icon: "📋" },
                { id: "history", label: "📜 Appointment History", icon: "📜" }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ backgroundColor: "#8BC34A/5" }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
                    activeTab === tab.id
                      ? "text-[#4C8C6A]"
                      : "text-[#4C8C6A]/60 hover:text-[#4C8C6A]"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8BC34A] to-[#4C8C6A] rounded-t-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "calendar" && <CalendarView />}
                {activeTab === "book" && <BookingForm />}
                {activeTab === "history" && <AppointmentHistory />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScheduleAppointment;
