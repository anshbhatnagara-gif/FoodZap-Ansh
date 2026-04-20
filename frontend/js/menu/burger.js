/**
 * Burger & Fast Food Menu
 * Burgers, wraps, fries, milkshakes
 */

const BurgerMenu = {
  restaurant: {
    name: "Burger Junction",
    cuisine: ["American", "Fast Food"],
    rating: 4.4,
    deliveryTime: "25-35 min",
    priceForTwo: 350,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    isVeg: false,
    offers: ["Free Fries with Burger", "Buy 2 Get 1 Free"]
  },

  categories: [
    {
      name: "Classic Burgers",
      items: [
        {
          id: "bg_v1",
          name: "Veggie Burger",
          description: "Crispy veg patty with fresh veggies",
          price: 99,
          isVeg: true,
          isBestseller: true,
          image: "🍔",
          rating: 4.5,
          variants: [
            { name: "Classic", price: 99 },
            { name: "Cheese", price: 129 },
            { name: "Double", price: 159 }
          ]
        },
        {
          id: "bg_v2",
          name: "Paneer Burger",
          description: "Grilled paneer with mayo",
          price: 149,
          isVeg: true,
          image: "🧀",
          rating: 4.6
        },
        {
          id: "bg_v3",
          name: "Aloo Tikki Burger",
          description: "Indian style potato patty",
          price: 79,
          isVeg: true,
          isBestseller: true,
          image: "🥔",
          rating: 4.5
        },
        {
          id: "bg_nv1",
          name: "Chicken Burger",
          description: "Crispy chicken patty with lettuce",
          price: 149,
          isVeg: false,
          isBestseller: true,
          image: "🍗",
          rating: 4.7
        },
        {
          id: "bg_nv2",
          name: "Chicken Cheese Burger",
          description: "Chicken with melted cheese",
          price: 179,
          isVeg: false,
          image: "🧀",
          rating: 4.6
        },
        {
          id: "bg_nv3",
          name: "Grilled Chicken Burger",
          description: "Flame grilled chicken patty",
          price: 199,
          isVeg: false,
          image: "🔥",
          rating: 4.7
        }
      ]
    },

    {
      name: "Premium Burgers",
      items: [
        {
          id: "bg_p1",
          name: "Double Cheeseburger",
          description: "Two patties with double cheese",
          price: 249,
          isVeg: false,
          image: "🍔",
          rating: 4.8
        },
        {
          id: "bg_p2",
          name: "Bacon Burger",
          description: "Beef patty with crispy bacon",
          price: 299,
          isVeg: false,
          image: "🥓",
          rating: 4.7
        },
        {
          id: "bg_p3",
          name: "Mushroom Swiss Burger",
          description: "Swiss cheese with sauteed mushrooms",
          price: 229,
          isVeg: true,
          image: "🍄",
          rating: 4.5
        },
        {
          id: "bg_p4",
          name: "Crispy Chicken Deluxe",
          description: "Premium chicken with special sauce",
          price: 279,
          isVeg: false,
          image: "👑",
          rating: 4.8
        }
      ]
    },

    {
      name: "Wraps & Rolls",
      items: [
        {
          id: "bg_w1",
          name: "Veg Wrap",
          description: "Fresh vegetables in tortilla",
          price: 129,
          isVeg: true,
          image: "🌯",
          rating: 4.4
        },
        {
          id: "bg_w2",
          name: "Paneer Wrap",
          description: "Paneer tikka with mint mayo",
          price: 169,
          isVeg: true,
          image: "🧀",
          rating: 4.5
        },
        {
          id: "bg_w3",
          name: "Chicken Wrap",
          description: "Grilled chicken with veggies",
          price: 179,
          isVeg: false,
          isBestseller: true,
          image: "🌯",
          rating: 4.6
        },
        {
          id: "bg_w4",
          name: "Falafel Wrap",
          description: "Middle Eastern chickpea wrap",
          price: 149,
          isVeg: true,
          image: "🥙",
          rating: 4.5
        }
      ]
    },

    {
      name: "Fries & Sides",
      items: [
        {
          id: "bg_f1",
          name: "French Fries",
          description: "Classic salted fries",
          price: 79,
          isVeg: true,
          isBestseller: true,
          image: "🍟",
          rating: 4.6,
          variants: [
            { name: "Regular", price: 79 },
            { name: "Large", price: 109 },
            { name: "XL", price: 139 }
          ]
        },
        {
          id: "bg_f2",
          name: "Peri Peri Fries",
          description: "Spicy seasoned fries",
          price: 99,
          isVeg: true,
          image: "🌶️",
          rating: 4.7
        },
        {
          id: "bg_f3",
          name: "Cheesy Fries",
          description: "Fries topped with cheese sauce",
          price: 129,
          isVeg: true,
          image: "🧀",
          rating: 4.6
        },
        {
          id: "bg_f4",
          name: "Loaded Fries",
          description: "Fries with cheese, bacon, jalapenos",
          price: 179,
          isVeg: false,
          image: "🍟",
          rating: 4.8
        },
        {
          id: "bg_f5",
          name: "Onion Rings",
          description: "Crispy battered onion rings",
          price: 99,
          isVeg: true,
          image: "🧅",
          rating: 4.4
        }
      ]
    },

    {
      name: "Beverages",
      items: [
        {
          id: "bg_bv1",
          name: "Milkshake",
          description: "Thick creamy milkshake",
          price: 149,
          isVeg: true,
          isBestseller: true,
          image: "🥤",
          rating: 4.7,
          variants: [
            { name: "Chocolate", price: 149 },
            { name: "Strawberry", price: 139 },
            { name: "Vanilla", price: 129 },
            { name: "Oreo", price: 169 }
          ]
        },
        {
          id: "bg_bv2",
          name: "Cold Coffee",
          description: "Iced coffee with whipped cream",
          price: 119,
          isVeg: true,
          image: "☕",
          rating: 4.5
        },
        {
          id: "bg_bv3",
          name: "Soft Drink",
          description: "500ml bottle",
          price: 60,
          isVeg: true,
          image: "🥤",
          rating: 4.3
        },
        {
          id: "bg_bv4",
          name: "Fresh Lime Soda",
          description: "Sweet or salted lime soda",
          price: 79,
          isVeg: true,
          image: "🍋",
          rating: 4.4
        }
      ]
    }
  ],

  extras: [
    { name: "Extra Cheese", price: 30 },
    { name: "Extra Patty", price: 50 },
    { name: "Bacon", price: 40 },
    { name: "Jalapenos", price: 20 },
    { name: "Mushrooms", price: 25 }
  ],

  sauces: [
    { name: "Tomato Ketchup", price: 0 },
    { name: "Mayonnaise", price: 0 },
    { name: "Mustard", price: 0 },
    { name: "BBQ Sauce", price: 20 },
    { name: "Chipotle Mayo", price: 25 },
    { name: "Peri Peri", price: 25 }
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
  window.BurgerMenu = BurgerMenu;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BurgerMenu;
}
