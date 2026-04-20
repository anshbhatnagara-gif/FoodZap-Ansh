/**
 * Beverages Menu
 * Hot drinks, cold drinks, juices, shakes, mocktails
 */

const BeveragesMenu = {
  restaurant: {
    name: "Refresh & Sip",
    cuisine: ["Beverages", "Drinks"],
    rating: 4.5,
    deliveryTime: "15-25 min",
    priceForTwo: 200,
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
    isVeg: true,
    offers: ["Free Delivery above ₹150"]
  },

  categories: [
    {
      name: "Hot Beverages",
      items: [
        {
          id: "bv_h1",
          name: "Masala Chai",
          description: "Indian spiced milk tea",
          price: 40,
          isVeg: true,
          isBestseller: true,
          image: "🍵",
          rating: 4.7
        },
        {
          id: "bv_h2",
          name: "Filter Coffee",
          description: "South Indian style coffee",
          price: 50,
          isVeg: true,
          isBestseller: true,
          image: "☕",
          rating: 4.8
        },
        {
          id: "bv_h3",
          name: "Green Tea",
          description: "Healthy antioxidant rich tea",
          price: 60,
          isVeg: true,
          image: "🍵",
          rating: 4.4
        },
        {
          id: "bv_h4",
          name: "Hot Chocolate",
          description: "Rich creamy chocolate drink",
          price: 120,
          isVeg: true,
          image: "🍫",
          rating: 4.6
        },
        {
          id: "bv_h5",
          name: "Masala Milk",
          description: "Warm milk with nuts and saffron",
          price: 80,
          isVeg: true,
          image: "🥛",
          rating: 4.5
        },
        {
          id: "bv_h6",
          name: "Herbal Tea",
          description: "Chamomile/peppermint tea",
          price: 70,
          isVeg: true,
          image: "🌿",
          rating: 4.3
        },
        {
          id: "bv_h7",
          name: "Cappuccino",
          description: "Espresso with steamed milk foam",
          price: 140,
          isVeg: true,
          image: "☕",
          rating: 4.6
        },
        {
          id: "bv_h8",
          name: "Latte",
          description: "Creamy coffee with milk",
          price: 130,
          isVeg: true,
          image: "☕",
          rating: 4.5
        },
        {
          id: "bv_h9",
          name: "Americano",
          description: "Black coffee",
          price: 100,
          isVeg: true,
          image: "☕",
          rating: 4.4
        },
        {
          id: "bv_h10",
          name: "Turmeric Latte",
          description: "Golden milk with turmeric",
          price: 110,
          isVeg: true,
          image: "🟡",
          rating: 4.5
        }
      ]
    },

    {
      name: "Cold Coffee",
      items: [
        {
          id: "bv_cc1",
          name: "Iced Latte",
          description: "Cold coffee with milk",
          price: 140,
          isVeg: true,
          isBestseller: true,
          image: "🧊",
          rating: 4.6
        },
        {
          id: "bv_cc2",
          name: "Frappe",
          description: "Blended iced coffee",
          price: 160,
          isVeg: true,
          image: "🥤",
          rating: 4.7
        },
        {
          id: "bv_cc3",
          name: "Cold Brew",
          description: "Slow steeped cold coffee",
          price: 170,
          isVeg: true,
          image: "🧊",
          rating: 4.5
        },
        {
          id: "bv_cc4",
          name: "Mocha Frappe",
          description: "Chocolate coffee blend",
          price: 180,
          isVeg: true,
          image: "🍫",
          rating: 4.7
        },
        {
          id: "bv_cc5",
          name: "Caramel Frappe",
          description: "Caramel flavored cold coffee",
          price: 180,
          isVeg: true,
          image: "🍮",
          rating: 4.6
        }
      ]
    },

    {
      name: "Milkshakes",
      items: [
        {
          id: "bv_ms1",
          name: "Chocolate Shake",
          description: "Rich chocolate milkshake",
          price: 150,
          isVeg: true,
          isBestseller: true,
          image: "🍫",
          rating: 4.8
        },
        {
          id: "bv_ms2",
          name: "Strawberry Shake",
          description: "Fresh strawberry milkshake",
          price: 140,
          isVeg: true,
          image: "🍓",
          rating: 4.7
        },
        {
          id: "bv_ms3",
          name: "Vanilla Shake",
          description: "Classic vanilla milkshake",
          price: 130,
          isVeg: true,
          image: "🍦",
          rating: 4.6
        },
        {
          id: "bv_ms4",
          name: "Oreo Shake",
          description: "Cookies and cream shake",
          price: 170,
          isVeg: true,
          image: "🍪",
          rating: 4.8
        },
        {
          id: "bv_ms5",
          name: "Kit Kat Shake",
          description: "Chocolate wafer shake",
          price: 180,
          isVeg: true,
          image: "🍫",
          rating: 4.7
        },
        {
          id: "bv_ms6",
          name: "Banana Shake",
          description: "Fresh banana milkshake",
          price: 140,
          isVeg: true,
          image: "🍌",
          rating: 4.5
        },
        {
          id: "bv_ms7",
          name: "Mango Shake",
          description: "Seasonal mango milkshake",
          price: 160,
          isVeg: true,
          image: "🥭",
          rating: 4.8,
          tags: ["Seasonal"]
        },
        {
          id: "bv_ms8",
          name: "Dry Fruit Shake",
          description: "Milkshake with nuts and saffron",
          price: 200,
          isVeg: true,
          image: "🥜",
          rating: 4.7
        },
        {
          id: "bv_ms9",
          name: "Cold Coffee Shake",
          description: "Coffee and ice cream shake",
          price: 160,
          isVeg: true,
          image: "☕",
          rating: 4.6
        },
        {
          id: "bv_ms10",
          name: "Peanut Butter Shake",
          description: "Peanut butter and banana shake",
          price: 180,
          isVeg: true,
          image: "🥜",
          rating: 4.6
        }
      ]
    },

    {
      name: "Fresh Juices",
      items: [
        {
          id: "bv_j1",
          name: "Orange Juice",
          description: "Freshly squeezed orange juice",
          price: 120,
          isVeg: true,
          isBestseller: true,
          image: "🍊",
          rating: 4.7
        },
        {
          id: "bv_j2",
          name: "Mosambi Juice",
          description: "Sweet lime juice",
          price: 100,
          isVeg: true,
          image: "🍋",
          rating: 4.6
        },
        {
          id: "bv_j3",
          name: "Watermelon Juice",
          description: "Refreshing watermelon juice",
          price: 90,
          isVeg: true,
          image: "🍉",
          rating: 4.5
        },
        {
          id: "bv_j4",
          name: "Pomegranate Juice",
          description: "Fresh anar juice",
          price: 140,
          isVeg: true,
          image: "🟣",
          rating: 4.8
        },
        {
          id: "bv_j5",
          name: "Carrot Juice",
          description: "Fresh carrot juice with ginger",
          price: 110,
          isVeg: true,
          image: "🥕",
          rating: 4.4
        },
        {
          id: "bv_j6",
          name: "Mixed Fruit Juice",
          description: "Blend of seasonal fruits",
          price: 130,
          isVeg: true,
          image: "🥤",
          rating: 4.6
        },
        {
          id: "bv_j7",
          name: "Pineapple Juice",
          description: "Fresh pineapple juice",
          price: 110,
          isVeg: true,
          image: "🍍",
          rating: 4.5
        },
        {
          id: "bv_j8",
          name: "ABC Juice",
          description: "Apple Beetroot Carrot blend",
          price: 150,
          isVeg: true,
          image: "🧃",
          rating: 4.7
        }
      ]
    },

    {
      name: "Mocktails",
      items: [
        {
          id: "bv_m1",
          name: "Virgin Mojito",
          description: "Mint lime soda mocktail",
          price: 140,
          isVeg: true,
          isBestseller: true,
          image: "🍃",
          rating: 4.7
        },
        {
          id: "bv_m2",
          name: "Blue Lagoon",
          description: "Blue curacao syrup with lemon",
          price: 150,
          isVeg: true,
          image: "🔵",
          rating: 4.6
        },
        {
          id: "bv_m3",
          name: "Shirley Temple",
          description: "Grenadine with ginger ale",
          price: 140,
          isVeg: true,
          image: "🍒",
          rating: 4.5
        },
        {
          id: "bv_m4",
          name: "Pina Colada",
          description: "Pineapple coconut mocktail",
          price: 160,
          isVeg: true,
          image: "🥥",
          rating: 4.7
        },
        {
          id: "bv_m5",
          name: "Fruit Punch",
          description: "Mixed fruit mocktail",
          price: 130,
          isVeg: true,
          image: "🍹",
          rating: 4.5
        },
        {
          id: "bv_m6",
          name: "Green Apple Mojito",
          description: "Apple flavored mint mocktail",
          price: 150,
          isVeg: true,
          image: "🍏",
          rating: 4.6
        },
        {
          id: "bv_m7",
          name: "Strawberry Daiquiri",
          description: "Frozen strawberry mocktail",
          price: 160,
          isVeg: true,
          image: "🍓",
          rating: 4.6
        },
        {
          id: "bv_m8",
          name: "Cranberry Cooler",
          description: "Tangy cranberry mocktail",
          price: 140,
          isVeg: true,
          image: "🫐",
          rating: 4.5
        }
      ]
    },

    {
      name: "Soda & Coolers",
      items: [
        {
          id: "bv_s1",
          name: "Fresh Lime Soda",
          description: "Sweet or salted lime soda",
          price: 70,
          isVeg: true,
          isBestseller: true,
          image: "🍋",
          rating: 4.6,
          variants: [
            { name: "Sweet", price: 70 },
            { name: "Salted", price: 70 },
            { name: "Masala", price: 80 }
          ]
        },
        {
          id: "bv_s2",
          name: "Jaljeera",
          description: "Cumin spiced tangy drink",
          price: 60,
          isVeg: true,
          image: "🥤",
          rating: 4.5
        },
        {
          id: "bv_s3",
          name: "Nimbu Pani",
          description: "Fresh lemonade",
          price: 50,
          isVeg: true,
          image: "🍋",
          rating: 4.4
        },
        {
          id: "bv_s4",
          name: "Buttermilk (Chaas)",
          description: "Spiced yogurt drink",
          price: 50,
          isVeg: true,
          image: "🥛",
          rating: 4.5
        },
        {
          id: "bv_s5",
          name: "Coconut Water",
          description: "Fresh tender coconut",
          price: 80,
          isVeg: true,
          image: "🥥",
          rating: 4.8
        },
        {
          id: "bv_s6",
          name: "Aam Panna",
          description: "Raw mango cooler",
          price: 70,
          isVeg: true,
          image: "🥭",
          rating: 4.6,
          tags: ["Seasonal"]
        },
        {
          id: "bv_s7",
          name: "Kokum Sherbet",
          description: "Cooling kokum drink",
          price: 80,
          isVeg: true,
          image: "🟣",
          rating: 4.5
        },
        {
          id: "bv_s8",
          name: "Rose Milk",
          description: "Milk with rose syrup",
          price: 70,
          isVeg: true,
          image: "🌹",
          rating: 4.4
        }
      ]
    },

    {
      name: "Smoothies",
      items: [
        {
          id: "bv_sm1",
          name: "Berry Blast",
          description: "Mixed berry smoothie",
          price: 180,
          isVeg: true,
          image: "🫐",
          rating: 4.7
        },
        {
          id: "bv_sm2",
          name: "Mango Smoothie",
          description: "Tropical mango smoothie",
          price: 170,
          isVeg: true,
          image: "🥭",
          rating: 4.8
        },
        {
          id: "bv_sm3",
          name: "Green Detox",
          description: "Spinach kale apple smoothie",
          price: 190,
          isVeg: true,
          image: "🥬",
          rating: 4.5
        },
        {
          id: "bv_sm4",
          name: "Chocolate Banana",
          description: "Chocolate banana protein smoothie",
          price: 180,
          isVeg: true,
          image: "🍌",
          rating: 4.6
        },
        {
          id: "bv_sm5",
          name: "Peanut Butter Banana",
          description: "Protein rich smoothie",
          price: 200,
          isVeg: true,
          image: "🥜",
          rating: 4.7
        }
      ]
    },

    {
      name: "Energy Drinks & Others",
      items: [
        {
          id: "bv_e1",
          name: "Energy Drink",
          description: "Red Bull or similar",
          price: 130,
          isVeg: true,
          image: "⚡",
          rating: 4.4
        },
        {
          id: "bv_e2",
          name: "Electrolyte Drink",
          description: "Sports drink",
          price: 80,
          isVeg: true,
          image: "💧",
          rating: 4.3
        },
        {
          id: "bv_e3",
          name: "Flavored Milk",
          description: "Chocolate/strawberry milk",
          price: 60,
          isVeg: true,
          image: "🥛",
          rating: 4.5
        },
        {
          id: "bv_e4",
          name: "Iced Tea",
          description: "Lemon iced tea",
          price: 90,
          isVeg: true,
          image: "🧊",
          rating: 4.5
        },
        {
          id: "bv_e5",
          name: "Kombucha",
          description: "Fermented probiotic tea",
          price: 180,
          isVeg: true,
          image: "🍵",
          rating: 4.6
        },
        {
          id: "bv_e6",
          name: "Mineral Water",
          description: "500ml bottled water",
          price: 30,
          isVeg: true,
          image: "💧",
          rating: 4.2
        }
      ]
    },

    {
      name: "Combos",
      items: [
        {
          id: "bv_cb1",
          name: "Coffee Combo",
          description: "Cappuccino + Cookie",
          price: 180,
          isVeg: true,
          image: "☕",
          rating: 4.6
        },
        {
          id: "bv_cb2",
          name: "Shake Combo",
          description: "Any Milkshake + French Fries",
          price: 220,
          isVeg: true,
          image: "🥤",
          rating: 4.7
        },
        {
          id: "bv_cb3",
          name: "Juice Pack",
          description: "Any 2 Fresh Juices",
          price: 200,
          isVeg: true,
          image: "🧃",
          rating: 4.6
        },
        {
          id: "bv_cb4",
          name: "Party Pack",
          description: "4 Mocktails + 4 Snacks",
          price: 699,
          isVeg: true,
          image: "🎉",
          rating: 4.8
        }
      ]
    }
  ],

  customization: {
    sugarLevels: ["No Sugar", "Less Sugar", "Regular", "Extra Sweet"],
    milkOptions: ["Dairy", "Almond", "Oat", "Soy"],
    iceLevels: ["No Ice", "Less Ice", "Regular", "Extra Ice"],
    temperature: ["Hot", "Warm", "Iced", "Blended"]
  },

  sizes: [
    { name: "Small", priceMultiplier: 0.8 },
    { name: "Regular", priceMultiplier: 1.0 },
    { name: "Large", priceMultiplier: 1.3 }
  ],

  getItemById(id) {
    for (const category of this.categories) {
      const item = category.items.find(i => i.id === id);
      if (item) return item;
    }
    return null;
  },

  getItemsByCategory(categoryName) {
    const category = this.categories.find(c => c.name === categoryName);
    return category ? category.items : [];
  },

  getAllItems() {
    return this.categories.flatMap(c => c.items);
  },

  getBestsellers() {
    return this.getAllItems().filter(i => i.isBestseller);
  },

  searchItems(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllItems().filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );
  },

  getHotDrinks() {
    return this.getItemsByCategory("Hot Beverages");
  },

  getColdDrinks() {
    return [
      ...this.getItemsByCategory("Cold Coffee"),
      ...this.getItemsByCategory("Milkshakes"),
      ...this.getItemsByCategory("Fresh Juices"),
      ...this.getItemsByCategory("Mocktails"),
      ...this.getItemsByCategory("Soda & Coolers"),
      ...this.getItemsByCategory("Smoothies")
    ];
  }
};

if (typeof window !== 'undefined') {
  window.BeveragesMenu = BeveragesMenu;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BeveragesMenu;
}
