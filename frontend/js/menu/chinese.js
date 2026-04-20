/**
 * Chinese Menu
 * Noodles, rice, gravies, starters
 */

const ChineseMenu = {
  restaurant: {
    name: "Dragon Wok",
    cuisine: ["Chinese", "Asian"],
    rating: 4.4,
    deliveryTime: "30-45 min",
    priceForTwo: 550,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400",
    isVeg: false,
    offers: ["30% OFF on first order"]
  },

  categories: [
    {
      name: "Soups",
      items: [
        {
          id: "ch_s1",
          name: "Hot & Sour Soup",
          description: "Spicy tangy soup with vegetables",
          price: 120,
          isVeg: true,
          isBestseller: true,
          image: "🍜",
          rating: 4.5,
          variants: [
            { name: "Veg", price: 120 },
            { name: "Chicken", price: 140 },
            { name: "Seafood", price: 180 }
          ]
        },
        {
          id: "ch_s2",
          name: "Manchow Soup",
          description: "Spicy soup with fried noodles",
          price: 130,
          isVeg: true,
          image: "🥣",
          rating: 4.4
        },
        {
          id: "ch_s3",
          name: "Sweet Corn Soup",
          description: "Creamy corn soup with vegetables",
          price: 110,
          isVeg: true,
          image: "🌽",
          rating: 4.3
        },
        {
          id: "ch_s4",
          name: "Wonton Soup",
          description: "Chicken dumplings in clear broth",
          price: 160,
          isVeg: false,
          image: "🥟",
          rating: 4.5
        },
        {
          id: "ch_s5",
          name: "Lemon Coriander Soup",
          description: "Light soup with lemon and herbs",
          price: 100,
          isVeg: true,
          image: "🍋",
          rating: 4.2
        },
        {
          id: "ch_s6",
          name: "Talumein Soup",
          description: "Noodle soup with vegetables",
          price: 140,
          isVeg: true,
          image: "🍜",
          rating: 4.3
        }
      ]
    },

    {
      name: "Starters",
      items: [
        {
          id: "ch_st1",
          name: "Veg Manchurian",
          description: "Fried vegetable balls in soya gravy",
          price: 220,
          isVeg: true,
          isBestseller: true,
          image: "🧆",
          rating: 4.6,
          variants: [
            { name: "Dry", price: 220 },
            { name: "Gravy", price: 240 }
          ]
        },
        {
          id: "ch_st2",
          name: "Chilli Paneer",
          description: "Paneer tossed with bell peppers in chilli sauce",
          price: 280,
          isVeg: true,
          isBestseller: true,
          image: "🧀",
          rating: 4.7,
          tags: ["Spicy"]
        },
        {
          id: "ch_st3",
          name: "Spring Rolls",
          description: "Crispy rolls with vegetable filling",
          price: 180,
          isVeg: true,
          image: "🫔",
          rating: 4.5,
          variants: [
            { name: "Veg", price: 180 },
            { name: "Chicken", price: 220 }
          ]
        },
        {
          id: "ch_st4",
          name: "Crispy Corn",
          description: "Golden fried corn kernels",
          price: 200,
          isVeg: true,
          image: "🌽",
          rating: 4.4
        },
        {
          id: "ch_st5",
          name: "Chicken Lollipop",
          description: "Spicy chicken winglets",
          price: 320,
          isVeg: false,
          image: "🍗",
          rating: 4.7
        },
        {
          id: "ch_st6",
          name: "Chilli Chicken",
          description: "Boneless chicken in chilli sauce",
          price: 340,
          isVeg: false,
          isBestseller: true,
          image: "🌶️",
          rating: 4.6
        },
        {
          id: "ch_st7",
          name: "Fish Fingers",
          description: "Crispy battered fish strips",
          price: 360,
          isVeg: false,
          image: "🐟",
          rating: 4.5
        },
        {
          id: "ch_st8",
          name: "Salt & Pepper Prawns",
          description: "Prawns tossed in salt and pepper",
          price: 450,
          isVeg: false,
          image: "🦐",
          rating: 4.6
        },
        {
          id: "ch_st9",
          name: "Honey Chilli Potato",
          description: "Crispy potatoes in honey chilli glaze",
          price: 190,
          isVeg: true,
          image: "🍯",
          rating: 4.5
        },
        {
          id: "ch_st10",
          name: "Mushroom Salt & Pepper",
          description: "Mushrooms tossed with salt and pepper",
          price: 240,
          isVeg: true,
          image: "🍄",
          rating: 4.4
        }
      ]
    },

    {
      name: "Noodles",
      items: [
        {
          id: "ch_n1",
          name: "Hakka Noodles",
          description: "Stir fried noodles with vegetables",
          price: 220,
          isVeg: true,
          isBestseller: true,
          image: "🍜",
          rating: 4.6,
          variants: [
            { name: "Veg", price: 220 },
            { name: "Chicken", price: 280 },
            { name: "Egg", price: 240 },
            { name: "Prawns", price: 380 }
          ]
        },
        {
          id: "ch_n2",
          name: "Schezwan Noodles",
          description: "Spicy schezwan sauce noodles",
          price: 240,
          isVeg: true,
          image: "🌶️",
          rating: 4.5,
          tags: ["Spicy"],
          variants: [
            { name: "Veg", price: 240 },
            { name: "Chicken", price: 300 }
          ]
        },
        {
          id: "ch_n3",
          name: "Chilli Garlic Noodles",
          description: "Noodles with chilli and garlic",
          price: 230,
          isVeg: true,
          image: "🧄",
          rating: 4.4
        },
        {
          id: "ch_n4",
          name: "Triple Schezwan Noodles",
          description: "Noodles with rice, gravy and crispy noodles",
          price: 280,
          isVeg: true,
          image: "🍜",
          rating: 4.5
        },
        {
          id: "ch_n5",
          name: "Chicken Singapore Noodles",
          description: "Rice vermicelli with curry spices",
          price: 320,
          isVeg: false,
          image: "🍜",
          rating: 4.6
        },
        {
          id: "ch_n6",
          name: "Udon Noodles",
          description: "Thick wheat noodles in broth",
          price: 280,
          isVeg: true,
          image: "🍜",
          rating: 4.3
        },
        {
          id: "ch_n7",
          name: "Pad Thai Noodles",
          description: "Thai style rice noodles with peanuts",
          price: 340,
          isVeg: true,
          image: "🥜",
          rating: 4.5
        }
      ]
    },

    {
      name: "Rice",
      items: [
        {
          id: "ch_r1",
          name: "Veg Fried Rice",
          description: "Stir fried rice with vegetables",
          price: 220,
          isVeg: true,
          isBestseller: true,
          image: "🍚",
          rating: 4.6,
          variants: [
            { name: "Veg", price: 220 },
            { name: "Egg", price: 250 },
            { name: "Chicken", price: 280 },
            { name: "Prawns", price: 380 }
          ]
        },
        {
          id: "ch_r2",
          name: "Schezwan Fried Rice",
          description: "Spicy rice with schezwan sauce",
          price: 240,
          isVeg: true,
          image: "🌶️",
          rating: 4.5,
          tags: ["Spicy"]
        },
        {
          id: "ch_r3",
          name: "Chicken Triple Rice",
          description: "Rice with gravy and crispy noodles",
          price: 320,
          isVeg: false,
          image: "🍚",
          rating: 4.6
        },
        {
          id: "ch_r4",
          name: "Burnt Garlic Rice",
          description: "Rice with burnt garlic flavor",
          price: 240,
          isVeg: true,
          image: "🧄",
          rating: 4.4
        },
        {
          id: "ch_r5",
          name: "Yang Chow Fried Rice",
          description: "Special fried rice with BBQ pork",
          price: 340,
          isVeg: false,
          image: "🥓",
          rating: 4.5
        },
        {
          id: "ch_r6",
          name: "Pineapple Fried Rice",
          description: "Sweet and savory rice with pineapple",
          price: 280,
          isVeg: true,
          image: "🍍",
          rating: 4.3
        }
      ]
    },

    {
      name: "Main Course",
      items: [
        {
          id: "ch_m1",
          name: "Veg Hakka Noodles",
          description: "Classic stir fried noodles",
          price: 220,
          isVeg: true,
          isBestseller: true,
          image: "🍜",
          rating: 4.5
        },
        {
          id: "ch_m2",
          name: "Kung Pao Chicken",
          description: "Spicy chicken with peanuts and vegetables",
          price: 380,
          isVeg: false,
          image: "🥜",
          rating: 4.7,
          tags: ["Spicy"]
        },
        {
          id: "ch_m3",
          name: "Mapo Tofu",
          description: "Soft tofu in spicy bean sauce",
          price: 280,
          isVeg: true,
          image: "🧊",
          rating: 4.4
        },
        {
          id: "ch_m4",
          name: "Szechuan Eggplant",
          description: "Eggplant in spicy garlic sauce",
          price: 260,
          isVeg: true,
          image: "🍆",
          rating: 4.3
        },
        {
          id: "ch_m5",
          name: "General Tso's Chicken",
          description: "Crispy chicken in sweet spicy sauce",
          price: 360,
          isVeg: false,
          image: "🍗",
          rating: 4.6
        },
        {
          id: "ch_m6",
          name: "Sweet & Sour Pork",
          description: "Pork in tangy sweet sour sauce",
          price: 380,
          isVeg: false,
          image: "🥓",
          rating: 4.5
        },
        {
          id: "ch_m7",
          name: "Beef in Oyster Sauce",
          description: "Tender beef with oyster sauce",
          price: 420,
          isVeg: false,
          image: "🥩",
          rating: 4.6
        },
        {
          id: "ch_m8",
          name: "Chilli Fish",
          description: "Fish fillets in chilli sauce",
          price: 380,
          isVeg: false,
          image: "🐟",
          rating: 4.5
        },
        {
          id: "ch_m9",
          name: "Bok Choy Garlic",
          description: "Chinese cabbage with garlic",
          price: 200,
          isVeg: true,
          image: "🥬",
          rating: 4.2
        },
        {
          id: "ch_m10",
          name: "Exotic Vegetables",
          description: "Baby corn, broccoli, mushrooms in oyster sauce",
          price: 280,
          isVeg: true,
          image: "🥦",
          rating: 4.4
        }
      ]
    },

    {
      name: "Momos & Dim Sum",
      items: [
        {
          id: "ch_mm1",
          name: "Steamed Momos",
          description: "Classic steamed dumplings",
          price: 160,
          isVeg: true,
          isBestseller: true,
          image: "🥟",
          rating: 4.7,
          variants: [
            { name: "Veg", price: 160 },
            { name: "Chicken", price: 200 },
            { name: "Pork", price: 220 }
          ]
        },
        {
          id: "ch_mm2",
          name: "Fried Momos",
          description: "Crispy fried dumplings",
          price: 180,
          isVeg: true,
          image: "🥟",
          rating: 4.6
        },
        {
          id: "ch_mm3",
          name: "Tandoori Momos",
          description: "Momos cooked in tandoor",
          price: 220,
          isVeg: true,
          image: "🔥",
          rating: 4.5
        },
        {
          id: "ch_mm4",
          name: "Pan Fried Momos",
          description: "Pan seared crispy bottom dumplings",
          price: 200,
          isVeg: true,
          image: "🥟",
          rating: 4.6
        },
        {
          id: "ch_mm5",
          name: "Chicken Dim Sum",
          description: "Traditional steamed chicken dumplings",
          price: 280,
          isVeg: false,
          image: "🥟",
          rating: 4.5
        },
        {
          id: "ch_mm6",
          name: "Prawn Har Gow",
          description: "Crystal dumplings with prawns",
          price: 360,
          isVeg: false,
          image: "🦐",
          rating: 4.7
        }
      ]
    },

    {
      name: "Beverages",
      items: [
        {
          id: "ch_d1",
          name: "Chinese Tea",
          description: "Hot jasmine tea",
          price: 60,
          isVeg: true,
          image: "🍵",
          rating: 4.3
        },
        {
          id: "ch_d2",
          name: "Plum Juice",
          description: "Sweet and sour plum drink",
          price: 90,
          isVeg: true,
          image: "🍹",
          rating: 4.4
        },
        {
          id: "ch_d3",
          name: "Lemon Iced Tea",
          description: "Refreshing lemon tea",
          price: 100,
          isVeg: true,
          image: "🍋",
          rating: 4.5
        },
        {
          id: "ch_d4",
          name: "Virgin Mojito",
          description: "Mint lime soda mocktail",
          price: 140,
          isVeg: true,
          image: "🍃",
          rating: 4.4
        },
        {
          id: "ch_d5",
          name: "Mango Smoothie",
          description: "Thick mango yogurt drink",
          price: 160,
          isVeg: true,
          image: "🥭",
          rating: 4.6
        }
      ]
    }
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

  getVegItems() {
    return this.getAllItems().filter(i => i.isVeg);
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

if (typeof window !== 'undefined') {
  window.ChineseMenu = ChineseMenu;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChineseMenu;
}
