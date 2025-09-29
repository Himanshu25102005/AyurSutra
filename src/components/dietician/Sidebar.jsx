"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setIsCollapsed, onScheduleAppointment }) => {
  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      sanskrit: "मुख्य पट्टिका",
      icon: "📊",
      href: "/Dietician/Dashboard"
    },
    {
      id: "patients",
      name: "Patient Management",
      sanskrit: "रोगी प्रबंधन",
      icon: "👥",
      href: "/Dietician/Patient_mnmt"
    },
    {
      id: "diet-plans",
      name: "Diet Plans",
      sanskrit: "आहार योजना",
      icon: "🍽️",
      href: "/Dietician/Patient_mnmt/Diet_Plans"
    },
    /* {
      id: "reports",
      name: "Reports",
      sanskrit: "रिपोर्ट्स",
      icon: "📈",
      href: "#"
    }, */
    {
      id: "messages",
      name: "Messages",
      sanskrit: "संदेश",
      icon: "💬",
      href: "/Dietician/Patient_mnmt/Messages"
    },
    {
      id: "diet-generator",
      name: "Diet Generator",
      sanskrit: "आहार निर्माता",
      icon: "🤖",
      href: "/Dietician/DietGenerator"
    }
  ];

  const handleNavigation = (item) => {
    if (item.href !== "#") {
      window.location.href = item.href;
    }
    setActiveSection(item.id);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isCollapsed ? -300 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-[#FAF8F2] to-[#F5F3ED] border-r-2 border-[#4C8C4A]/20 shadow-2xl z-50 ${
          isCollapsed ? "lg:translate-x-0" : ""
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#4C8C4A]/20">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#4C8C4A] to-[#2A9D8F] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">A</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#7A5C3A]">Ayursutra</h2>
                <p className="text-xs text-[#7A5C3A]/70 font-[var(--font-noto-serif-devanagari)]">
                  आहार पथ्य पट्टिका
                </p>
              </div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(true)}
              className="lg:hidden p-2 rounded-lg text-[#7A5C3A] hover:bg-[#4C8C4A]/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.button
                whileHover={{ x: 8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-[#F4A300] to-[#4C8C4A] text-white shadow-lg"
                    : "text-[#7A5C3A] hover:bg-[#4C8C4A]/10 hover:text-[#4C8C4A]"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs font-[var(--font-noto-serif-devanagari)] opacity-70">
                    {item.sanskrit}
                  </p>
                </div>
                {activeSection === item.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            </motion.div>
          ))}
        </nav>

        {/* Golden Divider */}
        <div className="px-6 py-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[#F4A300] to-transparent"></div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 space-y-2">
          <h3 className="text-xs font-semibold text-[#7A5C3A]/60 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          {[
            { name: "Add Patient", icon: "➕", action: () => console.log("Add Patient") },
            { name: "Schedule Appointment", icon: "📅", action: onScheduleAppointment || (() => console.log("Schedule")) }
          ].map((action, index) => (
            <motion.button
              key={action.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: (index + 5) * 0.1 }}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-[#7A5C3A] hover:bg-[#4C8C4A]/10 transition-all duration-200 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="text-sm font-medium">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
