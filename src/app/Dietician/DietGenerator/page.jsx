"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNav } from "../../../components/dietician";
import dataService from "../../../services/dataService";
import ayurvedicFoods from "../../../../ayurvedic_food_database.json";

export default function DietGenerator() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planDuration, setPlanDuration] = useState("daily");
  const [draggedItem, setDraggedItem] = useState(null);
  const [showPlanReview, setShowPlanReview] = useState(false);
  const [customMeals, setCustomMeals] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  // Load patients and food data
  useEffect(() => {
    const allPatients = dataService.getAllPatients();
    setPatients(allPatients);
    if (allPatients.length > 0 && !selectedPatient) {
      setSelectedPatient(allPatients[0]);
    }
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Enhanced search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = ayurvedicFoods.filter(food => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          (food.foodItemName && food.foodItemName.toLowerCase().includes(searchTerm)) ||
          (food.foodCategory && food.foodCategory.toLowerCase().includes(searchTerm)) ||
          (food.primaryDoshaEffect && food.primaryDoshaEffect.toLowerCase().includes(searchTerm)) ||
          (food.rasa && food.rasa.toLowerCase().includes(searchTerm)) ||
          (food.guna && food.guna.toLowerCase().includes(searchTerm)) ||
          (food.virya && food.virya.toLowerCase().includes(searchTerm)) ||
          (food.vipaka && food.vipaka.toLowerCase().includes(searchTerm)) ||
          (food.otherNutrients && food.otherNutrients.toLowerCase().includes(searchTerm))
        );
      });
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Filter foods based on search query for suggestions
  const filteredFoods = searchQuery.trim() ? searchResults : ayurvedicFoods.slice(0, 10);

  // Generate AI Diet Plan
  const generateDietPlan = async () => {
    if (!selectedPatient) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const plan = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      duration: planDuration,
      createdAt: new Date().toISOString(),
      meals: planDuration === "daily" ? generateDailyPlan(selectedPatient.prakriti) : generateWeeklyPlan(selectedPatient.prakriti),
      doshaBalance: calculateDoshaBalance(selectedPatient.prakriti)
    };
    
    // Ensure doshaBalance is a valid object
    if (!plan.doshaBalance || typeof plan.doshaBalance !== 'object') {
      plan.doshaBalance = { vata: 33, pitta: 33, kapha: 34 };
    }
    
    setGeneratedPlan(plan);
    
    // Calculate total nutrition after plan is set
    plan.totalNutrition = calculateTotalNutrition();
    setIsGenerating(false);
    setShowPlanReview(true);
  };

  // Generate daily plan
  const generateDailyPlan = (prakriti) => {
    return {
      breakfast: generateMeal("breakfast", prakriti),
      midMorningSnack: generateMeal("snack", prakriti),
      lunch: generateMeal("lunch", prakriti),
      eveningSnack: generateMeal("snack", prakriti),
      dinner: generateMeal("dinner", prakriti)
    };
  };

  // Generate weekly plan
  const generateWeeklyPlan = (prakriti) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyPlan = {};
    
    days.forEach(day => {
      weeklyPlan[day.toLowerCase()] = {
        breakfast: generateMeal("breakfast", prakriti, day),
        midMorningSnack: generateMeal("snack", prakriti, day),
        lunch: generateMeal("lunch", prakriti, day),
        eveningSnack: generateMeal("snack", prakriti, day),
        dinner: generateMeal("dinner", prakriti, day)
      };
    });
    
    return weeklyPlan;
  };

  // Generate meal based on dosha and meal type
  const generateMeal = (mealType, prakriti, day = null) => {
    const suitableFoods = ayurvedicFoods.filter(food => 
      isFoodSuitableForDosha(food, prakriti) && 
      isFoodSuitableForMeal(food, mealType)
    );
    
    const selectedFoods = suitableFoods.slice(0, Math.min(3, suitableFoods.length));
    
    return selectedFoods.map(food => ({
      id: `${food.id}-${Date.now()}`,
      foodId: food.id,
      name: food.foodItemName,
      category: food.foodCategory,
      portion: getPortionSize(food, mealType),
      calories: Math.round(food.energyKcal * getPortionSize(food, mealType) / 100),
      carbs: Math.round(food.carbohydratesG * getPortionSize(food, mealType) / 100),
      protein: Math.round(food.proteinG * getPortionSize(food, mealType) / 100),
      fat: Math.round(food.fatG * getPortionSize(food, mealType) / 100),
      rasa: food.rasa,
      guna: food.guna,
      virya: food.virya,
      vipaka: food.vipaka,
      doshaEffect: food.primaryDoshaEffect,
      preparation: food.preparationNotes
    }));
  };

  // Check if food is suitable for dosha
  const isFoodSuitableForDosha = (food, prakriti) => {
    // Handle case where food or prakriti might be undefined or not strings
    if (!food || !food.primaryDoshaEffect || typeof food.primaryDoshaEffect !== 'string') {
      return true;
    }
    if (!prakriti || typeof prakriti !== 'string') {
      return true;
    }
    
    const effect = food.primaryDoshaEffect.toLowerCase();
    switch (prakriti.toLowerCase()) {
      case 'vata':
        return effect.includes('pacifies vata') || effect.includes('increases kapha');
      case 'pitta':
        return effect.includes('pacifies pitta') || effect.includes('increases vata');
      case 'kapha':
        return effect.includes('pacifies kapha') || effect.includes('increases pitta');
      default:
        return true;
    }
  };

  // Check if food is suitable for meal type
  const isFoodSuitableForMeal = (food, mealType) => {
    switch (mealType) {
      case 'breakfast':
        return ['Grain', 'Fruit', 'Dairy', 'Nut'].includes(food.foodCategory);
      case 'lunch':
        return ['Grain', 'Legume', 'Vegetable', 'Dairy'].includes(food.foodCategory);
      case 'dinner':
        return ['Grain', 'Vegetable', 'Legume'].includes(food.foodCategory);
      case 'snack':
        return ['Fruit', 'Nut', 'Dairy'].includes(food.foodCategory);
      default:
        return true;
    }
  };

  // Get appropriate portion size
  const getPortionSize = (food, mealType) => {
    const basePortions = {
      breakfast: 150,
      lunch: 200,
      dinner: 180,
      snack: 100
    };
    return basePortions[mealType] || 150;
  };

  // Calculate total nutrition
  const calculateTotalNutrition = () => {
    if (!generatedPlan || !generatedPlan.meals) return { calories: 0, carbs: 0, protein: 0, fat: 0 };
    
    const totals = { calories: 0, carbs: 0, protein: 0, fat: 0 };
    
    if (planDuration === 'daily') {
      // Daily plan: meals are direct arrays
      Object.values(generatedPlan.meals).forEach(meal => {
        if (Array.isArray(meal)) {
          meal.forEach(food => {
            totals.calories += food.calories || 0;
            totals.carbs += food.carbs || 0;
            totals.protein += food.protein || 0;
            totals.fat += food.fat || 0;
          });
        }
      });
    } else {
      // Weekly plan: meals are nested by day
      Object.values(generatedPlan.meals).forEach(dayMeals => {
        Object.values(dayMeals).forEach(meal => {
          if (Array.isArray(meal)) {
            meal.forEach(food => {
              totals.calories += food.calories || 0;
              totals.carbs += food.carbs || 0;
              totals.protein += food.protein || 0;
              totals.fat += food.fat || 0;
            });
          }
        });
      });
    }
    
    return totals;
  };

  // Calculate dosha balance
  const calculateDoshaBalance = (prakriti) => {
    const baseBalance = { vata: 33, pitta: 33, kapha: 34 };
    
    // Handle case where prakriti might be undefined or not a string
    if (!prakriti || typeof prakriti !== 'string') {
      return baseBalance;
    }
    
    switch (prakriti.toLowerCase()) {
      case 'vata':
        return { vata: 20, pitta: 35, kapha: 45 };
      case 'pitta':
        return { vata: 45, pitta: 20, kapha: 35 };
      case 'kapha':
        return { vata: 35, pitta: 45, kapha: 20 };
      default:
        return baseBalance;
    }
  };

  // Get dosha color
  const getDoshaColor = (dosha) => {
    // Handle case where dosha might be an object or undefined
    if (!dosha || typeof dosha !== 'string') {
      return 'text-gray-600 bg-gray-50 border-gray-200';
    }
    
    switch (dosha.toLowerCase()) {
      case 'vata': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pitta': return 'text-red-600 bg-red-50 border-red-200';
      case 'kapha': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get dosha icon
  const getDoshaIcon = (dosha) => {
    // Handle case where dosha might be an object or undefined
    if (!dosha || typeof dosha !== 'string') {
      return '🌿';
    }
    
    switch (dosha.toLowerCase()) {
      case 'vata': return '🌪️';
      case 'pitta': return '🔥';
      case 'kapha': return '🌊';
      default: return '🌿';
    }
  };

  // Add food to meal
  const addFoodToMeal = (food, mealType) => {
    if (!generatedPlan) return;
    
    const foodItem = {
      id: `${food.id}-${Date.now()}`,
      foodId: food.id,
      name: food.foodItemName,
      category: food.foodCategory,
      portion: getPortionSize(food, mealType),
      calories: Math.round(food.energyKcal * getPortionSize(food, mealType) / 100),
      carbs: Math.round(food.carbohydratesG * getPortionSize(food, mealType) / 100),
      protein: Math.round(food.proteinG * getPortionSize(food, mealType) / 100),
      fat: Math.round(food.fatG * getPortionSize(food, mealType) / 100),
      rasa: food.rasa,
      guna: food.guna,
      virya: food.virya,
      vipaka: food.vipaka,
      doshaEffect: food.primaryDoshaEffect,
      preparation: food.preparationNotes
    };

    setGeneratedPlan(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: [...(prev.meals[mealType] || []), foodItem]
      }
    }));
  };

  // Save plan
  const savePlan = () => {
    if (generatedPlan && selectedPatient) {
      try {
        const planData = {
          patientId: selectedPatient.id,
          patientName: selectedPatient.name,
          name: `${planDuration === 'daily' ? 'Daily' : 'Weekly'} Diet Plan - ${selectedPatient.name}`,
          duration: planDuration,
          meals: generatedPlan.meals,
          totalNutrition: calculateTotalNutrition(),
          doshaBalance: generatedPlan.doshaBalance,
          generatedBy: 'AI Diet Generator',
          notes: `Generated on ${new Date().toLocaleDateString()} for ${selectedPatient.prakriti} constitution`
        };
        
        const savedPlan = dataService.addDietPlan(planData);
        
        // Trigger custom event to update other components
        window.dispatchEvent(new CustomEvent('patientsUpdated'));
        
        alert(`Diet plan saved successfully! Plan ID: ${savedPlan.id}`);
        setShowPlanReview(false);
      } catch (error) {
        console.error('Error saving diet plan:', error);
        alert('Error saving diet plan. Please try again.');
      }
    }
  };

  // Export PDF
  const exportPDF = async () => {
    if (generatedPlan && selectedPatient) {
      try {
        // Dynamic import to avoid SSR issues
        const { jsPDF } = await import('jspdf');
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPosition = 20;
        
        // Helper function to add text with proper wrapping
        const addText = (text, x, y, options = {}) => {
          const { fontSize = 12, color = '#8D6E63', bold = false } = options;
          doc.setFontSize(fontSize);
          doc.setTextColor(color);
          if (bold) doc.setFont(undefined, 'bold');
          else doc.setFont(undefined, 'normal');
          
          const lines = doc.splitTextToSize(text, pageWidth - 40);
          doc.text(lines, x, y);
          return y + (lines.length * fontSize * 0.4) + 5;
        };
        
        // Helper function to add a line
        const addLine = (y) => {
          doc.setDrawColor(139, 108, 58);
          doc.setLineWidth(0.5);
          doc.line(20, y, pageWidth - 20, y);
          return y + 10;
        };
        
        // Header
        yPosition = addText('AYURSUTRA DIET PLAN', 20, yPosition, { fontSize: 20, bold: true, color: '#8BC34A' });
        yPosition = addText(`Patient: ${selectedPatient.name}`, 20, yPosition, { fontSize: 14, bold: true });
        yPosition = addText(`Constitution: ${selectedPatient.prakriti}`, 20, yPosition, { fontSize: 12 });
        yPosition = addText(`Plan Type: ${planDuration === 'daily' ? 'Daily' : 'Weekly'} Plan`, 20, yPosition, { fontSize: 12 });
        yPosition = addText(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition, { fontSize: 12 });
        yPosition = addLine(yPosition);
        
        // Nutrition Summary
        yPosition = addText('NUTRITION SUMMARY', 20, yPosition, { fontSize: 16, bold: true, color: '#8BC34A' });
        const nutrition = calculateTotalNutrition();
        yPosition = addText(`🔥 Calories: ${nutrition.calories}`, 20, yPosition, { fontSize: 12 });
        yPosition = addText(`💪 Protein: ${nutrition.protein}g`, 20, yPosition, { fontSize: 12 });
        yPosition = addText(`🌾 Carbohydrates: ${nutrition.carbs}g`, 20, yPosition, { fontSize: 12 });
        yPosition = addText(`🥑 Fat: ${nutrition.fat}g`, 20, yPosition, { fontSize: 12 });
        yPosition = addLine(yPosition);
        
        // Dosha Balance
        yPosition = addText('DOSHA BALANCE', 20, yPosition, { fontSize: 16, bold: true, color: '#8BC34A' });
        if (generatedPlan.doshaBalance && typeof generatedPlan.doshaBalance === 'object') {
          Object.entries(generatedPlan.doshaBalance).forEach(([dosha, percentage]) => {
            yPosition = addText(`${dosha.charAt(0).toUpperCase() + dosha.slice(1)}: ${percentage}%`, 20, yPosition, { fontSize: 12 });
          });
        } else {
          yPosition = addText('No dosha balance data available', 20, yPosition, { fontSize: 12, color: '#666' });
        }
        yPosition = addLine(yPosition);
        
        // Meal Plan
        yPosition = addText('MEAL PLAN', 20, yPosition, { fontSize: 16, bold: true, color: '#8BC34A' });
        
        if (planDuration === 'daily') {
          // Daily Plan
          Object.entries(generatedPlan.meals).forEach(([mealType, foods]) => {
            if (yPosition > pageHeight - 50) {
              doc.addPage();
              yPosition = 20;
            }
            
            yPosition = addText(mealType.replace(/([A-Z])/g, ' $1').trim().toUpperCase(), 20, yPosition, { fontSize: 14, bold: true });
            
            const foodsArray = Array.isArray(foods) ? foods : [];
            foodsArray.forEach((food) => {
              if (yPosition > pageHeight - 30) {
                doc.addPage();
                yPosition = 20;
              }
              
              yPosition = addText(`• ${food.name} (${food.portion}g)`, 30, yPosition, { fontSize: 11 });
              yPosition = addText(`  Calories: ${food.calories} | Protein: ${food.protein}g | Rasa: ${food.rasa} | Guna: ${food.guna}`, 30, yPosition, { fontSize: 10, color: '#666' });
              yPosition += 3;
            });
            yPosition += 5;
          });
        } else {
          // Weekly Plan
          Object.entries(generatedPlan.meals).forEach(([day, dayMeals]) => {
            if (yPosition > pageHeight - 50) {
              doc.addPage();
              yPosition = 20;
            }
            
            yPosition = addText(day.charAt(0).toUpperCase() + day.slice(1).toUpperCase(), 20, yPosition, { fontSize: 14, bold: true });
            
            Object.entries(dayMeals).forEach(([mealType, foods]) => {
              if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = 20;
              }
              
              yPosition = addText(`  ${mealType.replace(/([A-Z])/g, ' $1').trim()}`, 30, yPosition, { fontSize: 12, bold: true });
              
              const foodsArray = Array.isArray(foods) ? foods : [];
              foodsArray.forEach((food) => {
                if (yPosition > pageHeight - 30) {
                  doc.addPage();
                  yPosition = 20;
                }
                
                yPosition = addText(`    • ${food.name} (${food.portion}g)`, 40, yPosition, { fontSize: 10 });
                yPosition = addText(`      ${food.calories} cal | ${food.protein}g protein | ${food.rasa}`, 40, yPosition, { fontSize: 9, color: '#666' });
                yPosition += 2;
              });
              yPosition += 3;
            });
            yPosition += 5;
          });
        }
        
        // Footer
        yPosition = addLine(yPosition);
        yPosition = addText('Generated by Ayursutra AI Diet Generator', 20, yPosition, { fontSize: 10, color: '#666' });
        yPosition = addText('For personalized Ayurvedic nutrition guidance', 20, yPosition, { fontSize: 10, color: '#666' });
        
        // Save the PDF
        const fileName = `DietPlan_${selectedPatient.name.replace(/\s+/g, '_')}_${planDuration}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        alert('PDF exported successfully!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3E7] to-[#FAF8F2]">
      <DashboardNav />
      
      <div className="pt-20 min-h-screen">
        <div className="flex min-h-screen">
          {/* Patient Context Panel */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: isSidebarCollapsed ? -300 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`bg-white border-r-2 border-[#8BC34A]/20 shadow-lg w-80 flex flex-col ${isSidebarCollapsed ? 'lg:translate-x-0' : ''}`}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#8BC34A]/20 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#8D6E63]">Patient Context</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="lg:hidden p-2 rounded-lg text-[#8D6E63] hover:bg-[#8BC34A]/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Patient Selector */}
              <select
                value={selectedPatient?.id || ''}
                onChange={(e) => {
                  const patient = patients.find(p => p.id === e.target.value);
                  setSelectedPatient(patient);
                }}
                className="w-full px-4 py-3 border border-[#8BC34A]/30 rounded-xl focus:ring-2 focus:ring-[#8BC34A]/20 focus:border-[#8BC34A] transition-all"
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.prakriti}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Details */}
            {selectedPatient && (
              <div className="flex-1 overflow-y-auto p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Patient Photo & Basic Info */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#8BC34A] to-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-white text-2xl font-bold">
                        {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#8D6E63]">{selectedPatient.name}</h3>
                    <p className="text-sm text-[#8D6E63]/70">{selectedPatient.age} years, {selectedPatient.gender}</p>
                  </div>

                  {/* Dosha Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#8D6E63]">Constitution</h4>
                    <div className="space-y-2">
                      <div className={`px-3 py-2 rounded-lg border ${getDoshaColor(selectedPatient.prakriti)}`}>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getDoshaIcon(selectedPatient.prakriti)}</span>
                          <span className="font-medium">Prakriti: {selectedPatient.prakriti}</span>
                        </div>
                      </div>
                      {selectedPatient.vikriti && (
                        <div className={`px-3 py-2 rounded-lg border ${getDoshaColor(selectedPatient.vikriti)}`}>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getDoshaIcon(selectedPatient.vikriti)}</span>
                            <span className="font-medium">Vikriti: {selectedPatient.vikriti}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Allergies & Restrictions */}
                  {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#8D6E63]">Allergies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dietary Preferences */}
                  {selectedPatient.dietaryPreference && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#8D6E63]">Dietary Preference</h4>
                      <span className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded-lg">
                        {selectedPatient.dietaryPreference}
                      </span>
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#8D6E63]">Quick Links</h4>
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="w-full text-left px-3 py-2 bg-[#8BC34A]/10 text-[#8D6E63] rounded-lg hover:bg-[#8BC34A]/20 transition-colors"
                      >
                        📋 Previous Diet Plans
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="w-full text-left px-3 py-2 bg-[#8BC34A]/10 text-[#8D6E63] rounded-lg hover:bg-[#8BC34A]/20 transition-colors"
                      >
                        📊 Progress Logs
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Natural Language Query Search */}
            <div className="p-6 border-b border-[#8BC34A]/20 bg-white">
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search foods... (e.g., 'Foods cooling for Pitta', 'High-protein snacks', 'Almond', 'Rice')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchResults(true)}
                    className="w-full px-6 py-4 pl-14 border border-[#8BC34A]/30 rounded-2xl focus:ring-2 focus:ring-[#8BC34A]/20 focus:border-[#8BC34A] transition-all text-lg"
                  />
                  <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#8D6E63]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchQuery.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#8BC34A]/20 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
                    >
                      {searchResults.length > 0 ? (
                        searchResults.slice(0, 8).map((food, index) => (
                          <motion.div
                            key={food.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 hover:bg-[#8BC34A]/5 border-b border-[#8BC34A]/10 last:border-b-0 cursor-pointer"
                            onClick={() => {
                              setSearchQuery(food.foodItemName);
                              setShowSearchResults(false);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-[#8D6E63]">{food.foodItemName}</h4>
                                <p className="text-sm text-[#8D6E63]/70">{food.foodCategory} • {food.rasa} • {food.primaryDoshaEffect}</p>
                              </div>
                              <span className="text-sm text-[#8D6E63]/60">{food.energyKcal} cal</span>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-[#8D6E63]/60">
                          No foods found matching "{searchQuery}"
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Diet Plan Generator */}
            <div className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                {/* Generator Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-[#8D6E63] mb-4">
                    AI Diet Plan Generator
                  </h1>
                  <p className="text-lg text-[#8D6E63]/70 mb-6">
                    Create personalized Ayurvedic meal plans based on patient constitution
                  </p>
                  
                  {/* Plan Duration Selector */}
                  <div className="flex justify-center space-x-4 mb-8">
                    {['daily', 'weekly'].map((duration) => (
                      <motion.button
                        key={duration}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPlanDuration(duration)}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                          planDuration === duration
                            ? 'bg-[#8BC34A] text-white shadow-lg'
                            : 'bg-white text-[#8D6E63] border-2 border-[#8BC34A]/30 hover:border-[#8BC34A]'
                        }`}
                      >
                        {duration.charAt(0).toUpperCase() + duration.slice(1)} Plan
                      </motion.button>
                    ))}
                  </div>

                  {/* Generate Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateDietPlan}
                    disabled={!selectedPatient || isGenerating}
                    className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      selectedPatient && !isGenerating
                        ? 'bg-gradient-to-r from-[#8BC34A] to-[#D4AF37] text-white shadow-xl hover:shadow-2xl hover:from-[#7AB33A] hover:to-[#C49F27]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating {planDuration === 'daily' ? 'Daily' : 'Weekly'} Plan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Generate AI Diet Plan</span>
                      </div>
                    )}
                  </motion.button>
                </div>

                {/* Generated Plan Display */}
                <AnimatePresence>
                  {generatedPlan && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {planDuration === 'daily' ? (
                        // Daily Plan Display
                        generatedPlan && generatedPlan.meals ? Object.entries(generatedPlan.meals).map(([mealType, foods], index) => {
                          // Ensure foods is an array
                          const foodsArray = Array.isArray(foods) ? foods : [];
                          
                          return (
                            <motion.div
                              key={mealType}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="bg-white rounded-2xl shadow-lg p-6 border border-[#8BC34A]/20"
                            >
                              <h3 className="text-xl font-bold text-[#8D6E63] mb-4 capitalize">
                                {mealType.replace(/([A-Z])/g, ' $1').trim()}
                              </h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {foodsArray.length > 0 ? foodsArray.map((food) => (
                              <motion.div
                                key={food.id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="bg-gradient-to-br from-[#F5F3E7] to-white rounded-xl p-4 border border-[#8BC34A]/10 shadow-sm"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-semibold text-[#8D6E63]">{food.name}</h4>
                                  <span className="text-sm text-[#8D6E63]/70">{food.portion}g</span>
                                </div>
                                
                                {/* Nutritional Info */}
                                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                                    <div className="text-lg mb-1">🔥</div>
                                    <div className="font-semibold text-blue-700">{food.calories}</div>
                                    <div className="text-blue-600">Cal</div>
                                  </div>
                                  <div className="text-center p-2 bg-green-50 rounded-lg">
                                    <div className="text-lg mb-1">💪</div>
                                    <div className="font-semibold text-green-700">{food.protein}g</div>
                                    <div className="text-green-600">Protein</div>
                                  </div>
                                </div>
                                
                                {/* Ayurvedic Properties */}
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-1">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                      {food.rasa}
                                    </span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                      {food.guna}
                                    </span>
                                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                      {food.virya}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#8D6E63]/70">{food.doshaEffect}</p>
                                </div>
                              </motion.div>
                                )) : (
                                  <div className="col-span-full text-center py-8 text-[#8D6E63]/60">
                                    <span className="text-4xl mb-2 block">🍽️</span>
                                    <p>No foods generated for this meal</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        }) : (
                          <div className="text-center text-[#8D6E63]/60 py-8">
                            <span className="text-4xl mb-2 block">🍽️</span>
                            <p>No meal plan generated yet</p>
                          </div>
                        )
                      ) : (
                        // Weekly Plan Display
                        generatedPlan && generatedPlan.meals ? Object.entries(generatedPlan.meals).map(([day, dayMeals], dayIndex) => (
                          <motion.div
                            key={day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6 border border-[#8BC34A]/20"
                          >
                            <h3 className="text-xl font-bold text-[#8D6E63] mb-6 capitalize">
                              {day.charAt(0).toUpperCase() + day.slice(1)}
                            </h3>
                            
                            <div className="space-y-4">
                              {Object.entries(dayMeals).map(([mealType, foods], mealIndex) => {
                                const foodsArray = Array.isArray(foods) ? foods : [];
                                
                                return (
                                  <div key={mealType} className="border border-[#8BC34A]/10 rounded-lg p-4">
                                    <h4 className="font-semibold text-[#8D6E63] mb-3 capitalize">
                                      {mealType.replace(/([A-Z])/g, ' $1').trim()}
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {foodsArray.length > 0 ? foodsArray.map((food) => (
                                        <motion.div
                                          key={food.id}
                                          whileHover={{ scale: 1.02, y: -2 }}
                                          className="bg-gradient-to-br from-[#F5F3E7] to-white rounded-lg p-3 border border-[#8BC34A]/10 shadow-sm"
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <h5 className="font-semibold text-[#8D6E63] text-sm">{food.name}</h5>
                                            <span className="text-xs text-[#8D6E63]/70">{food.portion}g</span>
                                          </div>
                                          
                                  <div className="grid grid-cols-2 gap-1 mb-2 text-xs">
                                    <div className="text-center p-1 bg-blue-50 rounded">
                                      <div className="text-sm mb-1">🔥</div>
                                      <div className="font-semibold text-blue-700">{food.calories}</div>
                                      <div className="text-blue-600">Cal</div>
                                    </div>
                                    <div className="text-center p-1 bg-green-50 rounded">
                                      <div className="text-sm mb-1">💪</div>
                                      <div className="font-semibold text-green-700">{food.protein}g</div>
                                      <div className="text-green-600">Protein</div>
                                    </div>
                                  </div>
                                          
                                          <div className="flex flex-wrap gap-1">
                                            <span className="px-1 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                                              {food.rasa}
                                            </span>
                                            <span className="px-1 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                                              {food.guna}
                                            </span>
                                          </div>
                                        </motion.div>
                                      )) : (
                                        <div className="col-span-full text-center py-4 text-[#8D6E63]/60 text-sm">
                                          <span className="text-2xl mb-1 block">🍽️</span>
                                          <p>No foods for this meal</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )) : (
                          <div className="text-center text-[#8D6E63]/60 py-8">
                            <span className="text-4xl mb-2 block">🍽️</span>
                            <p>No meal plan generated yet</p>
                          </div>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Suggested Foods & Recipes Panel */}
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: isSuggestionsOpen ? 0 : 300 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white border-l-2 border-[#8BC34A]/20 shadow-lg w-80 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#8BC34A]/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#8D6E63]">Suggested Foods</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
                  className="p-2 rounded-lg text-[#8D6E63] hover:bg-[#8BC34A]/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Food Suggestions */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {filteredFoods.slice(0, 10).map((food, index) => (
                  <motion.div
                    key={food.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-r from-[#F5F3E7] to-white rounded-xl p-4 border border-[#8BC34A]/10 shadow-sm cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-[#8D6E63]">{food.foodItemName}</h4>
                      <span className="text-sm text-[#8D6E63]/70">{food.foodCategory}</span>
                    </div>
                    
                    <div className="text-sm text-[#8D6E63]/70 mb-3">
                      {food.energyKcal} cal per 100g
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        {food.rasa}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {food.guna}
                      </span>
                    </div>
                    
                    <p className="text-xs text-[#8D6E63]/60 mb-3">
                      {food.primaryDoshaEffect}
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (generatedPlan) {
                          // Show meal selection modal or add to first available meal
                          const mealTypes = ['breakfast', 'lunch', 'dinner', 'midMorningSnack', 'eveningSnack'];
                          const firstMeal = mealTypes[0];
                          addFoodToMeal(food, firstMeal);
                          alert(`Added ${food.foodItemName} to ${firstMeal}!`);
                        } else {
                          alert('Please generate a diet plan first!');
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#8BC34A] text-white text-sm rounded-lg hover:bg-[#8BC34A]/80 transition-colors"
                    >
                      Add to Meal
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Plan Review & Finalization Panel - Overlay */}
      <AnimatePresence>
        {showPlanReview && generatedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPlanReview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#8BC34A] to-[#D4AF37] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Diet Plan Review</h3>
                    <p className="text-white/80 mt-1">
                      {planDuration === 'daily' ? 'Daily' : 'Weekly'} Plan for {selectedPatient?.name}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPlanReview(false)}
                    className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Daily Nutrition Totals */}
                  <div className="bg-gradient-to-br from-[#F5F3E7] to-white rounded-xl p-6 border border-[#8BC34A]/10">
                    <h4 className="font-bold text-[#8D6E63] mb-4 text-lg">Daily Nutrition</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🔥</span>
                          <span className="text-[#8D6E63]/70">Calories:</span>
                        </div>
                        <span className="font-bold text-[#8D6E63] text-xl">{calculateTotalNutrition().calories}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">💪</span>
                          <span className="text-[#8D6E63]/70">Protein:</span>
                        </div>
                        <span className="font-bold text-[#8D6E63] text-xl">{calculateTotalNutrition().protein}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🌾</span>
                          <span className="text-[#8D6E63]/70">Carbs:</span>
                        </div>
                        <span className="font-bold text-[#8D6E63] text-xl">{calculateTotalNutrition().carbs}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🥑</span>
                          <span className="text-[#8D6E63]/70">Fat:</span>
                        </div>
                        <span className="font-bold text-[#8D6E63] text-xl">{calculateTotalNutrition().fat}g</span>
                      </div>
                    </div>
                  </div>

                  {/* Dosha Balance Meter */}
                  <div className="bg-gradient-to-br from-[#F5F3E7] to-white rounded-xl p-6 border border-[#8BC34A]/10">
                    <h4 className="font-bold text-[#8D6E63] mb-4 text-lg">Dosha Balance</h4>
                    <div className="space-y-4">
                      {generatedPlan && generatedPlan.doshaBalance && typeof generatedPlan.doshaBalance === 'object' ? 
                        Object.entries(generatedPlan.doshaBalance).map(([dosha, percentage]) => (
                        <div key={dosha} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-[#8D6E63]/70 capitalize font-medium">{dosha}</span>
                            <span className="font-bold text-[#8D6E63]">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-3 rounded-full ${
                                dosha === 'vata' ? 'bg-blue-500' :
                                dosha === 'pitta' ? 'bg-red-500' : 'bg-green-500'
                              }`}
                            />
                          </div>
                        </div>
                      )) : (
                        <div className="text-center text-[#8D6E63]/60 py-4">
                          No dosha balance data available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-gradient-to-br from-[#F5F3E7] to-white rounded-xl p-6 border border-[#8BC34A]/10">
                    <h4 className="font-bold text-[#8D6E63] mb-4 text-lg">Actions</h4>
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={savePlan}
                        className="w-full px-4 py-3 bg-[#8BC34A] text-white rounded-lg hover:bg-[#8BC34A]/80 transition-colors font-semibold"
                      >
                        Save Plan
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportPDF}
                        className="w-full px-4 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#D4AF37]/80 transition-colors font-semibold"
                      >
                        Export PDF
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-4 py-3 bg-white text-[#8D6E63] border-2 border-[#8BC34A]/30 rounded-lg hover:bg-[#8BC34A]/5 transition-colors font-semibold"
                      >
                        Update Existing
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Detailed Meal Plan */}
                <div className="bg-white rounded-xl border border-[#8BC34A]/10 p-6">
                  <h4 className="font-bold text-[#8D6E63] mb-6 text-xl">Detailed Meal Plan</h4>
                  <div className="space-y-6">
                    {planDuration === 'daily' ? (
                      // Daily Plan Details
                      generatedPlan && generatedPlan.meals ? Object.entries(generatedPlan.meals).map(([mealType, foods], index) => {
                        const foodsArray = Array.isArray(foods) ? foods : [];
                        
                        return (
                          <motion.div
                            key={mealType}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-[#8BC34A]/20 rounded-lg p-4"
                          >
                            <h5 className="font-semibold text-[#8D6E63] mb-3 text-lg capitalize">
                              {mealType.replace(/([A-Z])/g, ' $1').trim()}
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {foodsArray.length > 0 ? foodsArray.map((food) => (
                                <div key={food.id} className="bg-gradient-to-br from-[#F5F3E7] to-white rounded-lg p-4 border border-[#8BC34A]/10">
                                  <div className="flex items-start justify-between mb-2">
                                    <h6 className="font-semibold text-[#8D6E63]">{food.name}</h6>
                                    <span className="text-sm text-[#8D6E63]/70">{food.portion}g</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                    <div className="text-center p-2 bg-blue-50 rounded">
                                      <div className="text-lg mb-1">🔥</div>
                                      <div className="font-semibold text-blue-700">{food.calories}</div>
                                      <div className="text-blue-600">Cal</div>
                                    </div>
                                    <div className="text-center p-2 bg-green-50 rounded">
                                      <div className="text-lg mb-1">💪</div>
                                      <div className="font-semibold text-green-700">{food.protein}g</div>
                                      <div className="text-green-600">Protein</div>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                      {food.rasa}
                                    </span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                      {food.guna}
                                    </span>
                                  </div>
                                </div>
                              )) : (
                                <div className="col-span-full text-center py-8 text-[#8D6E63]/60">
                                  <span className="text-4xl mb-2 block">🍽️</span>
                                  <p>No foods generated for this meal</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      }) : (
                        <div className="text-center text-[#8D6E63]/60 py-8">
                          <span className="text-4xl mb-2 block">🍽️</span>
                          <p>No meal plan generated yet</p>
                        </div>
                      )
                    ) : (
                      // Weekly Plan Details
                      generatedPlan && generatedPlan.meals ? Object.entries(generatedPlan.meals).map(([day, dayMeals], dayIndex) => (
                        <motion.div
                          key={day}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: dayIndex * 0.1 }}
                          className="border border-[#8BC34A]/20 rounded-lg p-4"
                        >
                          <h5 className="font-semibold text-[#8D6E63] mb-4 text-lg capitalize">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </h5>
                          <div className="space-y-3">
                            {Object.entries(dayMeals).map(([mealType, foods], mealIndex) => {
                              const foodsArray = Array.isArray(foods) ? foods : [];
                              
                              return (
                                <div key={mealType} className="border border-[#8BC34A]/10 rounded-lg p-3">
                                  <h6 className="font-semibold text-[#8D6E63] mb-2 capitalize text-sm">
                                    {mealType.replace(/([A-Z])/g, ' $1').trim()}
                                  </h6>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {foodsArray.length > 0 ? foodsArray.map((food) => (
                            <div key={food.id} className="bg-gradient-to-br from-[#F5F3E7] to-white rounded-lg p-4 border border-[#8BC34A]/10">
                              <div className="flex items-start justify-between mb-2">
                                <h6 className="font-semibold text-[#8D6E63]">{food.name}</h6>
                                <span className="text-sm text-[#8D6E63]/70">{food.portion}g</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                <div className="text-center p-2 bg-blue-50 rounded">
                                  <div className="font-semibold text-blue-700">{food.calories}</div>
                                  <div className="text-blue-600">Cal</div>
                                </div>
                                <div className="text-center p-2 bg-green-50 rounded">
                                  <div className="font-semibold text-green-700">{food.protein}g</div>
                                  <div className="text-green-600">Protein</div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                  {food.rasa}
                                </span>
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                  {food.guna}
                                </span>
                              </div>
                                      </div>
                                    )) : (
                                      <div className="col-span-full text-center py-4 text-[#8D6E63]/60 text-sm">
                                        <span className="text-2xl mb-1 block">🍽️</span>
                                        <p>No foods for this meal</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )) : (
                        <div className="text-center text-[#8D6E63]/60 py-8">
                          <span className="text-4xl mb-2 block">🍽️</span>
                          <p>No meal plan generated yet</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
