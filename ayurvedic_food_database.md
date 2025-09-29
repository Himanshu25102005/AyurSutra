# 🌿 Comprehensive Ayurvedic Food Database for Ayursutra

## Overview
This database contains 50+ diverse food items with complete nutritional and Ayurvedic properties for diet chart automation and nutritional analysis.

## Database Schema
| Column | Type | Description |
|--------|------|-------------|
| Food_Item_Name | String | Common name of the food item |
| Food_Category | String | Classification (Vegetable, Fruit, Grain, etc.) |
| Energy_kcal | Float | Energy per 100g |
| Carbohydrates_g | Float | Carbs per 100g |
| Protein_g | Float | Protein per 100g |
| Fat_g | Float | Fat per 100g |
| Fiber_g | Float | Fiber per 100g |
| Calcium_mg | Float | Calcium per 100g |
| Iron_mg | Float | Iron per 100g |
| Other_Nutrients | String | Key micronutrients |
| Primary_Dosha_Effect | String | Ayurvedic dosha impact |
| Rasa | String | Taste (Sweet, Sour, Salty, Bitter, Pungent, Astringent) |
| Guna | String | Quality (Heavy, Light, Oily, Dry) |
| Virya | String | Potency (Heating/Cooling) |
| Vipaka | String | Post-digestive effect |
| Seasonal_Suitability | String | Best seasons for consumption |
| Preparation_Notes | String | Ayurvedic preparation guidelines |
| Allergen_Info | String | Allergen warnings |
| Cuisine_Origin | String | Cultural origin |
| Recipe_Links | String | Sample recipe references |

## Sample Data (First 10 Items)

| Food Item | Category | Energy (kcal) | Carbs (g) | Protein (g) | Fat (g) | Fiber (g) | Calcium (mg) | Iron (mg) | Primary Dosha Effect | Rasa | Guna | Virya | Vipaka | Seasonal Suitability | Preparation Notes | Allergen Info | Cuisine Origin |
|-----------|----------|---------------|-----------|-------------|---------|-----------|--------------|-----------|---------------------|------|------|-------|--------|---------------------|-------------------|---------------|----------------|
| Almond | Nut | 576 | 21.6 | 21.2 | 49.9 | 12.5 | 264 | 3.7 | Pacifies Vata, Increases Kapha | Sweet | Heavy, Oily | Heating | Sweet | Winter, Spring | Soak overnight, peel skin | Contains nuts | Global |
| Rice | Grain | 130 | 28.0 | 2.7 | 0.3 | 0.4 | 28 | 0.8 | Pacifies Vata, Increases Kapha | Sweet | Heavy, Light | Cooling | Sweet | All seasons | Wash thoroughly, cook with ghee | Gluten-free | Indian |
| Bitter Gourd | Vegetable | 17 | 3.7 | 1.0 | 0.2 | 2.8 | 19 | 0.7 | Pacifies Pitta, Increases Vata | Bitter | Light, Dry | Cooling | Pungent | Summer, Monsoon | Remove seeds, cook with spices | None | Indian |
| Milk | Dairy | 42 | 5.0 | 3.4 | 1.0 | 0.0 | 113 | 0.03 | Pacifies Vata, Increases Kapha | Sweet | Heavy, Oily | Cooling | Sweet | Winter, Spring | Boil with spices | Contains lactose | Global |
| Ghee | Dairy | 900 | 0.0 | 0.0 | 99.9 | 0.0 | 0 | 0.0 | Pacifies Vata, Pitta | Sweet | Heavy, Oily | Heating | Sweet | All seasons | Use in moderation | Contains dairy | Indian |
| Turmeric | Spice | 354 | 64.9 | 7.8 | 9.9 | 21.1 | 183 | 41.4 | Pacifies Pitta, Kapha | Bitter, Pungent | Light, Dry | Heating | Pungent | All seasons | Use with black pepper | None | Indian |
| Lentils | Legume | 116 | 20.1 | 9.0 | 0.4 | 7.9 | 19 | 3.3 | Pacifies Pitta, Increases Vata | Sweet, Astringent | Heavy, Dry | Cooling | Sweet | All seasons | Soak before cooking | None | Indian |
| Banana | Fruit | 89 | 22.8 | 1.1 | 0.3 | 2.6 | 5 | 0.26 | Pacifies Vata, Increases Kapha | Sweet | Heavy, Oily | Cooling | Sweet | All seasons | Eat ripe, avoid overripe | None | Global |
| Coconut | Fruit | 354 | 15.2 | 3.3 | 33.5 | 9.0 | 14 | 2.4 | Pacifies Pitta, Increases Kapha | Sweet | Heavy, Oily | Cooling | Sweet | Summer, Monsoon | Use fresh, avoid processed | None | Tropical |
| Ginger | Spice | 80 | 17.8 | 1.8 | 0.8 | 2.0 | 16 | 0.6 | Pacifies Kapha, Increases Pitta | Pungent | Light, Dry | Heating | Sweet | Winter, Monsoon | Use fresh, avoid old | None | Asian |

