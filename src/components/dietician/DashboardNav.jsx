"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Dashboard Navigation Component
const DashboardNav = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [hasNotifications, setHasNotifications] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navGroups = [
    {
      title: "Patient Care",
      links: [
        { name: "Dashboard", sanskrit: "मुख्य पट्टिका", href: "/Dietician/Dashboard" },
        { name: "Patient Management", sanskrit: "रोगी प्रबंधन", href: "/Dietician/Patient_mnmt" },
        { name: "Diet Generator", sanskrit: "आहार निर्माता", href: "/Dietician/DietGenerator" }
      ]
    },
    {
      title: "Analytics & Data",
      links: [
        { name: "Food Database", sanskrit: "खाद्य डेटाबेस", href: "/Dietician/FoodDatabase" },
        
      ]
    }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#4C8C4A]/98 backdrop-blur-lg shadow-2xl border-b-2 border-[#4C8C4A]/30"
          : "bg-[#FAF8F2]/98 backdrop-blur-lg shadow-xl border-b border-[#4C8C4A]/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Side - Simplified Logo & Sanskrit Title */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-4"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-[#4C8C4A] to-[#2A9D8F] rounded-xl flex items-center justify-center shadow-xl"
            >
              <span className="text-white text-xl font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>A</span>
            </motion.div>
            <div>
              <h1 className="text-2xl mr-10 font-bold text-[#7A5C3A]" style={{ fontFamily: 'Inter, sans-serif' }}>Ayursutra</h1>
              <p className="text-sm font-[var(--font-noto-serif-devanagari)] text-[#7A5C3A] font-semibold">
                आहार पथ्य पट्टिका
              </p>
            </div>
          </motion.div>

          {/* Center - Single Line Navigation Links */}
          <div className="hidden xl:flex items-center space-x-8">
            {navGroups.flatMap(group => group.links).map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <motion.button
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveLink(link.name);
                    if (link.href && link.href !== "#") {
                      window.location.href = link.href;
                    }
                  }}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeLink === link.name
                      ? "bg-gradient-to-r from-[#F4A300] to-[#4C8C4A] text-white shadow-lg"
                      : isScrolled
                      ? "text-white hover:text-[#F4A300] hover:bg-white/10"
                      : "text-[#7A5C3A] hover:text-[#4C8C4A] hover:bg-[#4C8C4A]/10"
                  }`}
                >
                  {link.name}
                </motion.button>
                
                {/* Sanskrit Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-[#7A5C3A] text-white text-xs px-2 py-1 rounded whitespace-nowrap font-[var(--font-noto-serif-devanagari)] shadow-lg z-50"
                >
                  {link.sanskrit}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Compact Actions & Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? "text-white hover:bg-white/20 hover:text-[#F4A300]"
                  : "text-[#7A5C3A] hover:bg-[#4C8C4A]/10 hover:text-[#4C8C4A]"
              }`}
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.button>

            {/* Notifications Bell */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative p-2 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? "text-white hover:bg-white/20 hover:text-[#F4A300]"
                  : "text-[#7A5C3A] hover:bg-[#4C8C4A]/10 hover:text-[#4C8C4A]"
              }`}
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM15 17h5l-5 5v-5z" />
              </svg>
              {hasNotifications && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-[#F4A300] rounded-full border-2 border-white"
                />
              )}
            </motion.button>

            {/* Compact Profile Section */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? "bg-white/20 hover:bg-white/30 text-white"
                    : "bg-gradient-to-r from-[#4C8C4A]/10 to-[#2A9D8F]/10 hover:from-[#4C8C4A]/20 hover:to-[#2A9D8F]/20 text-[#7A5C3A]"
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#F4A300] to-[#4C8C4A] rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">DR</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold">Dr. Priya Sharma</p>
                </div>
                <motion.svg
                  animate={{ rotate: isProfileOpen ? 180 : 0 }}
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-[#4C8C4A]/10 overflow-hidden"
                  >
                    <div className="p-6 border-b border-[#4C8C4A]/10 bg-gradient-to-r from-[#4C8C4A]/5 to-[#2A9D8F]/5">
                      <p className="font-bold text-lg text-[#7A5C3A]">Dr. Priya Sharma</p>
                      <p className="text-sm text-[#7A5C3A]/70">priya.sharma@ayursutra.com</p>
                      <p className="text-xs text-[#7A5C3A]/60 mt-1">Ayurvedic Dietitian</p>
                    </div>
                    <div className="py-3">
                      {[
                        { name: "Profile Settings", icon: "👤", desc: "Manage your profile" },
                        { name: "Notification Preferences", icon: "🔔", desc: "Customize alerts" },
                        { name: "Help & Support", icon: "❓", desc: "Get assistance" },
                        { name: "Logout", icon: "🚪", desc: "Sign out safely" }
                      ].map((item, index) => (
                        <motion.button
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ backgroundColor: "#4C8C4A/10", x: 4 }}
                          className="w-full px-6 py-4 text-left text-[#7A5C3A] hover:bg-[#4C8C4A]/10 transition-all duration-200 flex items-center space-x-4 group"
                        >
                          <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                          <div>
                            <span className="text-sm font-semibold block">{item.name}</span>
                            <span className="text-xs text-[#7A5C3A]/60">{item.desc}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`xl:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? "text-white hover:bg-white/20"
                  : "text-[#7A5C3A] hover:bg-[#4C8C4A]/10"
              }`}
            >
              <motion.svg
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden border-t border-[#4C8C4A]/20 bg-white/98 backdrop-blur-lg"
            >
              <div className="py-4 space-y-4">
                {navGroups.flatMap(group => group.links).map((link, index) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 8 }}
                    onClick={() => {
                      setActiveLink(link.name);
                      setIsMobileMenuOpen(false);
                      if (link.name === "Patient Management") {
                        window.location.href = "/Dietician/Patient_mnmt";
                      } else if (link.name === "Dashboard") {
                        window.location.href = "/Dietician/Dashboard";
                      }
                      // Add other navigation links as needed
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeLink === link.name
                        ? "bg-gradient-to-r from-[#F4A300] to-[#4C8C4A] text-white shadow-lg"
                        : "text-[#7A5C3A] hover:bg-[#4C8C4A]/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{link.name}</span>
                      <span className="text-xs font-[var(--font-noto-serif-devanagari)] opacity-70">
                        {link.sanskrit}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default DashboardNav;
