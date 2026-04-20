/**
 * Biryani Menu
 * Various biryani styles and rice dishes
 */

const BiryaniMenu = {
  restaurant: {
    name: "Biryani House",
    cuisine: ["Biryani", "Hyderabadi"],
    rating: 4.7,
    deliveryTime: "35-50 min",
    priceForTwo: 500,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    isVeg: false,
    offers: ["Extra Raita Free", "Gulab Jamun on orders above ₹500"]
  },

  categories: [
    {
      name: "Chicken Biryani",
      items: [
        {
          id: "br_c1",
          name: "Hyderabadi Chicken Biryani",
          description: "Authentic Hyderabadi style with basmati rice",
          price: 349,
          isVeg: false,
          isBestseller: true,
          image: "🍗",
          rating: 4.8,
          variants: [
            { name: "Half", price: 249 },
            { name: "Full", price: 349 },
            { name: "Family Pack", price: 649 }
          ]
        },
        {
          id: "br_c2",
          name: "Lucknowi Chicken Biryani",
          description: "Delicate Lucknowi dum biryani",
          price: 369,
          isVeg: false,
          image: "🥘",
          rating: 4.7
        },
        {
          id: "br_c3",
          name: "Kolkata Chicken Biryani",
          description: "With boiled egg and potato",
          price: 339,
          isVeg: false,
          image: "🥚",
          rating: 4.6
        },
        {
          id: "br_c4",
          name: "Malabar Chicken Biryani",
          description: "Kerala style short grain rice biryani",
          price: 359,
          isVeg: false,
          image: "🥥",
          rating: 4.7
        },
        {
          id: "br_c5",
          name: "Chicken Tikka Biryani",
          description: "Biryani with grilled chicken tikka",
          price: 389,
          isVeg: false,
          image: "🔥",
          rating: 4.8
        },
        {
          id: "br_c6",
          name: "Butter Chicken Biryani",
          description: "Biryani with butter chicken gravy",
          price: 399,
          isVeg: false,
          image: "🧈",
          rating: 4.7
        },
        {
          id: "br_c7",
          name: "Chicken 65 Biryani",
          description: "Spicy chicken 65 with biryani rice",
          price: 379,
          isVeg: false,
          image: "🌶️",
          rating: 4.6,
          tags: ["Spicy"]
        },
        {
          id: "br_c8",
          name: "Keema Biryani",
          description: "Minced chicken biryani",
          price: 369,
          isVeg: false,
          image: "🍖",
          rating: 4.5
        }
      ]
    },

    {
      name: "Mutton Biryani",
      items: [
        {
          id: "br_m1",
          name: "Hyderabadi Mutton Biryani",
          description: "Tender mutton in authentic Hyderabadi style",
          price: 449,
          isVeg: false,
          isBestseller: true,
          image: "🥩",
          rating: 4.8,
          variants: [
            { name: "Half", price: 329 },
            { name: "Full", price: 449 }
          ]
        },
        {
          id: "br_m2",
          name: "Lucknowi Mutton Biryani",
          description: "Royal Awadhi style mutton biryani",
          price: 469,
          isVeg: false,
          image: "👑",
          rating: 4.9
        },
        {
          id: "br_m3",
          name: "Mutton Kofta Biryani",
          description: "Biryani with m meatballs",
          price: 429,
          isVeg: false,
          image: "🧆",
          rating: 4.7
        },
        {
          id: "br_m4",
          name: "Mutton Rogan Biryani",
          description: "Mutton rogan josh with biryani rice",
          price: 459,
          isVeg: false,
          image: "🍖",
          rating: 4.6
        }
      ]
    },

    {
      name: "Veg Biryani",
      items: [
        {
          id: "br_v1",
          name: "Veg Dum Biryani",
          description: "Mixed vegetables with aromatic rice",
          price: 279,
          isVeg: true,
          isBestseller: true,
          image: "🥗",
          rating: 4.6,
          variants: [
            { name: "Half", price: 199 },
            { name: "Full", price: 279 }
          ]
        },
        {
          id: "br_v2",
          name: "Paneer Biryani",
          description: "Biryani with paneer cubes",
          price: 319,
          isVeg: true,
          image: "🧀",
          rating: 4.7
        },
        {
          id: "br_v3",
          name: "Mushroom Biryani",
          description: "Flavorful mushroom biryani",
          price: 299,
          isVeg: true,
          image: "🍄",
          rating: 4.5
        },
        {
          id: "br_v4",
          name: "Kashmiri Pulao",
          description: "Sweet and savory rice with dry fruits",
          price: 289,
          isVeg: true,
          image: "🥜",
          rating: 4.6
        },
        {
          id: "br_v5",
          name: "Veg Fried Rice Biryani",
          description: "Indo-Chinese style veg biryani",
          price: 259,
          isVeg: true,
          image: "🍚",
          rating: 4.4
        },
        {
          id: "br_v6",
          name: "Tahiri",
          description: "Aromatic rice with mixed vegetables",
          price: 249,
          isVeg: true,
          image: "🥘",
          rating: 4.3
        }
      ]
    },

    {
      name: "Egg Biryani",
      items: [
        {
          id: "br_e1",
          name: "Egg Biryani",
          description: "Biryani rice with boiled eggs",
          price: 239,
          isVeg: false,
          image: "🥚",
          rating: 4.5
        },
        {
          id: "br_e2",
          name: "Egg Fried Rice Biryani",
          description: "Stir-fried rice with scrambled eggs",
          price: 219,
          isVeg: false,
          image: "🍳",
          rating: 4.4
        },
        {
          id: "br_e3",
          name: "Egg Roast Biryani",
          description: "Spicy egg roast with biryani rice",
          price: 269,
          isVeg: false,
          image: "🥚",
          rating: 4.6
        }
      ]
    },

    {
      name: "Fish & Prawn Biryani",
      items: [
        {
          id: "br_f1",
          name: "Fish Biryani",
          description: "Fish fillets cooked with biryani rice",
          price: 379,
          isVeg: false,
          image: "🐟",
          rating: 4.6
        },
        {
          id: "br_f2",
          name: "Fish Tikka Biryani",
          description: "Grilled fish tikka with biryani",
          price: 399,
          isVeg: false,
          image: "🔥",
          rating: 4.7
        },
        {
          id: "br_p1",
          name: "Prawn Biryani",
          description: "Jumbo prawns in biryani rice",
          price: 449,
          isVeg: false,
          image: "🦐",
          rating: 4.8
        },
        {
          id: "br_p2",
          name: "Prawn Masala Biryani",
          description: "Spicy prawn masala biryani",
          price: 469,
          isVeg: false,
          image: "🍤",
          rating: 4.7,
          tags: ["Spicy"]
        }
      ]
    },

    {
      name: "Combos & Meals",
      items: [
        {
          id: "br_cb1",
          name: "Chicken Biryani Combo",
          description: "Chicken biryani + raita + salan + gulab jamun",
          price: 399,
          isVeg: false,
          isBestseller: true,
          image: "🍗",
          rating: 4.8
        },
        {
          id: "br_cb2",
          name: "Mutton Biryani Feast",
          description: "Mutton biryani + raita + mirchi ka salan + double ka meetha",
          price: 549,
          isVeg: false,
          image: "🥩",
          rating: 4.9
        },
        {
          id: "br_cb3",
          name: "Veg Biryani Thali",
          description: "Veg biryani + raita + papad + pickle + sweet",
          price: 329,
          isVeg: true,
          image: "🍽️",
          rating: 4.6
        },
        {
          id: "br_cb4",
          name: "Family Pack Veg",
          description: "Serves 4 - Large veg biryani + sides + 4 sweets",
          price: 699,
          isVeg: true,
          image: "👨‍👩‍👧‍👦",
          rating: 4.7
        },
        {
          id: "br_cb5",
          name: "Family Pack Non-Veg",
          description: "Serves 4 - Large chicken biryani + sides + 4 sweets",
          price: 899,
          isVeg: false,
          image: "👨‍👩‍👧‍👦",
          rating: 4.8,
          tags: ["Best Value"]
        }
      ]
    },

    {
      name: "Sides & Accompaniments",
      items: [
        {
          id: "br_s1",
          name: "Mirchi Ka Salan",
          description: "Hyderabadi chilli curry",
          price: 120,
          isVeg: true,
          image: "🌶️",
          rating: 4.5
        },
        {
          id: "br_s2",
          name: "Raita",
          description: "Yogurt with cucumber and spices",
          price: 60,
          isVeg: true,
          image: "🥣",
          rating: 4.4
        },
        {
          id: "br_s3",
          name: "Burani Raita",
          description: "Garlic flavored raita",
          price: 70,
          isVeg: true,
          image: "🧄",
          rating: 4.6
        },
        {
          id: "br_s4",
          name: "Bagara Baingan",
          description: "Stuffed baby eggplants curry",
          price: 150,
          isVeg: true,
          image: "🍆",
          rating: 4.5
        },
        {
          id: "br_s5",
          name: "Dalcha",
          description: "Lentil curry with meat and vegetables",
          price: 140,
          isVeg: false,
          image: "🥘",
          rating: 4.4
        },
        {
          id: "br_s6",
          name: "Mutton Marag",
          description: "Mutton soup starter",
          price: 180,
          isVeg: false,
          image: "🍲",
          rating: 4.6
        }
      ]
    },

    {
      name: "Desserts",
      items: [
        {
          id: "br_d1",
          name: "Double Ka Meetha",
          description: "Hyderabadi bread pudding",
          price: 120,
          isVeg: true,
          image: "🍞",
          rating: 4.7
        },
        {
          id: "br_d2",
          name: "Qubani Ka Meetha",
          description: "Apricot dessert with cream",
          price: 140,
          isVeg: true,
          image: "🍑",
          rating: 4.8
        },
        {
          id: "br_d3",
          name: "Gulab Jamun",
          description: "Sweet fried dumplings",
          price: 80,
          isVeg: true,
          image: "🍮",
          rating: 4.6
        },
        {
          id: "br_d4",
          name: "Firni",
          description: "Rice pudding in clay pot",
          price: 100,
          isVeg: true,
          image: "🥣",
          rating: 4.5
        }
      ]
    }
  ],

  spiceLevels: [
    { name: "Mild", description: "Less spicy" },
    { name: "Medium", description: "Regular spice" },
    { name: "Hot", description: "Extra spicy" },
    { name: "Extra Hot", description: "Very spicy" }
  ],

  accompaniments: [
    { name: "Extra Raita", price: 60 },
    { name: "Extra Salan", price: 120 },
    { name: "Extra Gravy", price: 100 },
    { name: "Double Meat", price: 150 }
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
  window.BiryaniMenu = BiryaniMenu;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BiryaniMenu;
}
