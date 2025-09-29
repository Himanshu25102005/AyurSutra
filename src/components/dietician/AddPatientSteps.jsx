"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Personal Details Step
export const PersonalDetailsStep = ({ formData, handleInputChange, errors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">👤</span>
        <div>
          <h2 className="text-2xl font-bold text-[#7A5C3A]">Personal Details</h2>
          <p className="text-[#7A5C3A]/70">Basic information about the patient</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Full Name *
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 ${
              errors.fullName ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="Enter patient's full name"
          />
          {errors.fullName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.fullName}
            </motion.p>
          )}
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Age *
          </label>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleInputChange("age", Math.max(1, (formData.age || 0) - 1))}
              className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[#7A5C3A] hover:bg-gray-200 transition-colors"
            >
              -
            </motion.button>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange("age", parseInt(e.target.value) || "")}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 text-center ${
                errors.age ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="Age"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleInputChange("age", (formData.age || 0) + 1)}
              className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[#7A5C3A] hover:bg-gray-200 transition-colors"
            >
              +
            </motion.button>
          </div>
          {errors.age && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.age}
            </motion.p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Gender *
          </label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={formData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 ${
              errors.gender ? "border-red-300" : "border-gray-200"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </motion.select>
          {errors.gender && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.gender}
            </motion.p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Phone Number *
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 ${
              errors.phone ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.phone}
            </motion.p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Email Address
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300"
            placeholder="Enter email address"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Address / Location
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 resize-none"
            placeholder="Enter patient's address"
          />
        </div>

        {/* Photo Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Patient Photo
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Patient"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-2xl text-gray-400">👤</span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-[#4C8C4A] text-white rounded-lg font-semibold hover:bg-[#2A9D8F] transition-colors"
            >
              Upload Photo
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Ayurvedic Assessment Step
export const AyurvedicAssessmentStep = ({ formData, handleInputChange, handleDoshaChange, errors }) => {
  const doshaColors = {
    vata: "from-purple-400 to-purple-600",
    pitta: "from-orange-400 to-orange-600",
    kapha: "from-teal-400 to-teal-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">🕉️</span>
        <div>
          <h2 className="text-2xl font-bold text-[#7A5C3A]">Ayurvedic Assessment</h2>
          <p className="text-[#7A5C3A]/70">Dosha analysis and constitution</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Prakriti Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-4">
            Prakriti (Constitution) *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: "vata", label: "Vata", description: "Air & Space", icon: "🌬️" },
              { value: "pitta", label: "Pitta", description: "Fire & Water", icon: "🔥" },
              { value: "kapha", label: "Kapha", description: "Water & Earth", icon: "🌊" }
            ].map((dosha) => (
              <motion.button
                key={dosha.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInputChange("prakriti", dosha.value)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  formData.prakriti === dosha.value
                    ? "border-[#4C8C4A] bg-[#4C8C4A]/10"
                    : "border-gray-200 hover:border-[#4C8C4A]/50"
                }`}
              >
                <div className="text-center">
                  <span className="text-3xl mb-2 block">{dosha.icon}</span>
                  <h3 className="font-semibold text-[#7A5C3A] mb-1">{dosha.label}</h3>
                  <p className="text-sm text-[#7A5C3A]/70">{dosha.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
          {errors.prakriti && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2"
            >
              {errors.prakriti}
            </motion.p>
          )}
        </div>

        {/* Vikriti Balance Widget */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-4">
            Vikriti Balance (Current Imbalance)
          </label>
          <div className="space-y-6">
            {[
              { key: "vata", label: "Vata", icon: "🌬️", color: "purple" },
              { key: "pitta", label: "Pitta", icon: "🔥", color: "orange" },
              { key: "kapha", label: "Kapha", icon: "🌊", color: "teal" }
            ].map((dosha) => (
              <div key={dosha.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span className="text-xl">{dosha.icon}</span>
                    <span className="font-medium text-[#7A5C3A]">{dosha.label}</span>
                  </span>
                  <span className="text-sm font-semibold text-[#7A5C3A]">
                    {formData.vikriti[dosha.key]}%
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.vikriti[dosha.key]}
                    onChange={(e) => handleDoshaChange(dosha.key, parseInt(e.target.value))}
                    className={`w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-${dosha.color}`}
                  />
                  <div className="flex justify-between text-xs text-[#7A5C3A]/60 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Lifestyle & Habits Step
export const LifestyleHabitsStep = ({ formData, handleInputChange, errors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">🌱</span>
        <div>
          <h2 className="text-2xl font-bold text-[#7A5C3A]">Lifestyle & Habits</h2>
          <p className="text-[#7A5C3A]/70">Daily routines and lifestyle patterns</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Meal Frequency */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Daily Meal Frequency *
          </label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={formData.mealFrequency}
            onChange={(e) => handleInputChange("mealFrequency", e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 ${
              errors.mealFrequency ? "border-red-300" : "border-gray-200"
            }`}
          >
            <option value="">Select frequency</option>
            <option value="1">1 meal per day</option>
            <option value="2">2 meals per day</option>
            <option value="3">3 meals per day</option>
            <option value="4">4 meals per day</option>
            <option value="5">5 meals per day</option>
            <option value="6">6+ meals per day</option>
          </motion.select>
          {errors.mealFrequency && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.mealFrequency}
            </motion.p>
          )}
        </div>

        {/* Water Intake */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Daily Water Intake: {formData.waterIntake} liters
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[#7A5C3A]/70">💧</span>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={formData.waterIntake}
              onChange={(e) => handleInputChange("waterIntake", parseFloat(e.target.value))}
              className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
            />
            <span className="text-sm font-semibold text-[#7A5C3A] min-w-[3rem]">
              {formData.waterIntake}L
            </span>
          </div>
        </div>

        {/* Sleep Quality */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Sleep Quality *
          </label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={formData.sleepQuality}
            onChange={(e) => handleInputChange("sleepQuality", e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 ${
              errors.sleepQuality ? "border-red-300" : "border-gray-200"
            }`}
          >
            <option value="">Select sleep quality</option>
            <option value="excellent">🌙 Excellent</option>
            <option value="good">😴 Good</option>
            <option value="average">😐 Average</option>
            <option value="poor">😵 Poor</option>
          </motion.select>
          {errors.sleepQuality && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.sleepQuality}
            </motion.p>
          )}
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Physical Activity Level *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: "sedentary", label: "Sedentary", icon: "🪑", desc: "Little to no exercise" },
              { value: "moderate", label: "Moderate", icon: "🚶", desc: "Light exercise 1-3 days/week" },
              { value: "active", label: "Active", icon: "🏃", desc: "Moderate exercise 3-5 days/week" },
              { value: "very-active", label: "Very Active", icon: "💪", desc: "Intense exercise 6-7 days/week" }
            ].map((activity) => (
              <motion.button
                key={activity.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange("activityLevel", activity.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.activityLevel === activity.value
                    ? "border-[#4C8C4A] bg-[#4C8C4A]/10"
                    : "border-gray-200 hover:border-[#4C8C4A]/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{activity.icon}</span>
                  <div>
                    <h4 className="font-semibold text-[#7A5C3A]">{activity.label}</h4>
                    <p className="text-sm text-[#7A5C3A]/70">{activity.desc}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          {errors.activityLevel && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2"
            >
              {errors.activityLevel}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Dietary Preferences Step
export const DietaryPreferencesStep = ({ formData, handleInputChange, errors }) => {
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");

  const addAllergy = () => {
    if (newAllergy.trim()) {
      handleInputChange("allergies", [...formData.allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index) => {
    const updated = formData.allergies.filter((_, i) => i !== index);
    handleInputChange("allergies", updated);
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      handleInputChange("medications", [...formData.medications, newMedication.trim()]);
      setNewMedication("");
    }
  };

  const removeMedication = (index) => {
    const updated = formData.medications.filter((_, i) => i !== index);
    handleInputChange("medications", updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">🍽️</span>
        <div>
          <h2 className="text-2xl font-bold text-[#7A5C3A]">Dietary Preferences</h2>
          <p className="text-[#7A5C3A]/70">Food preferences and restrictions</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Allergies */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Food Allergies & Intolerances
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300"
              placeholder="Add allergy or intolerance"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addAllergy}
              className="px-4 py-2 bg-[#4C8C4A] text-white rounded-lg font-semibold hover:bg-[#2A9D8F] transition-colors"
            >
              Add
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.allergies.map((allergy, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                <span>{allergy}</span>
                <button
                  onClick={() => removeAllergy(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </div>
        </div>

        {/* Medical Conditions */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Existing Medical Conditions
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            value={formData.medicalConditions}
            onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 resize-none"
            placeholder="List any existing medical conditions..."
          />
        </div>

        {/* Past Treatments */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Past Ayurvedic Treatments
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            value={formData.pastTreatments}
            onChange={(e) => handleInputChange("pastTreatments", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 resize-none"
            placeholder="Describe any previous Ayurvedic treatments or remedies..."
          />
        </div>
      </div>
    </motion.div>
  );
};

// Health Parameters Step
export const HealthParametersStep = ({ formData, handleInputChange, calculateBMI, errors }) => {
  const bmi = calculateBMI();
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { category: "Normal", color: "text-green-600" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" };
    return { category: "Obese", color: "text-red-600" };
  };

  const bmiInfo = bmi ? getBMICategory(bmi) : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">⚕️</span>
        <div>
          <h2 className="text-2xl font-bold text-[#7A5C3A]">Health Parameters</h2>
          <p className="text-[#7A5C3A]/70">Physical measurements and health data</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Weight and Height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
              Weight (kg) *
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || "")}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 ${
                errors.weight ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="Enter weight in kg"
            />
            {errors.weight && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.weight}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
              Height (cm) *
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange("height", parseFloat(e.target.value) || "")}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 ${
                errors.height ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="Enter height in cm"
            />
            {errors.height && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.height}
              </motion.p>
            )}
          </div>
        </div>

        {/* BMI Calculator */}
        {bmi && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#4C8C4A]/10 to-[#2A9D8F]/10 rounded-xl p-6 border border-[#4C8C4A]/20"
          >
            <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">BMI Calculator</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-[#4C8C4A]">{bmi}</p>
                <p className="text-sm text-[#7A5C3A]/70">Body Mass Index</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-semibold ${bmiInfo.color}`}>
                  {bmiInfo.category}
                </p>
                <p className="text-sm text-[#7A5C3A]/70">Category</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Medications */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Current Medications
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={formData.medications.join(", ")}
              onChange={(e) => handleInputChange("medications", e.target.value.split(", ").filter(m => m.trim()))}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300"
              placeholder="Enter medications (comma separated)"
            />
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-semibold text-[#7A5C3A] mb-2">
            Additional Notes
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C8C4A]/20 focus:border-[#4C8C4A] transition-all duration-300 resize-none"
            placeholder="Any additional observations or notes about the patient..."
          />
        </div>
      </div>
    </motion.div>
  );
};