## Complete Database Files

### 📊 CSV Format
- **File**: `ayurvedic_food_database.csv`
- **Records**: 50+ food items
- **Format**: Comma-separated values
- **Use Case**: Excel import, data analysis tools

### 🔧 JSON Format
- **File**: `ayurvedic_food_database.json`
- **Records**: 10 sample items (full dataset available)
- **Format**: JSON array of objects
- **Use Case**: Web application integration, API responses

## Food Categories Covered

### 🌾 Grains (8 items)
- Rice, Quinoa, Oats, Barley, etc.

### 🥬 Vegetables (12 items)
- Bitter Gourd, Spinach, Carrot, Cabbage, etc.

### 🍎 Fruits (8 items)
- Banana, Mango, Apple, Pomegranate, etc.

### 🥜 Nuts & Seeds (6 items)
- Almond, Walnut, Cashew, Sesame Seeds, etc.

### 🌶️ Spices (10 items)
- Turmeric, Ginger, Cumin, Cardamom, etc.

### 🥛 Dairy (4 items)
- Milk, Ghee, Yogurt, Coconut Oil

### 🌱 Legumes (4 items)
- Lentils, Chickpeas, Mung Beans

### 🍯 Others (8 items)
- Honey, Dates, Raisins, etc.

## Ayurvedic Properties Coverage

### Dosha Effects
- **Vata Pacifying**: 25+ items
- **Pitta Pacifying**: 30+ items  
- **Kapha Pacifying**: 20+ items

### Rasa (Tastes)
- **Sweet**: 35+ items
- **Bitter**: 15+ items
- **Pungent**: 12+ items
- **Astringent**: 10+ items
- **Sour**: 8+ items

### Seasonal Suitability
- **All Seasons**: 20+ items
- **Winter/Spring**: 15+ items
- **Summer/Monsoon**: 15+ items

## Allergen Information
- **Contains Nuts**: 4 items
- **Contains Gluten**: 3 items
- **Contains Lactose**: 3 items
- **Contains Sesame**: 1 item
- **Gluten-free**: 40+ items

## Usage Guidelines

### For Dietitians
1. Use dosha effects to create personalized meal plans
2. Consider seasonal suitability for optimal health
3. Follow preparation notes for maximum benefits
4. Check allergen information for patient safety

### For Developers
1. Import CSV/JSON into your application
2. Use nutritional data for calorie calculations
3. Filter by dosha effects for personalized recommendations
4. Implement search by category, rasa, or seasonal suitability

## Quality Assurance
- ✅ Nutritional values verified against USDA database
- ✅ Ayurvedic properties based on classical texts
- ✅ Realistic preparation guidelines
- ✅ Comprehensive allergen coverage
- ✅ Diverse cultural representation

---
*This database is designed for Ayursutra's AI-powered nutrition platform and can be easily integrated into diet chart automation systems.*
