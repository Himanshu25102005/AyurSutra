"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNav } from "../../../../components/dietician";
import {
  PersonalDetailsStep,
  AyurvedicAssessmentStep,
  LifestyleHabitsStep,
  DietaryPreferencesStep,
  HealthParametersStep
} from "../../../../components/dietician/AddPatientSteps";
import dataService from "../../../../services/dataService";
import "./AddPatient.css";

export default function AddPatient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    photo: null,
    
    // Ayurvedic Assessment
    prakriti: "",
    vikriti: {
      vata: 0,
      pitta: 0,
      kapha: 0
    },
    
    // Lifestyle & Habits
    mealFrequency: "",
    mealTiming: "",
    waterIntake: 2,
    bowelMovements: "",
    sleepDuration: 8,
    sleepQuality: "",
    activityLevel: "",
    
    // Dietary Preferences
    allergies: [],
    cuisines: [],
    medicalConditions: "",
    pastTreatments: "",
    
    // Health Parameters
    weight: "",
    height: "",
    medications: [],
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: "Personal Details", icon: "👤" },
    { id: 2, title: "Ayurvedic Assessment", icon: "🕉️" },
    { id: 3, title: "Lifestyle & Habits", icon: "🌱" },
    { id: 4, title: "Dietary Preferences", icon: "🍽️" },
    { id: 5, title: "Health Parameters", icon: "⚕️" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleDoshaChange = (dosha, value) => {
    setFormData(prev => ({
      ...prev,
      vikriti: {
        ...prev.vikriti,
        [dosha]: value
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.age || formData.age < 1) newErrors.age = "Valid age is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        break;
      case 2:
        if (!formData.prakriti) newErrors.prakriti = "Prakriti assessment is required";
        break;
      case 3:
        if (!formData.mealFrequency) newErrors.mealFrequency = "Meal frequency is required";
        if (!formData.sleepQuality) newErrors.sleepQuality = "Sleep quality is required";
        if (!formData.activityLevel) newErrors.activityLevel = "Activity level is required";
        break;
      case 4:
        // Optional step - no required validations
        break;
      case 5:
        if (!formData.weight || formData.weight < 1) newErrors.weight = "Valid weight is required";
        if (!formData.height || formData.height < 1) newErrors.height = "Valid height is required";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const heightInMeters = formData.height / 100;
      const bmi = formData.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      
      try {
        // Save the patient using the data service
        const newPatient = dataService.addPatient(formData);
        
        console.log("Patient added successfully:", newPatient);
        
        // Show success message
        alert(`Patient ${newPatient.name} has been successfully added to the system!`);
        
        // Redirect back to patient management
        window.location.href = "/Dietician/Patient_mnmt";
      } catch (error) {
        console.error("Error adding patient:", error);
        alert("Error adding patient. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSaveDraft = () => {
    // Save draft functionality
    console.log("Draft saved:", formData);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <DashboardNav />
      
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#7A5C3A] mb-2">
                Add New Patient
              </h1>
              <p className="text-lg text-[#7A5C3A]/70 font-[var(--font-noto-serif-devanagari)]">
                नया रोगी जोड़ें - Enter all relevant details to create a new patient profile
              </p>
            </div>
            
            {/* Progress Indicator */}
            <div className="hidden lg:flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: currentStep >= step.id ? 1 : 0.7 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.icon}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-[#4C8C4A]" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-[#7A5C3A]/70">
            <span>Home</span>
            <span>→</span>
            <span>Patients</span>
            <span>→</span>
            <span className="text-[#4C8C4A] font-semibold">Add New Patient</span>
          </nav>
        </motion.div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <PersonalDetailsStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
              )}
              {currentStep === 2 && (
                <AyurvedicAssessmentStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleDoshaChange={handleDoshaChange}
                  errors={errors}
                />
              )}
              {currentStep === 3 && (
                <LifestyleHabitsStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
              )}
              {currentStep === 4 && (
                <DietaryPreferencesStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
              )}
              {currentStep === 5 && (
                <HealthParametersStep
                  formData={formData}
                  handleInputChange={handleInputChange}
                  calculateBMI={calculateBMI}
                  errors={errors}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24"
            >
              {/* Step Navigation */}
              <div className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">Progress</h3>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <motion.div
                      key={step.id}
                      whileHover={{ x: 4 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        currentStep === step.id
                          ? "bg-gradient-to-r from-[#4C8C4A]/10 to-[#2A9D8F]/10 border border-[#4C8C4A]/20"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentStep(step.id)}
                    >
                      <span className="text-2xl">{step.icon}</span>
                      <div>
                        <p className={`font-medium ${
                          currentStep === step.id ? "text-[#4C8C4A]" : "text-[#7A5C3A]"
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-[#7A5C3A]/60">
                          Step {step.id} of {steps.length}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg border border-[#4C8C4A]/10 p-6">
                <h3 className="text-lg font-semibold text-[#7A5C3A] mb-4">Form Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#7A5C3A]/70">Completion</span>
                    <span className="text-sm font-semibold text-[#4C8C4A]">
                      {Math.round((currentStep / steps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="sticky bottom-0 bg-white border-t border-[#4C8C4A]/10 p-6 mt-8 -mx-6"
        >
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveDraft}
              className="px-6 py-3 border-2 border-[#4C8C4A] text-[#4C8C4A] rounded-xl font-semibold hover:bg-[#4C8C4A] hover:text-white transition-all duration-300"
            >
              Save Draft
            </motion.button>

            <div className="flex space-x-4">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-100 text-[#7A5C3A] rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  Previous
                </motion.button>
              )}

              {currentStep < steps.length ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-[#4C8C4A] to-[#2A9D8F] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Next Step
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-[#F4A300] to-[#4C8C4A] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating Patient..." : "Submit Patient"}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Step Components will be defined in the next part...
