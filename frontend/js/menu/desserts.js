/**
 * Desserts Menu
 * Indian sweets, cakes, ice creams, pastries
 */

const DessertsMenu = {
  restaurant: {
    name: "Sweet Tooth",
    cuisine: ["Desserts", "Sweets"],
    rating: 4.8,
    deliveryTime: "20-35 min",
    priceForTwo: 300,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
    isVeg: true,
    offers: ["Free Delivery above ₹200"]
  },

  categories: [
    {
      name: "Indian Sweets",
      items: [
        {
          id: "ds_i1",
          name: "Gulab Jamun",
          description: "Soft fried milk solids in sugar syrup",
          price: 90,
          isVeg: true,
          isBestseller: true,
          image: "🍮",
          rating: 4.8,
          variants: [
            { name: "2 pcs", price: 90 },
            { name: "4 pcs", price: 160 },
            { name: "8 pcs", price: 300 }
          ]
        },
        {
          id: "ds_i2",
          name: "Rasmalai",
          description: "Soft cottage cheese patties in saffron milk",
          price: 120,
          isVeg: true,
          isBestseller: true,
          image: "🥛",
          rating: 4.9
        },
        {
          id: "ds_i3",
          name: "Kaju Katli",
          description: "Diamond shaped cashew fudge",
          price: 400,
          isVeg: true,
          image: "💎",
          rating: 4.7,
          variants: [
            { name: "250g", price: 250 },
            { name: "500g", price: 400 },
            { name: "1kg", price: 750 }
          ]
        },
        {
          id: "ds_i4",
          name: "Rasgulla",
          description: "Spongy cottage cheese balls in syrup",
          price: 100,
          isVeg: true,
          image: "⚪",
          rating: 4.6
        },
        {
          id: "ds_i5",
          name: "Jalebi",
          description: "Crispy spiral in sugar syrup",
          price: 80,
          isVeg: true,
          image: "🍥",
          rating: 4.5,
          variants: [
            { name: "250g", price: 80 },
            { name: "500g", price: 150 }
          ]
        },
        {
          id: "ds_i6",
          name: "Motichoor Ladoo",
          description: "Tiny boondi balls sweet",
          price: 45,
          isVeg: true,
          image: "🟠",
          rating: 4.6
        },
        {
          id: "ds_i7",
          name: "Kheer",
          description: "Rice pudding with nuts",
          price: 100,
          isVeg: true,
          image: "🍚",
          rating: 4.5
        },
        {
          id: "ds_i8",
          name: "Gajar Ka Halwa",
          description: "Carrot pudding with ghee and nuts",
          price: 130,
          isVeg: true,
          image: "🥕",
          rating: 4.8,
          tags: ["Seasonal"]
        },
        {
          id: "ds_i9",
          name: "Besan Ladoo",
          description: "Gram flour sweet balls",
          price: 40,
          isVeg: true,
          image: "🟡",
          rating: 4.4
        },
        {
          id: "ds_i10",
          name: "Peda",
          description: "Milk fudge sweet",
          price: 50,
          isVeg: true,
          image: "🍬",
          rating: 4.5
        },
        {
          id: "ds_i11",
          name: "Barfi",
          description: "Milk based fudge squares",
          price: 80,
          isVeg: true,
          image: "🍥",
          rating: 4.4,
          variants: [
            { name: "Plain", price: 80 },
            { name: "Pista", price: 100 },
            { name: "Chocolate", price: 90 }
          ]
        },
        {
          id: "ds_i12",
          name: "Soan Papdi",
          description: "Flaky sweet with gram flour",
          price: 120,
          isVeg: true,
          image: "🟨",
          rating: 4.3
        }
      ]
    },

    {
      name: "Ice Creams",
      items: [
        {
          id: "ds_ic1",
          name: "Kulfi",
          description: "Traditional Indian ice cream",
          price: 80,
          isVeg: true,
          isBestseller: true,
          image: "🍦",
          rating: 4.7,
          variants: [
            { name: "Malai", price: 80 },
            { name: "Mango", price: 90 },
            { name: "Pista", price: 90 },
            { name: "Kesar Pista", price: 100 }
          ]
        },
        {
          id: "ds_ic2",
          name: "Ice Cream Sundae",
          description: "Ice cream with toppings and sauce",
          price: 180,
          isVeg: true,
          image: "🍨",
          rating: 4.8,
          variants: [
            { name: "Chocolate", price: 180 },
            { name: "Strawberry", price: 170 },
            { name: "Butterscotch", price: 180 }
          ]
        },
        {
          id: "ds_ic3",
          name: "Ice Cream Scoop",
          description: "Single scoop premium ice cream",
          price: 80,
          isVeg: true,
          image: "🍨",
          rating: 4.5,
          variants: [
            { name: "Vanilla", price: 80 },
            { name: "Chocolate", price: 90 },
            { name: "Strawberry", price: 80 },
            { name: "Butterscotch", price: 90 },
            { name: "Black Currant", price: 100 }
          ]
        },
        {
          id: "ds_ic4",
          name: "Falooda",
          description: "Vermicelli dessert with ice cream",
          price: 150,
          isVeg: true,
          image: "🍹",
          rating: 4.7
        },
        {
          id: "ds_ic5",
          name: "Ice Cream Shake",
          description: "Thick milkshake with ice cream",
          price: 160,
          isVeg: true,
          image: "🥤",
          rating: 4.6
        },
        {
          id: "ds_ic6",
          name: "Ice Cream Cake",
          description: "Cake with ice cream layers",
          price: 450,
          isVeg: true,
          image: "🎂",
          rating: 4.8
        },
        {
          id: "ds_ic7",
          name: "Gadbad",
          description: "Ice cream sundae with fruits and jelly",
          price: 200,
          isVeg: true,
          image: "🍨",
          rating: 4.6
        }
      ]
    },

    {
      name: "Cakes & Pastries",
      items: [
        {
          id: "ds_ck1",
          name: "Black Forest Cake",
          description: "Chocolate cake with cherries and cream",
          price: 450,
          isVeg: true,
          isBestseller: true,
          image: "🍰",
          rating: 4.8,
          variants: [
            { name: "500g", price: 450 },
            { name: "1kg", price: 850 }
          ]
        },
        {
          id: "ds_ck2",
          name: "Chocolate Truffle Cake",
          description: "Rich dark chocolate cake",
          price: 500,
          isVeg: true,
          image: "🍫",
          rating: 4.9
        },
        {
          id: "ds_ck3",
          name: "Red Velvet Cake",
          description: "Classic red velvet with cream cheese",
          price: 550,
          isVeg: true,
          image: "🎂",
          rating: 4.7
        },
        {
          id: "ds_ck4",
          name: "Butterscotch Cake",
          description: "Caramel flavored cake",
          price: 400,
          isVeg: true,
          image: "🍮",
          rating: 4.6
        },
        {
          id: "ds_ck5",
          name: "Pineapple Cake",
          description: "Fresh pineapple flavored cake",
          price: 380,
          isVeg: true,
          image: "🍍",
          rating: 4.5
        },
        {
          id: "ds_ck6",
          name: "Chocolate Pastry",
          description: "Single serve chocolate cake",
          price: 120,
          isVeg: true,
          image: "🧁",
          rating: 4.6
        },
        {
          id: "ds_ck7",
          name: "Strawberry Pastry",
          description: "Fresh strawberry cream pastry",
          price: 100,
          isVeg: true,
          image: "🍓",
          rating: 4.5
        },
        {
          id: "ds_ck8",
          name: "Black Forest Pastry",
          description: "Single serve black forest",
          price: 110,
          isVeg: true,
          image: "🍰",
          rating: 4.6
        },
        {
          id: "ds_ck9",
          name: "Choco Lava Cake",
          description: "Warm cake with molten chocolate",
          price: 140,
          isVeg: true,
          image: "🌋",
          rating: 4.8
        },
        {
          id: "ds_ck10",
          name: "Tiramisu",
          description: "Italian coffee dessert",
          price: 200,
          isVeg: true,
          image: "☕",
          rating: 4.7
        }
      ]
    },

    {
      name: "Cookies & Brownies",
      items: [
        {
          id: "ds_br1",
          name: "Chocolate Brownie",
          description: "Warm chocolate brownie with nuts",
          price: 150,
          isVeg: true,
          isBestseller: true,
          image: "🍫",
          rating: 4.7
        },
        {
          id: "ds_br2",
          name: "Walnut Brownie",
          description: "Brownie with walnut crunch",
          price: 170,
          isVeg: true,
          image: "🥜",
          rating: 4.6
        },
        {
          id: "ds_br3",
          name: "Brownie Sundae",
          description: "Brownie with ice cream",
          price: 220,
          isVeg: true,
          image: "🍨",
          rating: 4.8
        },
        {
          id: "ds_br4",
          name: "Chocolate Chip Cookies",
          description: "Fresh baked cookies",
          price: 120,
          isVeg: true,
          image: "🍪",
          rating: 4.5,
          variants: [
            { name: "3 pcs", price: 90 },
            { name: "6 pcs", price: 160 },
            { name: "12 pcs", price: 300 }
          ]
        },
        {
          id: "ds_br5",
          name: "Oatmeal Cookies",
          description: "Healthy oatmeal raisin cookies",
          price: 100,
          isVeg: true,
          image: "🥣",
          rating: 4.4
        },
        {
          id: "ds_br6",
          name: "Almond Cookies",
          description: "Buttery almond cookies",
          price: 130,
          isVeg: true,
          image: "🥜",
          rating: 4.5
        }
      ]
    },

    {
      name: "Mithai Boxes",
      items: [
        {
          id: "ds_mb1",
          name: "Assorted Mithai Box",
          description: "Mixed Indian sweets 500g",
          price: 450,
          isVeg: true,
          isBestseller: true,
          image: "🎁",
          rating: 4.8
        },
        {
          id: "ds_mb2",
          name: "Premium Sweet Box",
          description: "Premium collection 1kg",
          price: 1200,
          isVeg: true,
          image: "🎁",
          rating: 4.9
        },
        {
          id: "ds_mb3",
          name: "Dry Fruit Sweets",
          description: "Cashew and almond based sweets",
          price: 800,
          isVeg: true,
          image: "🥜",
          rating: 4.7
        },
        {
          id: "ds_mb4",
          name: "Bengali Sweets Box",
          description: "Rosogolla, Sandesh, Cham Cham",
          price: 500,
          isVeg: true,
          image: "⚪",
          rating: 4.8
        }
      ]
    },

    {
      name: "Chocolate",
      items: [
        {
          id: "ds_ch1",
          name: "Chocolate Box",
          description: "Assorted chocolates",
          price: 350,
          isVeg: true,
          isBestseller: true,
          image: "🍫",
          rating: 4.7
        },
        {
          id: "ds_ch2",
          name: "Dark Chocolate Bar",
          description: "70% dark chocolate",
          price: 180,
          isVeg: true,
          image: "🍫",
          rating: 4.6
        },
        {
          id: "ds_ch3",
          name: "Milk Chocolate",
          description: "Creamy milk chocolate",
          price: 150,
          isVeg: true,
          image: "🍫",
          rating: 4.5
        },
        {
          id: "ds_ch4",
          name: "Ferrero Rocher",
          description: "Hazelnut chocolate balls",
          price: 400,
          isVeg: true,
          image: "🟤",
          rating: 4.9
        },
        {
          id: "ds_ch5",
          name: "Chocolate Truffles",
          description: "Ganache filled truffles",
          price: 280,
          isVeg: true,
          image: "🍬",
          rating: 4.7
        }
      ]
    }
  ],

  customization: {
    eggless: true,
    sugarFree: true,
    messageOnCake: true
  },

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
  }
};

if (typeof window !== 'undefined') {
  window.DessertsMenu = DessertsMenu;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DessertsMenu;
}
