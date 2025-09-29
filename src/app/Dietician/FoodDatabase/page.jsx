"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardNav } from "../../../components/dietician";
import ayurvedicFoods from "../../../../ayurvedic_food_database.json";

const FoodDatabase = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    dosha: "",
    rasa: "",
    guna: "",
    virya: "",
    season: "",
    allergens: [],
    calories: { min: 0, max: 1000 },
    protein: { min: 0, max: 100 },
    carbs: { min: 0, max: 100 },
    fat: { min: 0, max: 100 }
  });

  const searchRef = useRef(null);

  // Filter foods based on search and filters
  const filteredFoods = ayurvedicFoods.filter(food => {
    const matchesSearch = searchQuery === "" || 
      food.foodItemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.foodCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.primaryDoshaEffect.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.recipeLinks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.preparationNotes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filters.category === "" || food.foodCategory === filters.category;
    const matchesDosha = filters.dosha === "" || food.primaryDoshaEffect.toLowerCase().includes(filters.dosha.toLowerCase());
    const matchesRasa = filters.rasa === "" || food.rasa.toLowerCase().includes(filters.rasa.toLowerCase());
    const matchesGuna = filters.guna === "" || food.guna.toLowerCase().includes(filters.guna.toLowerCase());
    const matchesVirya = filters.virya === "" || food.virya.toLowerCase().includes(filters.virya.toLowerCase());
    const matchesSeason = filters.season === "" || food.seasonalSuitability.toLowerCase().includes(filters.season.toLowerCase());
    
    const matchesCalories = food.energyKcal >= filters.calories.min && food.energyKcal <= filters.calories.max;
    const matchesProtein = food.proteinG >= filters.protein.min && food.proteinG <= filters.protein.max;
    const matchesCarbs = food.carbohydratesG >= filters.carbs.min && food.carbohydratesG <= filters.carbs.max;
    const matchesFat = food.fatG >= filters.fat.min && food.fatG <= filters.fat.max;

    return matchesSearch && matchesCategory && matchesDosha && matchesRasa && 
           matchesGuna && matchesVirya && matchesSeason && matchesCalories && 
           matchesProtein && matchesCarbs && matchesFat;
  });

  // Toggle favorite
  const toggleFavorite = (foodId) => {
    setFavorites(prev => 
      prev.includes(foodId) 
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    );
  };

  // Toggle selection for comparison
  const toggleSelection = (foodId) => {
    setSelectedFoods(prev => 
      prev.includes(foodId) 
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    );
  };

  // Get dosha color
  const getDoshaColor = (dosha) => {
    switch (dosha.toLowerCase()) {
      case 'vata': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pitta': return 'text-red-600 bg-red-50 border-red-200';
      case 'kapha': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get virya color
  const getViryaColor = (virya) => {
    switch (virya.toLowerCase()) {
      case 'heating': return 'text-red-600 bg-red-50 border-red-200';
      case 'cooling': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "",
      dosha: "",
      rasa: "",
      guna: "",
      virya: "",
      season: "",
      allergens: [],
      calories: { min: 0, max: 1000 },
      protein: { min: 0, max: 100 },
      carbs: { min: 0, max: 100 },
      fat: { min: 0, max: 100 }
    });
  };

  // Get unique values for filter options
  const categories = [...new Set(ayurvedicFoods.map(food => food.foodCategory))];
  const doshas = [...new Set(ayurvedicFoods.map(food => food.primaryDoshaEffect))];
  const rasas = [...new Set(ayurvedicFoods.map(food => food.rasa))];
  const gunas = [...new Set(ayurvedicFoods.map(food => food.guna))];
  const viryas = [...new Set(ayurvedicFoods.map(food => food.virya))];
  const seasons = [...new Set(ayurvedicFoods.map(food => food.seasonalSuitability))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3E7] to-white">
      <DashboardNav />
      
      <div className="pt-20 min-h-screen flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: isSidebarOpen ? 0 : -300 }}
          transition={{ duration: 0.3 }}
          className={`fixed lg:relative z-30 w-80 h-full bg-white/95 backdrop-blur-sm border-r border-[#A4C639]/20 flex-shrink-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#A4C639]/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A4C639] to-[#F4A261] rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">🍽️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#8D6E63]">Food Database</h1>
                <p className="text-sm text-[#8D6E63]/70">Ayurvedic Nutrition</p>
              </div>
            </div>
            
            {/* Unified Search Bar */}
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search foods, recipes, or ask questions..."
                className="w-full px-2 py-3 bg-white/80 backdrop-blur-sm border border-[#A4C639]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4C639]/50 text-[#8D6E63] text-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4  h-4 text-[#8D6E63]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 space-y-6 overflow-y-auto h-full">
            <div>
              <h3 className="text-lg font-semibold text-[#8D6E63] mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#8D6E63] mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-[#A4C639]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A4C639]/50 text-[#8D6E63] text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Dosha Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#8D6E63] mb-2">Dosha Effect</label>
                <select
                  value={filters.dosha}
                  onChange={(e) => setFilters({...filters, dosha: e.target.value})}
                  className="w-full px-3 py-2 border border-[#A4C639]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A4C639]/50 text-[#8D6E63] text-sm"
                >
                  <option value="">All Doshas</option>
                  <option value="vata">Vata</option>
                  <option value="pitta">Pitta</option>
                  <option value="kapha">Kapha</option>
                </select>
              </div>

              {/* Rasa Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#8D6E63] mb-2">Rasa (Taste)</label>
                <select
                  value={filters.rasa}
                  onChange={(e) => setFilters({...filters, rasa: e.target.value})}
                  className="w-full px-3 py-2 border border-[#A4C639]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A4C639]/50 text-[#8D6E63] text-sm"
                >
                  <option value="">All Tastes</option>
                  {rasas.map(rasa => (
                    <option key={rasa} value={rasa.toLowerCase()}>{rasa}</option>
                  ))}
                </select>
              </div>

              {/* Season Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#8D6E63] mb-2">Season</label>
                <select
                  value={filters.season}
                  onChange={(e) => setFilters({...filters, season: e.target.value})}
                  className="w-full px-3 py-2 border border-[#A4C639]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A4C639]/50 text-[#8D6E63] text-sm"
                >
                  <option value="">All Seasons</option>
                  <option value="summer">Summer</option>
                  <option value="winter">Winter</option>
                  <option value="monsoon">Monsoon</option>
                  <option value="spring">Spring</option>
                </select>
              </div>

              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-[#A4C639]/10 hover:bg-[#A4C639]/20 text-[#8D6E63] rounded-lg transition-colors text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-[#A4C639]/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 rounded-lg bg-[#A4C639]/10 hover:bg-[#A4C639]/20 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#8D6E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                
                <div>
                  <h2 className="text-lg font-semibold text-[#8D6E63]">
                    {filteredFoods.length} Foods Found
                  </h2>
                  <p className="text-sm text-[#8D6E63]/70">
                    {searchQuery ? `Search results for "${searchQuery}"` : "Browse our comprehensive food database"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-2 rounded-lg bg-[#A4C639]/10 hover:bg-[#A4C639]/20 transition-colors"
                >
                  {viewMode === 'grid' ? (
                    <svg className="w-5 h-5 text-[#8D6E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[#8D6E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="p-2 rounded-lg bg-[#A4C639]/10 hover:bg-[#A4C639]/20 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#8D6E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Food Grid/List */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {filteredFoods.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-[#A4C639]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-[#A4C639]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#8D6E63] mb-2">No foods found</h3>
                  <p className="text-[#8D6E63]/70">Try adjusting your search or filters</p>
                </motion.div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
                }>
                  {filteredFoods.map((food, index) => (
                    <motion.div
                      key={food.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-[#A4C639]/20 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        viewMode === 'list' ? 'flex items-center space-x-4 p-4' : 'p-6'
                      }`}
                    >
                      {viewMode === 'grid' ? (
                        /* Grid View */
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#A4C639] to-[#F4A261] rounded-xl flex items-center justify-center">
                                <span className="text-white text-lg">🌿</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-[#8D6E63] text-lg">{food.foodItemName}</h3>
                                <p className="text-sm text-[#8D6E63]/70">{food.foodCategory}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleFavorite(food.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  favorites.includes(food.id) 
                                    ? 'bg-red-100 text-red-600' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                                }`}
                              >
                                <svg className="w-4 h-4" fill={favorites.includes(food.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => toggleSelection(food.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  selectedFoods.includes(food.id) 
                                    ? 'bg-[#A4C639] text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-[#A4C639] hover:text-white'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDoshaColor(food.primaryDoshaEffect.split(' ')[0])}`}>
                                {food.primaryDoshaEffect}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getViryaColor(food.virya)}`}>
                                {food.virya}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                                {food.rasa}
                              </span>
                            </div>

                            {/* Nutritional Info */}
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#A4C639]/10">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-[#8D6E63]">{food.energyKcal}</div>
                                <div className="text-xs text-[#8D6E63]/70">Calories</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-[#8D6E63]">{food.proteinG}g</div>
                                <div className="text-xs text-[#8D6E63]/70">Protein</div>
                              </div>
                            </div>

                            {/* Recipe Link */}
                            {food.recipeLinks && (
                              <div className="mt-3 pt-3 border-t border-[#A4C639]/10">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-[#8D6E63]/70">Recipe:</span>
                                  <a 
                                    href={food.recipeLinks} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-[#A4C639] hover:text-[#8D6E63] font-medium"
                                  >
                                    View Recipe →
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        /* List View */
                        <>
                          <div className="w-12 h-12 bg-gradient-to-br from-[#A4C639] to-[#F4A261] rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-lg">🌿</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-bold text-[#8D6E63] text-lg">{food.foodItemName}</h3>
                                <p className="text-sm text-[#8D6E63]/70">{food.foodCategory}</p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-[#8D6E63]">{food.energyKcal}</div>
                                  <div className="text-xs text-[#8D6E63]/70">Cal</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-[#8D6E63]">{food.proteinG}g</div>
                                  <div className="text-xs text-[#8D6E63]/70">Protein</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => toggleFavorite(food.id)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      favorites.includes(food.id) 
                                        ? 'bg-red-100 text-red-600' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill={favorites.includes(food.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => toggleSelection(food.id)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      selectedFoods.includes(food.id) 
                                        ? 'bg-[#A4C639] text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-[#A4C639] hover:text-white'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDoshaColor(food.primaryDoshaEffect.split(' ')[0])}`}>
                                {food.primaryDoshaEffect}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getViryaColor(food.virya)}`}>
                                {food.virya}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                                {food.rasa}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Food Detail Modal */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFood(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#A4C639] to-[#F4A261] rounded-xl flex items-center justify-center">
                      <span className="text-white text-2xl">🌿</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#8D6E63]">{selectedFood.foodItemName}</h2>
                      <p className="text-[#8D6E63]/70">{selectedFood.foodCategory}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFood(null)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-[#F5F3E7] rounded-xl border border-[#A4C639]/20">
                      <h4 className="font-bold text-[#8D6E63] mb-2">Nutritional Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#8D6E63]/70">Calories:</span>
                          <span className="font-medium text-[#8D6E63]">{selectedFood.energyKcal} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8D6E63]/70">Protein:</span>
                          <span className="font-medium text-[#8D6E63]">{selectedFood.proteinG}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8D6E63]/70">Carbs:</span>
                          <span className="font-medium text-[#8D6E63]">{selectedFood.carbohydratesG}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8D6E63]/70">Fat:</span>
                          <span className="font-medium text-[#8D6E63]">{selectedFood.fatG}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8D6E63]/70">Fiber:</span>
                          <span className="font-medium text-[#8D6E63]">{selectedFood.fiberG}g</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#F5F3E7] rounded-xl border border-[#A4C639]/20">
                      <h4 className="font-bold text-[#8D6E63] mb-2">Ayurvedic Properties</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#8D6E63]/70">Dosha Effect:</span>
                          <span className="font-medium text-[#8D6E63]">{selectedFood.primaryDoshaEffect}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8D6E63]/70">Rasa:</span>
                          <span className="font-medium text-[#8D6E63]">{selectedFood.rasa}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8D6E63]/70">Guna:</span>
                          <span className="font-medium text-[#8D6E63]">{selectedFood.guna}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8D6E63]/70">Virya:</span>
                          <span className="font-medium text-[#8D6E63]">{selectedFood.virya}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8D6E63]/70">Vipaka:</span>
                          <span className="font-medium text-[#8D6E63]">{selectedFood.vipaka}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-[#F5F3E7] rounded-xl border border-[#A4C639]/20">
                      <h4 className="font-bold text-[#8D6E63] mb-2">Preparation Notes</h4>
                      <p className="text-[#8D6E63]/70">{selectedFood.preparationNotes}</p>
                    </div>

                    <div className="p-4 bg-[#F5F3E7] rounded-xl border border-[#A4C639]/20">
                      <h4 className="font-bold text-[#8D6E63] mb-2">Seasonal Suitability</h4>
                      <p className="text-[#8D6E63]/70">{selectedFood.seasonalSuitability}</p>
                    </div>

                    {/* Recipe Link */}
                    {selectedFood.recipeLinks && (
                      <div className="p-4 bg-gradient-to-r from-[#A4C639]/10 to-[#F4A261]/10 rounded-xl border border-[#A4C639]/20">
                        <h4 className="font-bold text-[#8D6E63] mb-2">Recipe</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-[#8D6E63]/70">Try this recipe:</span>
                          <a 
                            href={selectedFood.recipeLinks} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gradient-to-r from-[#A4C639] to-[#F4A261] text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
                          >
                            View Recipe →
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleFavorite(selectedFood.id)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          favorites.includes(selectedFood.id)
                            ? 'bg-red-100 text-red-600 border border-red-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-red-100 hover:text-red-600'
                        }`}
                      >
                        {favorites.includes(selectedFood.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedFood(null)}
                        className="flex-1 px-4 py-2 bg-[#A4C639] text-white rounded-lg font-medium hover:bg-[#8D6E63] transition-colors"
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodDatabase;