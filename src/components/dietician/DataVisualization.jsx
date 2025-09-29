"use client";

import { motion } from "framer-motion";
import dataService from "../../services/dataService";

const DataVisualization = () => {
  const doshaDistribution = dataService.getDoshaDistribution();
  const complianceStats = dataService.getComplianceStats();
  const weightStats = dataService.getWeightChangeStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Dosha Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#4C8C4A]/10"
      >
        <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">Dosha Distribution</h3>
        <div className="space-y-3">
          {Object.entries(doshaDistribution).map(([dosha, count], index) => (
            <motion.div
              key={dosha}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                  dosha === 'vata' ? 'from-blue-400 to-blue-600' :
                  dosha === 'pitta' ? 'from-red-400 to-red-600' :
                  'from-green-400 to-green-600'
                }`}></div>
                <span className="text-sm font-medium text-[#7A5C3A] capitalize">{dosha}</span>
              </div>
              <span className="text-sm font-bold text-[#4C8C4A]">{count}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Compliance Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#4C8C4A]/10"
      >
        <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">Compliance Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#7A5C3A]">High Compliance (80%+)</span>
            <span className="text-sm font-bold text-green-600">{complianceStats.highCompliance}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#7A5C3A]">Medium Compliance (60-79%)</span>
            <span className="text-sm font-bold text-yellow-600">{complianceStats.mediumCompliance}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#7A5C3A]">Low Compliance (&lt;60%)</span>
            <span className="text-sm font-bold text-red-600">{complianceStats.lowCompliance}</span>
          </div>
          <div className="pt-2 border-t border-[#4C8C4A]/10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#7A5C3A]">Average</span>
              <span className="text-sm font-bold text-[#4C8C4A]">{complianceStats.averageCompliance}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weight Change Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-[#4C8C4A]/10"
      >
        <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">Weight Change Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#7A5C3A]">Total Weight Loss</span>
            <span className="text-sm font-bold text-green-600">{weightStats.totalWeightLoss} kg</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#7A5C3A]">Patients with Weight Loss</span>
            <span className="text-sm font-bold text-green-600">{weightStats.patientsWithWeightLoss}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#7A5C3A]">Patients with Weight Gain</span>
            <span className="text-sm font-bold text-red-600">{weightStats.patientsWithWeightGain}</span>
          </div>
          <div className="pt-2 border-t border-[#4C8C4A]/10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#7A5C3A]">Average Change</span>
              <span className={`text-sm font-bold ${
                weightStats.averageWeightChange < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {weightStats.averageWeightChange > 0 ? '+' : ''}{weightStats.averageWeightChange} kg
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DataVisualization;
