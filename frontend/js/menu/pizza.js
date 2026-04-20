/**
 * Pizza Menu
 * Classic and specialty pizzas
 */

const PizzaMenu = {
  restaurant: {
    name: "Pizza Palace",
    cuisine: ["Italian", "Pizza"],
    rating: 4.5,
    deliveryTime: "35-50 min",
    priceForTwo: 500,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    isVeg: false,
    offers: ["Buy 1 Get 1 Free", "Free Dip"]
  },

  categories: [
    {
      name: "Veg Pizzas",
      items: [
        {
          id: "pz_v1",
          name: "Margherita",
          description: "Classic cheese and tomato pizza",
          price: 199,
          isVeg: true,
          isBestseller: true,
          image: "🍕",
          rating: 4.6,
          variants: [
            { name: "Regular", price: 199 },
            { name: "Medium", price: 349 },
            { name: "Large", price: 499 }
          ]
        },
        {
          id: "pz_v2",
          name: "Farmhouse",
          description: "Onion, capsicum, tomato, mushroom",
          price: 299,
          isVeg: true,
          isBestseller: true,
          image: "🍕",
          rating: 4.7,
          variants: [
            { name: "Regular", price: 299 },
            { name: "Medium", price: 449 },
            { name: "Large", price: 599 }
          ]
        },
        {
          id: "pz_v3",
          name: "Peppy Paneer",
          description: "Paneer, capsicum, spicy sauce",
          price: 329,
          isVeg: true,
          image: "🧀",
          rating: 4.5,
          tags: ["Spicy"]
        },
        {
          id: "pz_v4",
          name: "Mexican Green Wave",
          description: "Onion, capsicum, jalapeno, tomato",
          price: 319,
          isVeg: true,
          image: "🌶️",
          rating: 4.4
        },
        {
          id: "pz_v5",
          name: "Veg Extravaganza",
          description: "Loaded with 8 vegetables",
          price: 369,
          isVeg: true,
          image: "🥗",
          rating: 4.6
        },
        {
          id: "pz_v6",
          name: "Cheese N Corn",
          description: "Golden corn with extra cheese",
          price: 279,
          isVeg: true,
          image: "🌽",
          rating: 4.5
        },
        {
          id: "pz_v7",
          name: "Paneer Makhani",
          description: "Paneer in makhani gravy base",
          price: 349,
          isVeg: true,
          image: "🧈",
          rating: 4.7
        },
        {
          id: "pz_v8",
          name: "Tandoori Paneer",
          description: "Tandoori spiced paneer with onion",
          price: 359,
          isVeg: true,
          image: "🔥",
          rating: 4.6
        },
        {
          id: "pz_v9",
          name: "Veggie Paradise",
          description: "Mushroom, corn, olive, jalapeno",
          price: 339,
          isVeg: true,
          image: "🫒",
          rating: 4.4
        },
        {
          id: "pz_v10",
          name: "Four Cheese",
          description: "Mozzarella, cheddar, parmesan, blue cheese",
          price: 399,
          isVeg: true,
          image: "🧀",
          rating: 4.7
        }
      ]
    },

    {
      name: "Non-Veg Pizzas",
      items: [
        {
          id: "pz_nv1",
          name: "Pepper Barbecue Chicken",
          description: "Chicken with BBQ sauce and onion",
          price: 359,
          isVeg: false,
          isBestseller: true,
          image: "🍗",
          rating: 4.8
        },
        {
          id: "pz_nv2",
          name: "Chicken Tikka",
          description: "Tandoori chicken with onion and capsicum",
          price: 379,
          isVeg: false,
          image: "🔥",
          rating: 4.7
        },
        {
          id: "pz_nv3",
          name: "Chicken Sausage",
          description: "Chicken sausage with cheese",
          price: 339,
          isVeg: false,
          image: "🌭",
          rating: 4.5
        },
        {
          id: "pz_nv4",
          name: "Chicken Dominator",
          description: "Loaded with 5 chicken toppings",
          price: 429,
          isVeg: false,
          image: "👑",
          rating: 4.8
        },
        {
          id: "pz_nv5",
          name: "Keema Do Pyaza",
          description: "Minced chicken with double onion",
          price: 389,
          isVeg: false,
          image: "🧅",
          rating: 4.6
        },
        {
          id: "pz_nv6",
          name: "Pepperoni",
          description: "Classic pepperoni with cheese",
          price: 399,
          isVeg: false,
          image: "🍕",
          rating: 4.7
        },
        {
          id: "pz_nv7",
          name: "Meat Lovers",
          description: "Pepperoni, sausage, bacon, ham",
          price: 459,
          isVeg: false,
          image: "🥩",
          rating: 4.6
        },
        {
          id: "pz_nv8",
          name: "Buffalo Chicken",
          description: "Spicy buffalo sauce with chicken",
          price: 369,
          isVeg: false,
          image: "🌶️",
          rating: 4.5
        }
      ]
    },

    {
      name: "Signature Pizzas",
      items: [
        {
          id: "pz_sig1",
          name: "Peri Peri Chicken",
          description: "Spicy peri peri sauce with chicken",
          price: 379,
          isVeg: false,
          image: "🌶️",
          rating: 4.7,
          tags: ["Spicy"]
        },
        {
          id: "pz_sig2",
          name: "Butter Chicken Pizza",
          description: "Pizza with butter chicken gravy",
          price: 399,
          isVeg: false,
          image: "🍗",
          rating: 4.8
        },
        {
          id: "pz_sig3",
          name: "Makhani Paneer",
          description: "Paneer makhani with extra cheese",
          price: 369,
          isVeg: true,
          image: "🧀",
          rating: 4.7
        },
        {
          id: "pz_sig4",
          name: "Hawaiian",
          description: "Ham/bacon with pineapple",
          price: 349,
          isVeg: false,
          image: "🍍",
          rating: 4.4
        },
        {
          id: "pz_sig5",
          name: "Supreme",
          description: "All premium toppings loaded",
          price: 449,
          isVeg: true,
          image: "⭐",
          rating: 4.6
        },
        {
          id: "pz_sig6",
          name: "Mexican Fiesta",
          description: "Salsa base with beans, corn, jalapeno",
          price: 339,
          isVeg: true,
          image: "🌮",
          rating: 4.5
        }
      ]
    },

    {
      name: "Sides",
      items: [
        {
          id: "pz_sd1",
          name: "Garlic Bread",
          description: "Toasted bread with garlic butter",
          price: 129,
          isVeg: true,
          image: "🥖",
          rating: 4.5,
          variants: [
            { name: "Sticks", price: 129 },
            { name: "Cheese", price: 159 }
          ]
        },
        {
          id: "pz_sd2",
          name: "Stuffed Garlic Bread",
          description: "Cheese stuffed garlic bread",
          price: 189,
          isVeg: true,
          image: "🧄",
          rating: 4.6
        },
        {
          id: "pz_sd3",
          name: "Pasta Arrabiata",
          description: "Penne in spicy tomato sauce",
          price: 219,
          isVeg: true,
          image: "🍝",
          rating: 4.4
        },
        {
          id: "pz_sd4",
          name: "Pasta Alfredo",
          description: "Creamy white sauce pasta",
          price: 239,
          isVeg: true,
          image: "🍜",
          rating: 4.5
        },
        {
          id: "pz_sd5",
          name: "Chicken Wings",
          description: "BBQ/Peri Peri wings",
          price: 249,
          isVeg: false,
          image: "🍗",
          rating: 4.6
        },
        {
          id: "pz_sd6",
          name: "Potato Wedges",
          description: "Seasoned potato wedges",
          price: 129,
          isVeg: true,
          image: "🥔",
          rating: 4.4
        },
        {
          id: "pz_sd7",
          name: "Cheese Dip",
          description: "Creamy cheese dip",
          price: 49,
          isVeg: true,
          image: "🧀",
          rating: 4.3
        },
        {
          id: "pz_sd8",
          name: "Jalapeno Cheese Poppers",
          description: "Crispy cheese bites with jalapeno",
          price: 159,
          isVeg: true,
          image: "🌶️",
          rating: 4.5
        }
      ]
    },

    {
      name: "Desserts",
      items: [
        {
          id: "pz_d1",
          name: "Choco Lava Cake",
          description: "Molten chocolate center cake",
          price: 109,
          isVeg: true,
          isBestseller: true,
          image: "🍫",
          rating: 4.8
        },
        {
          id: "pz_d2",
          name: "Brownie Sundae",
          description: "Warm brownie with ice cream",
          price: 149,
          isVeg: true,
          image: "🍨",
          rating: 4.7
        },
        {
          id: "pz_d3",
          name: "Chocolate Mousse",
          description: "Creamy chocolate dessert",
          price: 129,
          isVeg: true,
          image: "🍮",
          rating: 4.5
        },
        {
          id: "pz_d4",
          name: "Tiramisu",
          description: "Classic Italian coffee dessert",
          price: 179,
          isVeg: true,
          image: "☕",
          rating: 4.6
        }
      ]
    },

    {
      name: "Beverages",
      items: [
        {
          id: "pz_b1",
          name: "Pepsi/Coke",
          description: "500ml cold drink",
          price: 60,
          isVeg: true,
          image: "🥤",
          rating: 4.3
        },
        {
          id: "pz_b2",
          name: "Mountain Dew",
          description: "500ml bottle",
          price: 60,
          isVeg: true,
          image: "🥤",
          rating: 4.2
        },
        {
          id: "pz_b3",
          name: "Cold Coffee",
          description: "Chilled coffee with ice cream",
          price: 129,
          isVeg: true,
          image: "☕",
          rating: 4.5
        },
        {
          id: "pz_b4",
          name: "Mojito",
          description: "Virgin mint lime mocktail",
          price: 99,
          isVeg: true,
          image: "🍃",
          rating: 4.4
        },
        {
          id: "pz_b5",
          name: "Orange Juice",
          description: "Fresh orange juice",
          price: 89,
          isVeg: true,
          image: "🍊",
          rating: 4.5
        }
      ]
    },

    {
      name: "Combos",
      items: [
        {
          id: "pz_c1",
          name: "Veg Combo",
          description: "2 Medium Pizzas + Garlic Bread + 2 Pepsi",
          price: 699,
          isVeg: true,
          isBestseller: true,
          image: "🍕",
          rating: 4.7,
          tags: ["Best Value"]
        },
        {
          id: "pz_c2",
          name: "Non-Veg Combo",
          description: "2 Medium Pizzas + Wings + 2 Pepsi",
          price: 799,
          isVeg: false,
          image: "🍗",
          rating: 4.6
        },
        {
          id: "pz_c3",
          name: "Family Feast",
          description: "2 Large Pizzas + 2 Sides + 4 Drinks + Dessert",
          price: 1199,
          isVeg: true,
          image: "👨‍👩‍👧‍👦",
          rating: 4.8,
          tags: ["Best Value"]
        },
        {
          id: "pz_c4",
          name: "Meal for 2",
          description: "1 Medium Pizza + 1 Side + 2 Drinks",
          price: 449,
          isVeg: true,
          image: "👫",
          rating: 4.5
        },
        {
          id: "pz_c5",
          name: "Party Pack",
          description: "4 Medium Pizzas + 4 Sides + 4 Drinks",
          price: 1499,
          isVeg: true,
          image: "🎉",
          rating: 4.7
        }
      ]
    }
  ],

  crustOptions: [
    { name: "Classic Hand Tossed", price: 0 },
    { name: "Cheese Burst", price: 50 },
    { name: "Thin Crust", price: 0 },
    { name: "Pan Pizza", price: 30 },
    { name: "Stuffed Crust", price: 70 }
  ],

  toppings: [
    { name: "Extra Cheese", price: 40 },
    { name: "Mushroom", price: 35 },
    { name: "Jalapeno", price: 30 },
    { name: "Onion", price: 25 },
    { name: "Corn", price: 25 },
    { name: "Olives", price: 35 },
    { name: "Paneer", price: 50 },
    { name: "Chicken", price: 60 }
  ],

  dips: [
    { name: "Cheese Dip", price: 49 },
    { name: "Peri Peri Dip", price: 49 },
    { name: "Garlic Mayo", price: 49 },
    { name: "Tomato Ketchup", price: 0 }
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
  window.PizzaMenu = PizzaMenu;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PizzaMenu;
}
