/**
 * North Indian Menu
 * Curries, breads, tandoori items, rice dishes
 */

const NorthIndianMenu = {
  restaurant: {
    name: "Punjabi Dhaba",
    cuisine: ["North Indian", "Punjabi"],
    rating: 4.5,
    deliveryTime: "30-45 min",
    priceForTwo: 600,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    isVeg: false,
    offers: ["20% OFF up to ₹100", "Free Delivery"]
  },

  categories: [
    {
      name: "Starters",
      items: [
        {
          id: "ni_s1",
          name: "Paneer Tikka",
          description: "Marinated cottage cheese grilled to perfection",
          price: 280,
          isVeg: true,
          isBestseller: true,
          image: "🧀",
          rating: 4.6,
          variants: [
            { name: "Half", price: 180 },
            { name: "Full", price: 280 }
          ]
        },
        {
          id: "ni_s2",
          name: "Chicken Tikka",
          description: "Boneless chicken marinated in yogurt and spices",
          price: 320,
          isVeg: false,
          isBestseller: true,
          image: "🍗",
          rating: 4.7
        },
        {
          id: "ni_s3",
          name: "Tandoori Chicken",
          description: "Whole chicken marinated in tandoori masala",
          price: 450,
          isVeg: false,
          image: "🍖",
          rating: 4.5,
          variants: [
            { name: "Half", price: 280 },
            { name: "Full", price: 450 }
          ]
        },
        {
          id: "ni_s4",
          name: "Hara Bhara Kebab",
          description: "Spinach and potato patties with spices",
          price: 220,
          isVeg: true,
          image: "🥬",
          rating: 4.3
        },
        {
          id: "ni_s5",
          name: "Seekh Kebab",
          description: "Minced lamb kebabs cooked in tandoor",
          price: 340,
          isVeg: false,
          image: "🍢",
          rating: 4.6
        },
        {
          id: "ni_s6",
          name: "Aloo Tikki",
          description: "Crispy potato patties with chutney",
          price: 140,
          isVeg: true,
          image: "🥔",
          rating: 4.2
        },
        {
          id: "ni_s7",
          name: "Chilli Paneer",
          description: "Paneer tossed with capsicum and chilli sauce",
          price: 290,
          isVeg: true,
          image: "🌶️",
          rating: 4.4,
          tags: ["Spicy"]
        }
      ]
    },

    {
      name: "Main Course - Vegetarian",
      items: [
        {
          id: "ni_v1",
          name: "Butter Paneer Masala",
          description: "Paneer cubes in rich buttery tomato gravy",
          price: 340,
          isVeg: true,
          isBestseller: true,
          image: "🧈",
          rating: 4.8,
          variants: [
            { name: "Half", price: 220 },
            { name: "Full", price: 340 }
          ]
        },
        {
          id: "ni_v2",
          name: "Palak Paneer",
          description: "Cottage cheese in creamy spinach gravy",
          price: 320,
          isVeg: true,
          image: "🥬",
          rating: 4.6
        },
        {
          id: "ni_v3",
          name: "Dal Makhani",
          description: "Black lentils slow-cooked with butter and cream",
          price: 280,
          isVeg: true,
          isBestseller: true,
          image: "🍲",
          rating: 4.7
        },
        {
          id: "ni_v4",
          name: "Paneer Lababdar",
          description: "Paneer in rich creamy gravy with cashews",
          price: 360,
          isVeg: true,
          image: "🧀",
          rating: 4.5
        },
        {
          id: "ni_v5",
          name: "Kadhai Paneer",
          description: "Paneer with bell peppers in kadhai masala",
          price: 330,
          isVeg: true,
          image: "🫑",
          rating: 4.4,
          tags: ["Spicy"]
        },
        {
          id: "ni_v6",
          name: "Matar Paneer",
          description: "Paneer and peas in tomato gravy",
          price: 300,
          isVeg: true,
          image: "🫛",
          rating: 4.3
        },
        {
          id: "ni_v7",
          name: "Chana Masala",
          description: "Spiced chickpeas in thick gravy",
          price: 240,
          isVeg: true,
          image: "🥘",
          rating: 4.5
        },
        {
          id: "ni_v8",
          name: "Aloo Gobhi",
          description: "Potato and cauliflower dry curry",
          price: 220,
          isVeg: true,
          image: "🥔",
          rating: 4.2
        },
        {
          id: "ni_v9",
          name: "Mix Veg",
          description: "Seasonal vegetables in gravy",
          price: 260,
          isVeg: true,
          image: "🥗",
          rating: 4.1
        },
        {
          id: "ni_v10",
          name: "Malai Kofta",
          description: "Paneer and potato balls in cream gravy",
          price: 350,
          isVeg: true,
          image: "🧆",
          rating: 4.6
        }
      ]
    },

    {
      name: "Main Course - Non-Veg",
      items: [
        {
          id: "ni_nv1",
          name: "Butter Chicken",
          description: "Tandoori chicken in rich buttery tomato gravy",
          price: 420,
          isVeg: false,
          isBestseller: true,
          image: "🍗",
          rating: 4.9,
          variants: [
            { name: "Half", price: 280 },
            { name: "Full", price: 420 }
          ]
        },
        {
          id: "ni_nv2",
          name: "Chicken Curry",
          description: "Classic chicken in onion-tomato gravy",
          price: 340,
          isVeg: false,
          image: "🍛",
          rating: 4.5
        },
        {
          id: "ni_nv3",
          name: "Mutton Rogan Josh",
          description: "Kashmiri style lamb curry with yogurt",
          price: 480,
          isVeg: false,
          image: "🥩",
          rating: 4.7
        },
        {
          id: "ni_nv4",
          name: "Chicken Tikka Masala",
          description: "Grilled chicken in spiced creamy gravy",
          price: 400,
          isVeg: false,
          isBestseller: true,
          image: "🍖",
          rating: 4.6
        },
        {
          id: "ni_nv5",
          name: "Kadhai Chicken",
          description: "Chicken with capsicum in kadhai masala",
          price: 380,
          isVeg: false,
          image: "🫑",
          rating: 4.4
        },
        {
          id: "ni_nv6",
          name: "Mutton Curry",
          description: "Traditional mutton curry with potatoes",
          price: 450,
          isVeg: false,
          image: "🍲",
          rating: 4.5
        },
        {
          id: "ni_nv7",
          name: "Chicken Korma",
          description: "Chicken in rich cashew and cream gravy",
          price: 390,
          isVeg: false,
          image: "🥘",
          rating: 4.3
        },
        {
          id: "ni_nv8",
          name: "Egg Curry",
          description: "Boiled eggs in spiced curry",
          price: 240,
          isVeg: false,
          image: "🥚",
          rating: 4.2
        },
        {
          id: "ni_nv9",
          name: "Keema Matar",
          description: "Minced mutton with green peas",
          price: 420,
          isVeg: false,
          image: "🍛",
          rating: 4.6
        },
        {
          id: "ni_nv10",
          name: "Fish Curry",
          description: "Fish fillets in mustard curry",
          price: 380,
          isVeg: false,
          image: "🐟",
          rating: 4.4,
          tags: ["Chef's Special"]
        }
      ]
    },

    {
      name: "Breads",
      items: [
        {
          id: "ni_b1",
          name: "Butter Naan",
          description: "Soft tandoor bread with butter",
          price: 50,
          isVeg: true,
          isBestseller: true,
          image: "🫓",
          rating: 4.7
        },
        {
          id: "ni_b2",
          name: "Garlic Naan",
          description: "Naan topped with garlic and coriander",
          price: 60,
          isVeg: true,
          image: "🧄",
          rating: 4.6
        },
        {
          id: "ni_b3",
          name: "Plain Roti",
          description: "Whole wheat tandoor bread",
          price: 25,
          isVeg: true,
          image: "🫓",
          rating: 4.4
        },
        {
          id: "ni_b4",
          name: "Tandoori Roti",
          description: "Crispy whole wheat tandoor bread",
          price: 30,
          isVeg: true,
          image: "🔥",
          rating: 4.3
        },
        {
          id: "ni_b5",
          name: "Lachha Paratha",
          description: "Layered flaky whole wheat bread",
          price: 45,
          isVeg: true,
          image: "🥞",
          rating: 4.5
        },
        {
          id: "ni_b6",
          name: "Stuffed Paratha",
          description: "Paratha stuffed with potato/paneer/cauliflower",
          price: 80,
          isVeg: true,
          image: "🥟",
          rating: 4.6,
          variants: [
            { name: "Aloo Paratha", price: 70 },
            { name: "Paneer Paratha", price: 90 },
            { name: "Gobi Paratha", price: 80 },
            { name: "Mixed", price: 100 }
          ]
        },
        {
          id: "ni_b7",
          name: "Cheese Naan",
          description: "Naan stuffed with cheese",
          price: 90,
          isVeg: true,
          image: "🧀",
          rating: 4.5
        },
        {
          id: "ni_b8",
          name: "Roomali Roti",
          description: "Thin soft bread like handkerchief",
          price: 35,
          isVeg: true,
          image: "🫓",
          rating: 4.2
        }
      ]
    },

    {
      name: "Rice & Biryani",
      items: [
        {
          id: "ni_r1",
          name: "Veg Biryani",
          description: "Fragrant rice with vegetables and spices",
          price: 280,
          isVeg: true,
          isBestseller: true,
          image: "🍚",
          rating: 4.6,
          variants: [
            { name: "Half", price: 180 },
            { name: "Full", price: 280 }
          ]
        },
        {
          id: "ni_r2",
          name: "Chicken Biryani",
          description: "Aromatic rice with chicken and spices",
          price: 340,
          isVeg: false,
          isBestseller: true,
          image: "🍗",
          rating: 4.8,
          variants: [
            { name: "Half", price: 220 },
            { name: "Full", price: 340 }
          ]
        },
        {
          id: "ni_r3",
          name: "Mutton Biryani",
          description: "Royal biryani with tender mutton",
          price: 420,
          isVeg: false,
          image: "🥩",
          rating: 4.7
        },
        {
          id: "ni_r4",
          name: "Jeera Rice",
          description: "Basmati rice with cumin",
          price: 160,
          isVeg: true,
          image: "🍚",
          rating: 4.3
        },
        {
          id: "ni_r5",
          name: "Veg Pulao",
          description: "Mixed vegetable rice",
          price: 200,
          isVeg: true,
          image: "🥗",
          rating: 4.4
        },
        {
          id: "ni_r6",
          name: "Kashmiri Pulao",
          description: "Sweet rice with dry fruits",
          price: 240,
          isVeg: true,
          image: "🥜",
          rating: 4.5
        },
        {
          id: "ni_r7",
          name: "Chicken Fried Rice",
          description: "Stir-fried rice with chicken",
          price: 280,
          isVeg: false,
          image: "🍛",
          rating: 4.2
        },
        {
          id: "ni_r8",
          name: "Egg Biryani",
          description: "Rice with boiled eggs and spices",
          price: 260,
          isVeg: false,
          image: "🥚",
          rating: 4.3
        }
      ]
    },

    {
      name: "Accompaniments",
      items: [
        {
          id: "ni_a1",
          name: "Raita",
          description: "Yogurt with cucumber/boondi/onion",
          price: 80,
          isVeg: true,
          image: "🥣",
          rating: 4.4,
          variants: [
            { name: "Plain", price: 60 },
            { name: "Boondi Raita", price: 80 },
            { name: "Mix Veg Raita", price: 90 }
          ]
        },
        {
          id: "ni_a2",
          name: "Papad",
          description: "Crispy lentil wafers",
          price: 30,
          isVeg: true,
          image: "🍘",
          rating: 4.2
        },
        {
          id: "ni_a3",
          name: "Salad",
          description: "Fresh onion, cucumber, tomato, lemon",
          price: 70,
          isVeg: true,
          image: "🥗",
          rating: 4.3
        },
        {
          id: "ni_a4",
          name: "Mint Chutney",
          description: "Fresh mint and coriander chutney",
          price: 40,
          isVeg: true,
          image: "🌿",
          rating: 4.5
        },
        {
          id: "ni_a5",
          name: "Pickle",
          description: "Mixed pickle (mango/chilli/lemon)",
          price: 30,
          isVeg: true,
          image: "🥭",
          rating: 4.4
        },
        {
          id: "ni_a6",
          name: "Masala Papad",
          description: "Papad topped with onion-tomato masala",
          price: 70,
          isVeg: true,
          image: "🥗",
          rating: 4.3
        }
      ]
    },

    {
      name: "Desserts",
      items: [
        {
          id: "ni_d1",
          name: "Gulab Jamun",
          description: "Soft fried dumplings in sugar syrup",
          price: 90,
          isVeg: true,
          isBestseller: true,
          image: "🍮",
          rating: 4.7,
          variants: [
            { name: "2 pcs", price: 90 },
            { name: "4 pcs", price: 160 }
          ]
        },
        {
          id: "ni_d2",
          name: "Rasmalai",
          description: "Soft cottage cheese patties in saffron milk",
          price: 120,
          isVeg: true,
          image: "🥛",
          rating: 4.6
        },
        {
          id: "ni_d3",
          name: "Kheer",
          description: "Rice pudding with nuts",
          price: 100,
          isVeg: true,
          image: "🍚",
          rating: 4.5
        },
        {
          id: "ni_d4",
          name: "Rabri",
          description: "Sweet condensed milk with nuts",
          price: 140,
          isVeg: true,
          image: "🥣",
          rating: 4.6
        },
        {
          id: "ni_d5",
          name: "Kulfi",
          description: "Traditional Indian ice cream",
          price: 80,
          isVeg: true,
          image: "🍦",
          rating: 4.4,
          variants: [
            { name: "Mango", price: 80 },
            { name: "Pista", price: 90 },
            { name: "Malai", price: 80 }
          ]
        },
        {
          id: "ni_d6",
          name: "Jalebi",
          description: "Crispy sweet spirals in sugar syrup",
          price: 70,
          isVeg: true,
          image: "🍥",
          rating: 4.5
        },
        {
          id: "ni_d7",
          name: "Gajar ka Halwa",
          description: "Carrot pudding with ghee and nuts",
          price: 130,
          isVeg: true,
          image: "🥕",
          rating: 4.7,
          tags: ["Seasonal"]
        }
      ]
    },

    {
      name: "Beverages",
      items: [
        {
          id: "ni_be1",
          name: "Lassi",
          description: "Sweet/salted yogurt drink",
          price: 80,
          isVeg: true,
          image: "🥛",
          rating: 4.6,
          variants: [
            { name: "Sweet", price: 80 },
            { name: "Salted", price: 70 },
            { name: "Mango", price: 100 }
          ]
        },
        {
          id: "ni_be2",
          name: "Masala Chai",
          description: "Spiced milk tea",
          price: 40,
          isVeg: true,
          image: "🍵",
          rating: 4.5
        },
        {
          id: "ni_be3",
          name: "Jaljeera",
          description: "Refreshing cumin drink",
          price: 60,
          isVeg: true,
          image: "🥤",
          rating: 4.3
        },
        {
          id: "ni_be4",
          name: "Buttermilk (Chaas)",
          description: "Spiced yogurt drink",
          price: 50,
          isVeg: true,
          image: "🥛",
          rating: 4.4
        },
        {
          id: "ni_be5",
          name: "Thandai",
          description: "Cool milk drink with nuts and spices",
          price: 120,
          isVeg: true,
          image: "🥛",
          rating: 4.6,
          tags: ["Special"]
        },
        {
          id: "ni_be6",
          name: "Fresh Lime Soda",
          description: "Sweet or salted lemon soda",
          price: 70,
          isVeg: true,
          image: "🍋",
          rating: 4.4
        },
        {
          id: "ni_be7",
          name: "Cold Coffee",
          description: "Chilled coffee with ice cream",
          price: 140,
          isVeg: true,
          image: "☕",
          rating: 4.5
        }
      ]
    },

    {
      name: "Thalis & Combos",
      items: [
        {
          id: "ni_t1",
          name: "Veg Thali",
          description: "2 veg curries + dal + rice + 2 roti + raita + salad + sweet",
          price: 299,
          isVeg: true,
          isBestseller: true,
          image: "🍽️",
          rating: 4.6
        },
        {
          id: "ni_t2",
          name: "Non-Veg Thali",
          description: "1 chicken curry + dal + rice + 2 roti + raita + salad + sweet",
          price: 349,
          isVeg: false,
          isBestseller: true,
          image: "🍗",
          rating: 4.7
        },
        {
          id: "ni_t3",
          name: "Premium Thali",
          description: "Paneer + chicken + dal makhani + rice + naan + raita + salad + gulab jamun",
          price: 499,
          isVeg: false,
          image: "👑",
          rating: 4.8,
          tags: ["Best Value"]
        },
        {
          id: "ni_t4",
          name: "Punjabi Combo",
          description: "Butter chicken + dal makhani + 2 butter naan + jeera rice + lassi",
          price: 599,
          isVeg: false,
          image: "🥘",
          rating: 4.7
        },
        {
          id: "ni_t5",
          name: "Mini Veg Combo",
          description: "1 veg curry + dal + 2 roti + rice",
          price: 199,
          isVeg: true,
          image: "🥗",
          rating: 4.4
        },
        {
          id: "ni_t6",
          name: "Biryani Combo",
          description: "Chicken biryani + raita + salad + gulab jamun",
          price: 399,
          isVeg: false,
          image: "🍚",
          rating: 4.6
        }
      ]
    }
  ],

  // Helper functions
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

  getVegItems() {
    return this.getAllItems().filter(i => i.isVeg);
  },

  getNonVegItems() {
    return this.getAllItems().filter(i => !i.isVeg);
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
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.NorthIndianMenu = NorthIndianMenu;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NorthIndianMenu;
}
