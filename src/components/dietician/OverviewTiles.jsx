"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const OverviewTiles = ({ data, onTileClick }) => {
  const [counters, setCounters] = useState({
    totalPatients: data.totalPatients,
    todayAppointments: data.todayAppointments || 0,
    upcomingAppointments: data.upcomingAppointments,
    completedAppointments: data.completedAppointments || 0,
    vataPatients: data.vataPatients,
    pittaPatients: data.pittaPatients,
    kaphaPatients: data.kaphaPatients,
    highPriority: data.highPriority
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounters({
          totalPatients: Math.floor(data.totalPatients * progress),
          todayAppointments: Math.floor((data.todayAppointments || 0) * progress),
          upcomingAppointments: Math.floor(data.upcomingAppointments * progress),
          completedAppointments: Math.floor((data.completedAppointments || 0) * progress),
          vataPatients: Math.floor(data.vataPatients * progress),
          pittaPatients: Math.floor(data.pittaPatients * progress),
          kaphaPatients: Math.floor(data.kaphaPatients * progress),
          highPriority: Math.floor(data.highPriority * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters(data);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    };

    animateCounters();
  }, [data]);

  const tiles = [
    {
      title: "Total Patients",
      sanskrit: "कुल रोगी",
      value: isClient ? counters.totalPatients : data.totalPatients,
      total: data.totalPatients,
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Today's Appointments",
      sanskrit: "आज की नियुक्ति",
      value: isClient ? counters.todayAppointments : data.todayAppointments,
      total: data.todayAppointments,
      icon: "📅",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Upcoming Appointments",
      sanskrit: "आगामी नियुक्ति",
      value: isClient ? counters.upcomingAppointments : data.upcomingAppointments,
      total: data.upcomingAppointments,
      icon: "⏰",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      title: "Completed Appointments",
      sanskrit: "पूर्ण नियुक्ति",
      value: isClient ? counters.completedAppointments : data.completedAppointments,
      total: data.completedAppointments,
      icon: "✅",
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    {
      title: "Vata Patients",
      sanskrit: "वात रोगी",
      value: isClient ? counters.vataPatients : data.vataPatients,
      total: data.vataPatients,
      icon: "🌪️",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Pitta Patients",
      sanskrit: "पित्त रोगी",
      value: isClient ? counters.pittaPatients : data.pittaPatients,
      total: data.pittaPatients,
      icon: "🔥",
      color: "from-red-400 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    {
      title: "Kapha Patients",
      sanskrit: "कफ रोगी",
      value: isClient ? counters.kaphaPatients : data.kaphaPatients,
      total: data.kaphaPatients,
      icon: "🌊",
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "High Priority",
      sanskrit: "उच्च प्राथमिकता",
      value: isClient ? counters.highPriority : data.highPriority,
      total: data.highPriority,
      icon: "⚠️",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 mb-8">
      {tiles.map((tile, index) => (
        <motion.div
          key={tile.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ 
            y: -8, 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(76, 140, 74, 0.15)"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTileClick && onTileClick(tile.title.toLowerCase().replace(/\s+/g, ''))}
          className={`${tile.bgColor} rounded-2xl p-6 shadow-lg border border-white/50 relative overflow-hidden group cursor-pointer`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full transform -translate-x-4 translate-y-4"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon and Title */}
            <div className="flex items-center justify-between mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="text-3xl"
              >
                {tile.icon}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="w-3 h-3 bg-gradient-to-r from-[#F4A300] to-[#4C8C4A] rounded-full"
              />
            </div>

            {/* Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="mb-2"
            >
              <div className="flex items-baseline space-x-2">
                <motion.span
                  key={`${tile.title}-value`}
                  initial={isClient ? { scale: 1.2 } : { scale: 1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`text-3xl font-bold ${tile.textColor}`}
                >
                  {tile.value}
                </motion.span>
                <span className={`text-sm font-medium ${tile.textColor}/70`}>
                  / {tile.total}
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <div className="mb-2">
              <h3 className={`text-sm font-semibold ${tile.textColor} mb-1`}>
                {tile.title}
              </h3>
              <p className={`text-xs font-[var(--font-noto-serif-devanagari)] ${tile.textColor}/70`}>
                {tile.sanskrit}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/30 rounded-full h-2 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(tile.value / tile.total) * 100}%` }}
                transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
                className={`h-2 bg-gradient-to-r ${tile.color} rounded-full shadow-sm`}
              />
            </div>

            {/* Percentage */}
            <div className="flex justify-between items-center">
              <span className={`text-xs font-medium ${tile.textColor}/70`}>
                {tile.total > 0 ? Math.round((tile.value / tile.total) * 100) : 0}%
              </span>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onTileClick && onTileClick(tile.title.toLowerCase().replace(/\s+/g, ''));
              }}
              className="text-xs text-[#7A5C3A]/60 group-hover:text-[#4C8C4A] transition-colors hover:underline"
            >
              View Details →
            </motion.button>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-[#F4A300]/10 to-[#4C8C4A]/10 rounded-2xl"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewTiles;
