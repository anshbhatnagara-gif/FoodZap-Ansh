/**
 * South Indian Menu
 * Dosa, idli, vada, rice dishes, curries
 */

const SouthIndianMenu = {
  restaurant: {
    name: "Saravana Bhavan",
    cuisine: ["South Indian", "Tamil"],
    rating: 4.6,
    deliveryTime: "25-40 min",
    priceForTwo: 400,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400",
    isVeg: true,
    offers: ["Free Delivery above ₹300"]
  },

  categories: [
    {
      name: "Breakfast Specials",
      items: [
        {
          id: "si_b1",
          name: "Masala Dosa",
          description: "Crispy rice crepe with spiced potato filling",
          price: 120,
          isVeg: true,
          isBestseller: true,
          image: "🥞",
          rating: 4.7,
          variants: [
            { name: "Plain", price: 90 },
            { name: "Masala", price: 120 },
            { name: "Ghee Roast", price: 150 }
          ]
        },
        {
          id: "si_b2",
          name: "Idli Sambar",
          description: "Steamed rice cakes with lentil soup and chutney",
          price: 80,
          isVeg: true,
          isBestseller: true,
          image: "🍚",
          rating: 4.6,
          variants: [
            { name: "2 pcs", price: 60 },
            { name: "4 pcs", price: 100 }
          ]
        },
        {
          id: "si_b3",
          name: "Medu Vada",
          description: "Crispy fried lentut donuts with sambar",
          price: 70,
          isVeg: true,
          image: "🍩",
          rating: 4.5
        },
        {
          id: "si_b4",
          name: "Pongal",
          description: "Rice and lentil porridge with ghee and pepper",
          price: 100,
          isVeg: true,
          image: "🥣",
          rating: 4.4
        },
        {
          id: "si_b5",
          name: "Uttapam",
          description: "Thick rice pancake with toppings",
          price: 110,
          isVeg: true,
          image: "🥞",
          rating: 4.5,
          variants: [
            { name: "Plain", price: 90 },
            { name: "Onion", price: 110 },
            { name: "Mixed", price: 130 }
          ]
        },
        {
          id: "si_b6",
          name: "Rava Dosa",
          description: "Thin crispy semolina crepe",
          price: 100,
          isVeg: true,
          image: "🫓",
          rating: 4.4
        },
        {
          id: "si_b7",
          name: "Appam",
          description: "Soft rice pancake with coconut milk",
          price: 90,
          isVeg: true,
          image: "🥞",
          rating: 4.6
        },
        {
          id: "si_b8",
          name: "Set Dosa",
          description: "Soft spongy dosa served in set of 3",
          price: 110,
          isVeg: true,
          image: "🥞",
          rating: 4.5
        }
      ]
    },

    {
      name: "Rice Varieties",
      items: [
        {
          id: "si_r1",
          name: "Lemon Rice",
          description: "Rice with lemon juice and tempered spices",
          price: 140,
          isVeg: true,
          isBestseller: true,
          image: "🍋",
          rating: 4.6
        },
        {
          id: "si_r2",
          name: "Curd Rice",
          description: "Yogurt rice with tempered mustard",
          price: 130,
          isVeg: true,
          image: "🥛",
          rating: 4.5
        },
        {
          id: "si_r3",
          name: "Tamarind Rice",
          description: "Rice with tangy tamarind paste",
          price: 150,
          isVeg: true,
          image: "🍚",
          rating: 4.4
        },
        {
          id: "si_r4",
          name: "Sambar Rice",
          description: "Rice mixed with sambar and vegetables",
          price: 160,
          isVeg: true,
          image: "🥘",
          rating: 4.5
        },
        {
          id: "si_r5",
          name: "Coconut Rice",
          description: "Rice with grated coconut and spices",
          price: 140,
          isVeg: true,
          image: "🥥",
          rating: 4.3
        },
        {
          id: "si_r6",
          name: "Tomato Rice",
          description: "Spicy tomato flavored rice",
          price: 150,
          isVeg: true,
          image: "🍅",
          rating: 4.4
        },
        {
          id: "si_r7",
          name: "Bisibele Bath",
          description: "Karnataka special rice with lentils and vegetables",
          price: 170,
          isVeg: true,
          image: "🍲",
          rating: 4.6
        },
        {
          id: "si_r8",
          name: "Chicken Biryani",
          description: "South style chicken biryani with short grain rice",
          price: 280,
          isVeg: false,
          image: "🍗",
          rating: 4.7
        }
      ]
    },

    {
      name: "Curries & Sides",
      items: [
        {
          id: "si_c1",
          name: "Sambar",
          description: "Lentil soup with vegetables and tamarind",
          price: 90,
          isVeg: true,
          isBestseller: true,
          image: "🥘",
          rating: 4.6
        },
        {
          id: "si_c2",
          name: "Rasam",
          description: "Tangy pepper soup with tomatoes",
          price: 80,
          isVeg: true,
          image: "🍲",
          rating: 4.5
        },
        {
          id: "si_c3",
          name: "Avial",
          description: "Mixed vegetables in coconut and yogurt gravy",
          price: 160,
          isVeg: true,
          image: "🥗",
          rating: 4.4
        },
        {
          id: "si_c4",
          name: "Poriyal",
          description: "Stir fried vegetables with coconut",
          price: 120,
          isVeg: true,
          image: "🥬",
          rating: 4.3
        },
        {
          id: "si_c5",
          name: "Kootu",
          description: "Lentils and vegetables curry",
          price: 140,
          isVeg: true,
          image: "🍛",
          rating: 4.2
        },
        {
          id: "si_c6",
          name: "Mor Kuzhambu",
          description: "Yogurt based curry with okra/ash gourd",
          price: 130,
          isVeg: true,
          image: "🥣",
          rating: 4.3
        },
        {
          id: "si_c7",
          name: "Chettinad Chicken",
          description: "Spicy chicken curry from Chettinad",
          price: 320,
          isVeg: false,
          image: "🍗",
          rating: 4.7,
          tags: ["Spicy"]
        },
        {
          id: "si_c8",
          name: "Meen Kuzhambu",
          description: "Fish curry in tangy tamarind gravy",
          price: 300,
          isVeg: false,
          image: "🐟",
          rating: 4.6
        }
      ]
    },

    {
      name: "Breads & Snacks",
      items: [
        {
          id: "si_br1",
          name: "Parotta",
          description: "Layered flaky bread",
          price: 40,
          isVeg: true,
          isBestseller: true,
          image: "🫓",
          rating: 4.5
        },
        {
          id: "si_br2",
          name: "Kerala Parotta",
          description: "Soft layered Malabar parotta",
          price: 45,
          isVeg: true,
          image: "🫓",
          rating: 4.6
        },
        {
          id: "si_br3",
          name: "Chapati",
          description: "Whole wheat flatbread",
          price: 25,
          isVeg: true,
          image: "🫓",
          rating: 4.3
        },
        {
          id: "si_br4",
          name: "Poori",
          description: "Deep fried puffed bread",
          price: 30,
          isVeg: true,
          image: "🍞",
          rating: 4.4
        },
        {
          id: "si_br5",
          name: "Bonda",
          description: "Potato stuffed fritters",
          price: 60,
          isVeg: true,
          image: "🍘",
          rating: 4.3
        },
        {
          id: "si_br6",
          name: "Murukku",
          description: "Crispy rice flour snack",
          price: 80,
          isVeg: true,
          image: "🥨",
          rating: 4.4
        }
      ]
    },

    {
      name: "Drinks & Desserts",
      items: [
        {
          id: "si_d1",
          name: "Filter Coffee",
          description: "Traditional South Indian coffee",
          price: 50,
          isVeg: true,
          isBestseller: true,
          image: "☕",
          rating: 4.8
        },
        {
          id: "si_d2",
          name: "Tender Coconut",
          description: "Fresh coconut water",
          price: 60,
          isVeg: true,
          image: "🥥",
          rating: 4.6
        },
        {
          id: "si_d3",
          name: "Buttermilk",
          description: "Spiced yogurt drink",
          price: 40,
          isVeg: true,
          image: "🥛",
          rating: 4.5
        },
        {
          id: "si_d4",
          name: "Rasam (Drink)",
          description: "Tangy pepper soup as beverage",
          price: 50,
          isVeg: true,
          image: "🍵",
          rating: 4.4
        },
        {
          id: "si_d5",
          name: "Payasam",
          description: "Sweet milk pudding with vermicelli",
          price: 100,
          isVeg: true,
          image: "🍮",
          rating: 4.7
        },
        {
          id: "si_d6",
          name: "Mysore Pak",
          description: "Sweet gram flour fudge",
          price: 80,
          isVeg: true,
          image: "🍬",
          rating: 4.6
        },
        {
          id: "si_d7",
          name: "Jangiri",
          description: "Orange colored sweet made from urad dal",
          price: 70,
          isVeg: true,
          image: "🍥",
          rating: 4.5
        },
        {
          id: "si_d8",
          name: "Badam Milk",
          description: "Almond flavored milk",
          price: 90,
          isVeg: true,
          image: "🥛",
          rating: 4.6
        }
      ]
    },

    {
      name: "Meals & Combos",
      items: [
        {
          id: "si_m1",
          name: "South Indian Thali",
          description: "Rice, sambar, rasam, kootu, poriyal, curd, pickle, papad, sweet",
          price: 220,
          isVeg: true,
          isBestseller: true,
          image: "🍽️",
          rating: 4.7
        },
        {
          id: "si_m2",
          name: "Mini Meals",
          description: "Rice, sambar, poriyal, curd, pickle",
          price: 150,
          isVeg: true,
          image: "🥗",
          rating: 4.5
        },
        {
          id: "si_m3",
          name: "Non-Veg Meals",
          description: "Rice, sambar, chicken curry, fish fry, curd, pickle",
          price: 350,
          isVeg: false,
          image: "🍗",
          rating: 4.6
        },
        {
          id: "si_m4",
          name: "Biryani Combo",
          description: "Chicken biryani + raita + salan",
          price: 320,
          isVeg: false,
          image: "🍚",
          rating: 4.7
        },
        {
          id: "si_m5",
          name: "Dosa Combo",
          description: "2 masala dosa + chutney + sambar + filter coffee",
          price: 280,
          isVeg: true,
          image: "🥞",
          rating: 4.6
        },
        {
          id: "si_m6",
          name: "Idli Combo",
          description: "4 idli + 2 vada + chutney + sambar",
          price: 200,
          isVeg: true,
          image: "🍚",
          rating: 4.5
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
  window.SouthIndianMenu = SouthIndianMenu;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SouthIndianMenu;
}
