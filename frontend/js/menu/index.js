/**
 * Menu Loader - Central hub for all menu modules
 * Imports and exports all cuisine menus
 */

const MenuLoader = {
  // All available menus
  menus: {},

  // Cuisine mapping
  cuisines: {
    'north-indian': { name: 'North Indian', file: 'north-indian.js', icon: '🍛' },
    'south-indian': { name: 'South Indian', file: 'south-indian.js', icon: '🥞' },
    'chinese': { name: 'Chinese', file: 'chinese.js', icon: '🍜' },
    'biryani': { name: 'Biryani', file: 'biryani.js', icon: '🍚' },
    'pizza': { name: 'Pizza', file: 'pizza.js', icon: '🍕' },
    'burger': { name: 'Burger', file: 'burger.js', icon: '🍔' },
    'desserts': { name: 'Desserts', file: 'desserts.js', icon: '🍰' },
    'beverages': { name: 'Beverages', file: 'beverages.js', icon: '🥤' }
  },

  // Initialize - load all menus from window objects
  init() {
    // Check for globally loaded menus
    if (typeof window !== 'undefined') {
      this.menus = {
        'north-indian': window.NorthIndianMenu,
        'south-indian': window.SouthIndianMenu,
        'chinese': window.ChineseMenu,
        'biryani': window.BiryaniMenu,
        'pizza': window.PizzaMenu,
        'burger': window.BurgerMenu,
        'desserts': window.DessertsMenu,
        'beverages': window.BeveragesMenu
      };
    }
    console.log('MenuLoader initialized:', Object.keys(this.menus).filter(k => this.menus[k]).length, 'menus loaded');
  },

  // Get specific menu
  getMenu(cuisine) {
    return this.menus[cuisine] || null;
  },

  // Get all menus
  getAllMenus() {
    return this.menus;
  },

  // Get all loaded cuisine names
  getLoadedCuisines() {
    return Object.keys(this.menus).filter(key => this.menus[key] !== undefined);
  },

  // Get menu item by ID from any menu
  getItemById(itemId) {
    for (const cuisine of Object.keys(this.menus)) {
      const menu = this.menus[cuisine];
      if (menu && menu.getItemById) {
        const item = menu.getItemById(itemId);
        if (item) return { ...item, cuisine, cuisineName: this.cuisines[cuisine]?.name };
      }
    }
    return null;
  },

  // Search across all menus
  searchAll(query) {
    const results = [];
    for (const cuisine of Object.keys(this.menus)) {
      const menu = this.menus[cuisine];
      if (menu && menu.searchItems) {
        const items = menu.searchItems(query).map(item => ({
          ...item,
          cuisine,
          cuisineName: this.cuisines[cuisine]?.name
        }));
        results.push(...items);
      }
    }
    return results;
  },

  // Get bestsellers from all menus
  getAllBestsellers(limit = 10) {
    const bestsellers = [];
    for (const cuisine of Object.keys(this.menus)) {
      const menu = this.menus[cuisine];
      if (menu && menu.getBestsellers) {
        const items = menu.getBestsellers().map(item => ({
          ...item,
          cuisine,
          cuisineName: this.cuisines[cuisine]?.name
        }));
        bestsellers.push(...items);
      }
    }
    return bestsellers.slice(0, limit);
  },

  // Get restaurants list for display
  getRestaurants() {
    return Object.keys(this.menus)
      .filter(key => this.menus[key])
      .map(key => {
        const menu = this.menus[key];
        const cuisine = this.cuisines[key];
        return {
          id: key,
          name: menu.restaurant?.name || cuisine.name,
          cuisine: menu.restaurant?.cuisine || [cuisine.name],
          rating: menu.restaurant?.rating || 4.0,
          deliveryTime: menu.restaurant?.deliveryTime || '30-45 min',
          priceForTwo: menu.restaurant?.priceForTwo || 300,
          image: menu.restaurant?.image || '',
          offers: menu.restaurant?.offers || [],
          isVeg: menu.restaurant?.isVeg || false,
          menuCount: menu.getAllItems ? menu.getAllItems().length : 0,
          icon: cuisine.icon
        };
      });
  },

  // Get restaurant by cuisine type
  getRestaurant(cuisine) {
    const menu = this.menus[cuisine];
    if (!menu) return null;

    const cuisineInfo = this.cuisines[cuisine];
    return {
      id: cuisine,
      name: menu.restaurant?.name || cuisineInfo.name,
      cuisine: menu.restaurant?.cuisine || [cuisineInfo.name],
      rating: menu.restaurant?.rating || 4.0,
      deliveryTime: menu.restaurant?.deliveryTime || '30-45 min',
      priceForTwo: menu.restaurant?.priceForTwo || 300,
      image: menu.restaurant?.image || '',
      offers: menu.restaurant?.offers || [],
      isVeg: menu.restaurant?.isVeg || false,
      icon: cuisineInfo.icon,
      fullMenu: menu
    };
  },

  // Get trending items (simulated with bestsellers + high rated)
  getTrendingItems(limit = 6) {
    const allItems = [];
    for (const cuisine of Object.keys(this.menus)) {
      const menu = this.menus[cuisine];
      if (menu && menu.getAllItems) {
        const items = menu.getAllItems()
          .filter(item => item.rating >= 4.5)
          .map(item => ({
            ...item,
            cuisine,
            cuisineName: this.cuisines[cuisine]?.name
          }));
        allItems.push(...items);
      }
    }
    // Sort by rating, take top items
    return allItems
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },

  // Get veg items across all menus
  getVegItems(limit = 10) {
    const vegItems = [];
    for (const cuisine of Object.keys(this.menus)) {
      const menu = this.menus[cuisine];
      if (menu && menu.getVegItems) {
        const items = menu.getVegItems().slice(0, 5).map(item => ({
          ...item,
          cuisine,
          cuisineName: this.cuisines[cuisine]?.name
        }));
        vegItems.push(...items);
      }
    }
    return vegItems.slice(0, limit);
  },

  // Render menu item card HTML
  renderItemCard(item, options = {}) {
    const showCuisine = options.showCuisine || false;
    const addButton = options.addButton !== false;
    const compact = options.compact || false;

    const cuisineTag = showCuisine ? `<span class="cuisine-tag">${item.cuisineName || ''}</span>` : '';
    const bestsellerBadge = item.isBestseller ? '<span class="badge bestseller">⭐ Bestseller</span>' : '';
    const vegBadge = `<span class="badge ${item.isVeg ? 'veg' : 'non-veg'}">${item.isVeg ? '🟢' : '🔴'}</span>`;

    if (compact) {
      return `
        <div class="menu-item compact" data-id="${item.id}" data-cuisine="${item.cuisine || ''}">
          <div class="item-icon">${item.image || '🍽️'}</div>
          <div class="item-info">
            <h4>${item.name} ${vegBadge}</h4>
            <p class="price">₹${item.price}</p>
          </div>
          ${addButton ? `<button class="btn-add" onclick="Cart.addItem('${item.id}', '${item.name}', ${item.price}, '${item.image || '🍽️'}')">+</button>` : ''}
        </div>
      `;
    }

    return `
      <div class="menu-item" data-id="${item.id}" data-cuisine="${item.cuisine || ''}">
        <div class="item-image">${item.image || '🍽️'}</div>
        <div class="item-details">
          <div class="item-header">
            <h3>${item.name}</h3>
            ${bestsellerBadge}
          </div>
          <p class="description">${item.description || ''}</p>
          <div class="item-meta">
            ${vegBadge}
            <span class="rating">⭐ ${item.rating || 4.0}</span>
            ${cuisineTag}
          </div>
          <div class="item-footer">
            <span class="price">₹${item.price}</span>
            ${item.variants ? `<span class="variants">${item.variants.length} variants</span>` : ''}
            ${addButton ? `<button class="btn-primary" onclick="Cart.addItem('${item.id}', '${item.name}', ${item.price}, '${item.image || '🍽️'}')">Add +</button>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  // Render category section
  renderCategory(category, cuisine) {
    if (!category || !category.items || category.items.length === 0) return '';

    const itemsHtml = category.items
      .map(item => this.renderItemCard({ ...item, cuisine }, { showCuisine: false }))
      .join('');

    return `
      <div class="menu-category" id="category-${category.name.toLowerCase().replace(/\s+/g, '-')}">
        <h2 class="category-title">${category.name}</h2>
        <p class="category-count">${category.items.length} items</p>
        <div class="items-grid">
          ${itemsHtml}
        </div>
      </div>
    `;
  },

  // Render full restaurant menu
  renderRestaurantMenu(cuisine) {
    const restaurant = this.getRestaurant(cuisine);
    if (!restaurant || !restaurant.fullMenu) {
      return '<div class="error">Menu not found</div>';
    }

    const menu = restaurant.fullMenu;
    const categoriesHtml = menu.categories
      .map(cat => this.renderCategory(cat, cuisine))
      .join('');

    return `
      <div class="restaurant-menu" data-cuisine="${cuisine}">
        <div class="restaurant-header" style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${restaurant.image}'); background-size: cover;">
          <div class="restaurant-info">
            <span class="cuisine-icon">${restaurant.icon}</span>
            <h1>${restaurant.name}</h1>
            <p class="cuisine-tags">${restaurant.cuisine.join(' • ')}</p>
            <div class="restaurant-meta">
              <span class="rating">⭐ ${restaurant.rating}</span>
              <span class="delivery">🕐 ${restaurant.deliveryTime}</span>
              <span class="price">₹${restaurant.priceForTwo} for two</span>
            </div>
            ${restaurant.offers.length ? `
              <div class="offers">
                ${restaurant.offers.map(o => `<span class="offer-tag">${o}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="menu-nav">
          ${menu.categories.map(cat => `
            <a href="#category-${cat.name.toLowerCase().replace(/\s+/g, '-')}" class="nav-link">${cat.name}</a>
          `).join('')}
        </div>

        <div class="menu-content">
          ${categoriesHtml}
        </div>
      </div>
    `;
  }
};

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
  window.MenuLoader = MenuLoader;
  
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MenuLoader.init());
  } else {
    MenuLoader.init();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MenuLoader;
}
