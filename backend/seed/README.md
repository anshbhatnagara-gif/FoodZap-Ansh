# FoodZap Database Seeder

## 🌱 Overview

This seeder populates your FoodZap database with **1000+ food items** across **30+ restaurants** covering all major cuisines.

## 📊 What's Included

### Indian Cuisines
| Region | Cuisines | Items |
|--------|----------|-------|
| North | Punjabi, Mughlai, Kashmiri, Rajasthani | 300+ |
| South | Tamil, Kerala, Andhra, Karnataka | 200+ |
| East | Bengali, Odia, Assamese | 100+ |
| West | Gujarati, Maharashtrian, Goan | 100+ |

### International Cuisines
- 🇨🇳 Chinese (150+ items)
- 🇯🇵 Japanese - Sushi, Ramen, Tempura (100+ items)
- 🇰🇷 Korean - Kimchi, Bibimbap, BBQ (50+ items)
- 🇹🇭 Thai - Curries, Noodles, Soups (50+ items)
- 🇮🇹 Italian - Pasta, Pizza (50+ items)
- 🇲🇽 Mexican - Tacos, Burritos (30+ items)

### Fast Food
- 🍔 Burgers (50+ varieties)
- 🍕 Pizza (30+ varieties)
- 🌯 Rolls & Wraps (30+ varieties)
- 🥟 Momos (20+ varieties)
- 🍜 Noodles (50+ varieties)

### Categories
- Starters & Kebabs (200+ items)
- Main Course Curries (300+ items)
- Breads (50+ varieties)
- Rice & Biryani (100+ varieties)
- South Indian Breakfast (50+ items)
- Chaat & Street Food (30+ items)
- Beverages (200+ items)
- Desserts (300+ items)
- Grocery (150+ items)

## 🚀 How to Run

### Prerequisites
```bash
# Make sure MongoDB is running
# Make sure your backend dependencies are installed
cd backend
npm install
```

### Seed All Data
```bash
# Run the main seeder
node seed/index.js
```

### Seed Only Main Menu (Indian + Fast Food)
```bash
node seed/menuData.js
```

### Seed Only Extended Menu (International + Grocery)
```bash
node seed/extendedMenu.js
```

### Using npm Script (add to package.json)
```json
{
  "scripts": {
    "seed": "node seed/index.js",
    "seed:main": "node seed/menuData.js",
    "seed:extended": "node seed/extendedMenu.js"
  }
}
```

Then run:
```bash
npm run seed
```

## 📁 File Structure

```
seed/
├── index.js           # Main entry point - seeds everything
├── menuData.js        # Indian cuisines + Fast Food + Main items
├── extendedMenu.js    # International + Grocery items
└── README.md          # This file
```

## 🏪 Restaurants Created

### Indian Restaurants (20+)
1. **Punjabi Dhaba** - Punjabi food, Pure Veg
2. **Mughlai Zaika** - Mughlai, Non-veg
3. **Delhi Chaat House** - Street food
4. **Kashmir Food Valley** - Kashmiri Wazwan
5. **Rajasthani Thali** - Rajasthani pure veg
6. **Saravana Bhavan** - South Indian veg
7. **Kerala Kitchen** - Kerala seafood
8. **Andhra Spice** - Andhra spicy food
9. **Mysore Cafe** - Karnataka specialties
10. **Chettinad Palace** - Chettinad non-veg
11. **Bengali Kitchen** - Bengali fish & sweets
12. **Odia Rasoi** - Odia cuisine
13. **Assam Delights** - Assamese food
14. **Gujarat Thali** - Gujarati thali
15. **Mumbai Local** - Mumbai street food
16. **Goan Fiesta** - Goan seafood
17. **Biryani House** - Hyderabadi biryani
18. **Lucknowi Biryani** - Awadhi biryani
19. **Kebab Corner** - Tandoori & Kebabs
20. **Chai Point** - Beverages & snacks
21. **Sweet Tooth** - Desserts

### Fast Food (5+)
- Burger King Style
- Pizza Hut Style
- Roll Point
- Momos Corner
- Wok N Roll

### International (6+)
- Dragon Wok (Chinese/Thai)
- Sakura Sushi (Japanese)
- Thai Spice
- Pasta La Vista (Italian)
- Taco Bell Style (Mexican)
- Tokyo Sushi Bar (Japanese)
- Seoul Kitchen (Korean)
- Bangkok Spice (Thai)

### Grocery
- **Instamart Grocery** - Rice, Dal, Spices, Oils, etc.

## 🔄 Reset Database

To re-seed (clears existing and re-creates):

```javascript
// In MongoDB shell or Compass
db.restaurants.deleteMany({})
db.menuitems.deleteMany({})
```

Then run the seeder again:
```bash
node seed/index.js
```

## 📈 Sample Data Stats

```
Total Restaurants: 30+
Total Menu Items: 1000+
Total Categories: 15+
Cuisines Covered: 25+
Average Items per Restaurant: 30-50
```

## 🎯 Food Type Distribution

- 🟢 Vegetarian: ~60% (600+ items)
- 🔴 Non-Vegetarian: ~40% (400+ items)

## 💰 Price Range

- Budget: ₹30-100 (Street food, Snacks)
- Mid-range: ₹100-300 (Regular items)
- Premium: ₹300-600 (Specialty dishes)

## 📝 Notes

- All items include descriptions
- Prices are in INR (Indian Rupees)
- Images use placeholder URLs (replace with actual CDN URLs)
- Coordinates are randomized around Mumbai for demo
- Each restaurant has unique cuisine and categories
- Items have realistic preparation times and calorie counts
- Grocery items include stock quantities

## 🐛 Troubleshooting

### Connection Error
```bash
# Make sure MongoDB is running
mongod --dbpath /path/to/data
```

### Already Seeded
The seeder checks for existing data and skips if found. To re-seed:
1. Clear the collections manually
2. Run the seeder again

### Partial Seed
If seeding stops midway, run it again - it will skip already created items.

## 🔗 Related Files

- `../models/restaurant.model.js` - Restaurant schema
- `../models/menu.model.js` - Menu item schema
- `../models/user.model.js` - User schema

## 📞 Support

For issues or questions about the seeder, check:
1. MongoDB connection
2. Model imports
3. Disk space availability

---

**Happy Seeding! 🌱🍽️**
