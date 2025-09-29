"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNav } from "../../../../components/dietician";
import dataService from "../../../../services/dataService";

export default function Messages() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filter, setFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [dynamicMessages, setDynamicMessages] = useState({});
  const messagesEndRef = useRef(null);

  // Hardcoded realistic messages for demonstration
  const hardcodedMessages = {
    P001: [
      {
        id: "1",
        sender: "patient",
        message: "Good morning Dr. Sharma! I have a question about my diet plan.",
        date: "2024-02-15T08:30:00Z",
        time: "8:30 AM",
        status: "seen",
        type: "text"
      },
      {
        id: "2",
        sender: "dietitian",
        message: "Good morning Rajesh! Please go ahead and ask your question.",
        date: "2024-02-15T08:32:00Z",
        time: "8:32 AM",
        status: "seen",
        type: "text"
      },
      {
        id: "3",
        sender: "patient",
        message: "I'm finding it difficult to have breakfast at 8 AM as suggested. Can I adjust it to 9 AM?",
        date: "2024-02-15T08:33:00Z",
        time: "8:33 AM",
        status: "seen",
        type: "text"
      },
      {
        id: "4",
        sender: "dietitian",
        message: "That's absolutely fine! 9 AM is still within the optimal window. I'll update your meal timing preferences.",
        date: "2024-02-15T08:35:00Z",
        time: "8:35 AM",
        status: "seen",
        type: "text"
      },
      {
        id: "5",
        sender: "patient",
        message: "Also, I've been feeling more energetic since starting the Pitta pacifying diet! My digestion has improved significantly.",
        date: "2024-02-15T08:37:00Z",
        time: "8:37 AM",
        status: "seen",
        type: "health_update",
        updateType: "energy",
        details: "Increased energy, improved digestion"
      },
      {
        id: "6",
        sender: "dietitian",
        message: "Excellent news, Rajesh! 🎉 Keep up the great work. Continue with the current plan and let me know if you need any modifications.",
        date: "2024-02-15T08:38:00Z",
        time: "8:38 AM",
        status: "seen",
        type: "text"
      }
    ],
    P002: [
      {
        id: "1",
        sender: "patient",
        message: "Hi Dr. Sharma, I missed yesterday's dinner due to work. Should I make up for it today?",
        date: "2024-02-15T10:15:00Z",
        time: "10:15 AM",
        status: "received",
        type: "text"
      },
      {
        id: "2",
        sender: "dietitian",
        message: "Hi Priya! No need to worry about making up missed meals. Just focus on today's plan. Consistency is more important than perfection.",
        date: "2024-02-15T10:18:00Z",
        time: "10:18 AM",
        status: "seen",
        type: "text"
      },
      {
        id: "3",
        sender: "patient",
        message: "Got it. Also, I've been having trouble sleeping. Any Ayurvedic recommendations?",
        date: "2024-02-15T10:20:00Z",
        time: "10:20 AM",
        status: "received",
        type: "text"
      },
      {
        id: "4",
        sender: "dietitian",
        message: "For better sleep, try warm milk with turmeric before bedtime, maintain consistent sleep schedule, and avoid screens 1 hour before sleep. I'll send you some bedtime practices.",
        date: "2024-02-15T10:25:00Z",
        time: "10:25 AM",
        status: "seen",
        type: "text"
      },
      {
        id: "5",
        sender: "dietitian",
        message: "📎 Sleep_Guide.pdf",
        date: "2024-02-15T10:26:00Z",
        time: "10:26 AM",
        status: "sent",
        type: "attachment",
        fileName: "Sleep_Guide.pdf",
        fileType: "pdf",
        fileSize: "1.2 MB"
      }
    ],
    P003: [
      {
        id: "1",
        sender: "patient",
        message: "Hello Doctor! My bowel movements have been irregular this week. Any suggestions?",
        date: "2024-02-15T14:20:00Z",
        time: "2:20 PM",
        status: "received",
        type: "text"
      },
      {
        id: "2",
        sender: "dietitian",
        message: "Ankit, this could be due to seasonal changes. Try drinking warm water first thing in the morning and include more fiber-rich vegetables. I'll send a quick remedy.",
        date: "2024-02-15T14:25:00Z",
        time: "2:25 PM",
        status: "seen",
        type: "text"
      },
      {
        id: "3",
        sender: "dietitian",
        message: "🔄 Reminder: Take Triphala powder with warm water tonight",
        date: "2024-02-15T14:26:00Z",
        time: "2:26 PM",
        status: "sent",
        type: "reminder",
        reminderType: "triphala",
        dueTime: "Tonight"
      }
    ],
    P004: [
      {
        id: "1",
        sender: "patient",
        message: "Dr. Sharma, I have a severe headache and nausea today. Should I modify my diet?",
        date: "2024-02-15T16:45:00Z",
        time: "4:45 PM",
        status: "received",
        type: "urgent",
        priority: "high"
      },
      {
        id: "2",
        sender: "dietitian",
        message: "Meera, headaches and nausea could indicate aggravated Pitta. Stick to cooling foods today. Avoid spices and sour foods. Drink coconut water and rest.",
        date: "2024-02-15T16:50:00Z",
        time: "4:50 PM",
        status: "seen",
        type: "text"
      },
      {
        id: "3",
        sender: "dietitian",
        message: "⚠️ Emergency diet modification: Pitta-provoking foods eliminated",
        date: "2024-02-15T16:51:00Z",
        time: "4:51 PM",
        status: "sent",
        type: "alert",
        alertType: "diet_modification"
      }
    ],
    P005: [
      {
        id: "1",
        sender: "patient",
        message: "Doctor, I've lost 3 kgs this month! Feeling great! 💪",
        date: "2024-02-15T11:30:00Z",
        time: "11:30 AM",
        status: "seen",
        type: "health_update",
        updateType: "weight_loss",
        details: "Lost 3 kgs this month"
      },
      {
        id: "2",
        sender: "dietitian",
        message: "Fantastic progress Vikram! 🎉 That's excellent weight management. Keep up the Kapha-reducing diet. How are you feeling energy-wise?",
        date: "2024-02-15T11:32:00Z",
        time: "11:32 AM",
        status: "seen",
        type: "text"
      },
      {
        id: "3",
        sender: "patient",
        message: "Much more energetic! And my sugar levels have improved too.",
        date: "2024-02-15T11:35:00Z",
        time: "11:35 AM",
        status: "received",
        type: "health_update",
        updateType: "blood_sugar",
        details: "Sugar levels improved"
      }
    ],
    P006: [
      {
        id: "1",
        sender: "patient",
        message: "Hello! I'm new to Ayurveda. Can you explain what Vata means in simple terms?",
        date: "2024-02-15T09:00:00Z",
        time: "9:00 AM",
        status: "received",
        type: "text"
      },
      {
        id: "2",
        sender: "dietitian",
        message: "Welcome to Ayurveda! 🌿 Vata is the 'Air' element - it governs movement, circulation, breathing, and nervous system. Vata types tend to be creative, energetic, but may experience anxiety or digestive issues when imbalanced.",
        date: "2024-02-15T09:05:00Z",
        time: "9:05 AM",
        status: "seen",
        type: "text"
      },
      {
        id: "3",
        sender: "dietitian",
        message: "I'll send you an introductory guide to help you understand your constitution better!",
        date: "2024-02-15T09:06:00Z",
        time: "9:06 AM",
        status: "sent",
        type: "text"
      },
      {
        id: "4",
        sender: "dietitian",
        message: "📎 Ayurveda_Basics_Vata.pdf",
        date: "2024-02-15T09:07:00Z",
        time: "9:07 AM",
        status: "sent",
        type: "attachment",
        fileName: "Ayurveda_Basics_Vata.pdf",
        fileType: "pdf",
        fileSize: "2.1 MB"
      }
    ],
    P007: [
      {
        id: "1",
        sender: "patient",
        message: "Dr. Sharma, can I substitute quinoa for rice in my lunch?",
        date: "2024-02-15T12:15:00Z",
        time: "12:15 PM",
        status: "received",
        type: "text"
      },
      {
        id: "2",
        sender: "dietitian",
        message: "Absolutely! Quinoa is actually better for Pitta pacification. It's cooling and lighter than rice. Go ahead and substitute it.",
        date: "2024-02-15T12:17:00Z",
        time: "12:17 PM",
        status: "seen",
        type: "text"
      },
      {
        id: "3",
        sender: "patient",
        message: "Perfect! Should I cook it differently for better digestion?",
        date: "2024-02-15T12:18:00Z",
        time: "12:18 PM",
        status: "received",
        type: "text"
      },
      {
        id: "4",
        sender: "dietitian",
        message: "Yes! Add a pinch of cumin seeds and cook it with a bit of ghee. This will enhance its digestibility and cooling properties.",
        date: "2024-02-15T12:20:00Z",
        time: "12:20 PM",
        status: "seen",
        type: "text"
      }
    ],
    P008: [
      {
        id: "1",
        sender: "dietitian",
        message: "🔔 Weekly check-in: How has your progress been this week? Any challenges or improvements to discuss?",
        date: "2024-02-15T07:00:00Z",
        time: "7:00 AM",
        status: "sent",
        type: "reminder",
        reminderType: "weekly_checkin"
      },
      {
        id: "2",
        sender: "patient",
        message: "Overall good week! Sleep improved, less bloating. Only concern is occasional heartburn after lunch.",
        date: "2024-02-15T15:30:00Z",
        time: "3:30 PM",
        status: "received",
        type: "text"
      },
      {
        id: "3",
        sender: "dietitian",
        message: "Heartburn after lunch suggests Pitta aggravation. Let's modify lunch timing - eat earlier and include cooling foods. I'll update your plan.",
        date: "2024-02-15T15:35:00Z",
        time: "3:35 PM",
        status: "seen",
        type: "text"
      }
    ]
  };

  const unreadCounts = {
    P001: 0,
    P002: 2,
    P003: 1,
    P004: 1,
    P005: 1,
    P006: 1,
    P007: 2,
    P008: 1
  };

  useEffect(() => {
    const allPatients = dataService.getAllPatients();
    setPatients(allPatients);
    if (allPatients.length > 0 && !selectedPatient) {
      setSelectedPatient(allPatients[0]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedPatient, dynamicMessages]);

  const sendMessage = () => {
    if (newMessage.trim() && selectedPatient) {
      // Create new message object
      const messageId = Date.now().toString();
      const newMessageObj = {
        id: messageId,
        sender: "dietitian",
        message: newMessage.trim(),
        date: new Date().toISOString(),
        time: formatTime(new Date().toISOString()),
        status: "sent",
        type: "text"
      };

      // Add message to dynamic messages
      setDynamicMessages(prev => ({
        ...prev,
        [selectedPatient.id]: [
          ...(prev[selectedPatient.id] || []),
          newMessageObj
        ]
      }));

      // Clear input and hide typing
      setNewMessage("");
      setTyping(false);
      
      // Scroll to bottom after a short delay to ensure message is rendered
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    setTyping(true);
    setTimeout(() => setTyping(false), 1000);
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDoshaIcon = (dosha) => {
    switch(dosha.toLowerCase()) {
      case 'vata': return '⚡';
      case 'pitta': return '🔥';
      case 'kapha': return '🌊';
      default: return '🌿';
    }
  };

  const getDoshaColor = (dosha) => {
    switch(dosha.toLowerCase()) {
      case 'vata': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pitta': return 'text-red-600 bg-red-50 border-red-200';
      case 'kapha': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getMessageBubbleStyle = (sender) => {
    return sender === 'dietitian' 
      ? "bg-gradient-to-r from-[#3BA55C] to-[#4C8C4A] text-white ml-8"
      : "bg-gradient-to-r from-[#C97A40] to-[#E89F71] text-white mr-8";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F3E6] to-[#FAF8F2]">
      <DashboardNav />
      
      <div className="pt-20 h-screen">
        <div className="flex h-full">
          {/* Left Panel - Patient List */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className={`bg-white border-r-2 border-[#3BA55C]/20 shadow-lg w-80 flex flex-col ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex'} lg:relative`}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#3BA55C]/20 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-[#7A5C3A]">
                  Messages
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-[#7A5C3A] hover:bg-[#3BA55C]/10 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-[#3BA55C]/20 rounded-xl focus:ring-2 focus:ring-[#3BA55C]/20 focus:border-[#3BA55C] transition-all duration-300"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#7A5C3A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filter */}
              <div className="mt-4 flex space-x-2">
                {['all', 'unread', 'urgent'].map((filterType) => (
                  <motion.button
                    key={filterType}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                      filter === filterType
                        ? "bg-[#3BA55C] text-white"
                        : "bg-[#3BA55C]/10 text-[#7A5C3A] hover:bg-[#3BA55C]/20"
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Patient List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredPatients.map((patient, index) => {
                const unreadCount = unreadCounts[patient.id] || 0;
                const lastMessage = hardcodedMessages[patient.id]?.[hardcodedMessages[patient.id].length - 1];
                
                return (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ 
                      backgroundColor: "#3BA55C/5",
                      x: 4,
                      scale: 1.02
                    }}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 border-b border-[#3BA55C]/10 cursor-pointer transition-all duration-300 flex items-center space-x-3 ${
                      selectedPatient?.id === patient.id 
                        ? "bg-gradient-to-r from-[#3BA55C]/10 to-[#4C8C4A]/10 border-l-4 border-[#3BA55C]" 
                        : "hover:bg-[#3BA55C]/5"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#3BA55C] to-[#4C8C4A] rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {/* Online Status */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-[#7A5C3A] truncate">
                          {patient.name}
                        </h3>
                        <span className={`text-sm px-2 py-1 rounded-full border ${getDoshaColor(patient.prakriti)}`}>
                          {getDoshaIcon(patient.prakriti)} {patient.prakriti}
                        </span>
                      </div>
                      <p className="text-sm text-[#7A5C3A]/70 truncate">
                        {lastMessage?.message.slice(0, 50)}...
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-[#7A5C3A]/60">
                          {lastMessage?.time}
                        </span>
                        <div className="flex items-center space-x-1">
                          {lastMessage?.type === 'urgent' && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                          {unreadCount > 0 && (
                            <span className="px-2 py-1 bg-[#F4C542] text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Panel - Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedPatient ? (
              <>
                {/* Chat Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-b-2 border-[#3BA55C]/20 shadow-sm p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#3BA55C] to-[#4C8C4A] rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold">
                          {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#7A5C3A]">
                          {selectedPatient.name}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-sm border ${getDoshaColor(selectedPatient.prakriti)}`}>
                            {getDoshaIcon(selectedPatient.prakriti)} {selectedPatient.prakriti}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            selectedPatient.priority === 'High' ? 'bg-red-100 text-red-800' :
                            selectedPatient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {selectedPatient.priority} Priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Security Indicator */}
                      <div className="flex items-center space-x-2 text-[#7A5C3A]/70">
                        <span className="text-sm">🔒</span>
                        <span className="text-sm font-medium">End-to-End Encrypted</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-[#7A5C3A]/70">Online</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#F8F3E6] to-[#FAF8F2] p-6">
                  <AnimatePresence>
                    {(() => {
                      const hardcodedMsgs = hardcodedMessages[selectedPatient.id] || [];
                      const dynamicMsgs = dynamicMessages[selectedPatient.id] || [];
                      const allMessages = [...hardcodedMsgs, ...dynamicMsgs].sort((a, b) => 
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                      );
                      return allMessages.map((message, index) => {
                        const isNewMessage = dynamicMessages[selectedPatient.id]?.some(msg => msg.id === message.id);
                        return (
                        <motion.div
                          key={message.id}
                          initial={isNewMessage ? { opacity: 0, y: 20, scale: 0.95 } : { opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: isNewMessage ? 0.5 : 0.3, 
                            delay: isNewMessage ? 0 : index * 0.1 
                          }}
                          className="mb-6"
                        >
                        {/* Message Bubble */}
                        <div className={`flex ${message.sender === 'dietitian' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${message.sender === 'dietitian' ? 'order-1' : 'order-2'}`}>
                            {/* Message Card */}
                            <div className={`rounded-2xl p-4 shadow-lg ${getMessageBubbleStyle(message.sender)}`}>
                              {/* Message Type Indicator */}
                              {message.type === 'reminder' && (
                                <div className="mb-2 p-2 bg-yellow-100/30 rounded-lg border border-yellow-300/50">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">🔔</span>
                                    <span className="text-sm font-semibold">Reminder</span>
                                  </div>
                                  {message.reminderType === 'triphala' && (
                                    <p className="text-xs mt-1">Due: {message.dueTime}</p>
                                  )}
                                </div>
                              )}
                              
                              {message.type === 'health_update' && (
                                <div className="mb-2 p-2 bg-green-100/30 rounded-lg border border-green-300/50">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">📊</span>
                                    <span className="text-sm font-semibold">Health Update</span>
                                  </div>
                                  <p className="text-xs mt-1">{message.details}</p>
                                </div>
                              )}

                              {message.type === 'attachment' && (
                                <div className="mb-2 p-2 bg-blue-100/30 rounded-lg border border-blue-300/50">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">📎</span>
                                    <span className="text-sm font-semibold">{message.fileName}</span>
                                  </div>
                                  <p className="text-xs mt-1">{message.fileSize}</p>
                                </div>
                              )}

                              {message.type === 'urgent' && (
                                <div className="mb-2 p-2 bg-red-100/30 rounded-lg border border-red-300/50">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">⚠️</span>
                                    <span className="text-sm font-semibold">Urgent</span>
                                  </div>
                                </div>
                              )}

                              {message.type === 'alert' && (
                                <div className="mb-2 p-2 bg-orange-100/30 rounded-lg border border-orange-300/50">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">🚨</span>
                                    <span className="text-sm font-semibold">Diet Alert</span>
                                  </div>
                                </div>
                              )}

                              {/* Message Text */}
                              <p className="text-sm break-words">{message.message}</p>

                              {/* Message Footer */}
                              <div className="flex items-center justify-end mt-3 space-x-2">
                                <span className="text-xs opacity-75">{message.time}</span>
                                {message.sender === 'dietitian' && (
                                  <span className="text-xs">
                                    {message.status === 'sent' ? '✓' : '✓✓'}
                                    {message.status === 'seen' && <span className="text-blue-400">✓</span>}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                        );
                      });
                    })()}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg ml-8 max-w-[120px]"
                    >
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gray-500 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-500 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-600 ml-2">Typing...</span>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-t-2 border-[#3BA55C]/20 shadow-lg p-6"
                >
                  <div className="flex items-end space-x-4">
                    {/* Emoji Picker */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-3 text-gray-600 hover:text-[#3BA55C] hover:bg-[#3BA55C]/10 rounded-xl transition-colors"
                    >
                      😊
                    </motion.button>

                    {/* Attachment */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 text-gray-600 hover:text-[#3BA55C] hover:bg-[#3BA55C]/10 rounded-xl transition-colors"
                    >
                      📎
                    </motion.button>

                    {/* Message Input */}
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="Type your message..."
                        className="w-full p-4 resize-none border border-[#3BA55C]/20 rounded-xl focus:ring-2 focus:ring-[#3BA55C]/20 focus:border-[#3BA55C] transition-all duration-300"
                        rows="2"
                      />
                      
                      {/* Quick Reply Suggestions */}
                      {newMessage === '' && (
                        <div className="absolute top-2 left-4 flex space-x-2">
                          {['👍', '✅', '🤔', '⚠️'].map((emoji) => (
                            <motion.button
                              key={emoji}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setNewMessage(`${newMessage}${emoji} `)}
                              className="text-lg hover:bg-gray-100 p-1 mt-10
                               rounded-lg transition-colors"
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Send Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className={`p-4 rounded-xl font-semibold transition-all duration-300 ${
                        newMessage.trim()
                          ? "bg-gradient-to-r from-[#3BA55C] to-[#4C8C4A] text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-4 p-4 bg-white border-2 border-[#3BA55C]/20 rounded-xl shadow-lg"
                      >
                        <div className="grid grid-cols-8 gap-2">
                          {['😊', '👍', '❤️', '🎉', '👏', '🔥', '💪', '🌟', '✅', '❌', '⚠️', '🤔', '😢', '😴', '🍽️', '🌿'].map((emoji) => (
                            <motion.button
                              key={emoji}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setNewMessage(`${newMessage}${emoji} `);
                                setShowEmojiPicker(false);
                              }}
                              className="text-lg p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {emoji}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br for-[#F8F3E6] to-[#FAF8F2]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <span className="text-6xl mb-4 block">💬</span>
                  <h3 className="text-2xl font-bold text-[#7A5C3A] mb-2">
                    Select a Patient
                  </h3>
                  <p className="text-[#7A5C3A]/70">
                    Choose a patient from the list to start messaging
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
