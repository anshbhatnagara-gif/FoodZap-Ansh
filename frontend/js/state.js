/**
 * FoodZap Global State Management
 * Handles Cart, User Auth, and App-wide state
 */

const AppState = {
  // User State
  user: null,
  isAuthenticated: false,
  
  // Cart State
  cart: {
    items: [],
    restaurant: null,
    total: 0
  },
  
  // Search/Filter State
  filters: {
    search: '',
    pureVeg: false,
    rating: null,
    cuisine: null
  },
  
  // Location State
  location: {
    address: null,
    lat: null,
    lng: null
  },

  // Initialize State from localStorage
  init() {
    this.loadUser();
    this.loadCart();
    this.loadFilters();
    this.updateUI();
  },

  // ========== USER AUTH ==========
  loadUser() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.user = JSON.parse(user);
      this.isAuthenticated = true;
    }
  },

  login(user, token) {
    this.user = user;
    this.isAuthenticated = true;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.updateUI();
    this.hideLoginModal();
  },

  logout() {
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.cart = { items: [], restaurant: null, total: 0 };
    localStorage.removeItem('cart');
    this.updateUI();
    window.location.href = 'index.html';
  },

  // ========== CART ==========
  loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cart = JSON.parse(saved);
    }
  },

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.updateCartBadge();
  },

  addToCart(item, restaurant) {
    // Check if adding from same restaurant
    if (this.cart.restaurant && this.cart.restaurant.id !== restaurant.id) {
      if (!confirm('Your cart has items from another restaurant. Replace them?')) {
        return false;
      }
      this.cart.items = [];
    }

    // Set restaurant if empty
    if (!this.cart.restaurant) {
      this.cart.restaurant = restaurant;
    }

    // Check if item already exists
    const existingIndex = this.cart.items.findIndex(i => 
      i.id === item.id && 
      JSON.stringify(i.variant) === JSON.stringify(item.variant) &&
      JSON.stringify(i.addons) === JSON.stringify(item.addons)
    );

    if (existingIndex > -1) {
      this.cart.items[existingIndex].quantity += item.quantity || 1;
    } else {
      this.cart.items.push({
        ...item,
        quantity: item.quantity || 1,
        price: item.price || 0
      });
    }

    this.calculateCartTotal();
    this.saveCart();
    this.showCartNotification(item.name);
    return true;
  },

  removeFromCart(itemId, variant = null, addons = null) {
    this.cart.items = this.cart.items.filter(i => 
      !(i.id === itemId && 
        JSON.stringify(i.variant) === JSON.stringify(variant) &&
        JSON.stringify(i.addons) === JSON.stringify(addons))
    );

    if (this.cart.items.length === 0) {
      this.cart.restaurant = null;
    }

    this.calculateCartTotal();
    this.saveCart();
  },

  updateQuantity(itemId, variant, addons, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(itemId, variant, addons);
      return;
    }

    const item = this.cart.items.find(i => 
      i.id === itemId && 
      JSON.stringify(i.variant) === JSON.stringify(variant) &&
      JSON.stringify(i.addons) === JSON.stringify(addons)
    );

    if (item) {
      item.quantity = quantity;
      this.calculateCartTotal();
      this.saveCart();
    }
  },

  calculateCartTotal() {
    this.cart.total = this.cart.items.reduce((sum, item) => {
      const itemPrice = item.price + (item.variant?.price || 0);
      const addonsPrice = (item.addons || []).reduce((a, addon) => a + addon.price, 0);
      return sum + ((itemPrice + addonsPrice) * item.quantity);
    }, 0);
  },

  clearCart() {
    this.cart = { items: [], restaurant: null, total: 0 };
    this.saveCart();
  },

  getCartCount() {
    return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // ========== FILTERS ==========
  loadFilters() {
    const saved = localStorage.getItem('filters');
    if (saved) {
      this.filters = JSON.parse(saved);
    }
  },

  setFilter(key, value) {
    this.filters[key] = value;
    localStorage.setItem('filters', JSON.stringify(this.filters));
  },

  resetFilters() {
    this.filters = { search: '', pureVeg: false, rating: null, cuisine: null };
    localStorage.removeItem('filters');
  },

  filterRestaurants(restaurants) {
    return restaurants.filter(r => {
      // Search filter
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(search);
        const matchesCuisine = r.cuisine?.some(c => c.toLowerCase().includes(search));
        const matchesDish = r.menu?.some(m => m.name.toLowerCase().includes(search));
        if (!matchesName && !matchesCuisine && !matchesDish) return false;
      }

      // Pure Veg filter
      if (this.filters.pureVeg && !r.isPureVeg) return false;

      // Rating filter
      if (this.filters.rating && r.rating < this.filters.rating) return false;

      // Cuisine filter
      if (this.filters.cuisine && !r.cuisine?.includes(this.filters.cuisine)) return false;

      return true;
    });
  },

  // ========== LOCATION ==========
  setLocation(address, lat, lng) {
    this.location = { address, lat, lng };
    localStorage.setItem('location', JSON.stringify(this.location));
  },

  loadLocation() {
    const saved = localStorage.getItem('location');
    if (saved) {
      this.location = JSON.parse(saved);
    }
  },

  // ========== UI UPDATES ==========
  updateUI() {
    this.updateAuthUI();
    this.updateCartBadge();
    this.updateLocationUI();
  },

  updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const notificationBtn = document.getElementById('notificationBtn');

    if (this.isAuthenticated && this.user) {
      if (authButtons) authButtons.style.display = 'none';
      if (userMenu) {
        userMenu.style.display = 'block';
        const btn = document.getElementById('userDropdownBtn');
        if (btn) {
          btn.innerHTML = `<i class="fas fa-user"></i> ${this.user.name?.split(' ')[0] || ''}`;
        }
      }
      if (notificationBtn) notificationBtn.style.display = 'block';
    } else {
      if (authButtons) authButtons.style.display = 'block';
      if (userMenu) userMenu.style.display = 'none';
      if (notificationBtn) notificationBtn.style.display = 'none';
    }
  },

  updateCartBadge() {
    const badge = document.getElementById('cartCount');
    if (badge) {
      const count = this.getCartCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  updateLocationUI() {
    const locationText = document.getElementById('locationText');
    if (locationText && this.location.address) {
      locationText.textContent = this.location.address.substring(0, 30) + '...';
    }
  },

  showCartNotification(itemName) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--primary);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> Added <b>${itemName}</b> to cart`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  },

  // ========== LOGIN MODAL ==========
  showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  },

  hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  },

  toggleAuthMode() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authTitle = document.getElementById('authTitle');
    const authToggle = document.getElementById('authToggle');

    if (loginForm.style.display === 'none') {
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      authTitle.textContent = 'Welcome Back!';
      authToggle.innerHTML = 'Don\'t have an account? <a href="#" onclick="AppState.toggleAuthMode(); return false;">Sign up</a>';
    } else {
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
      authTitle.textContent = 'Create Account';
      authToggle.innerHTML = 'Already have an account? <a href="#" onclick="AppState.toggleAuthMode(); return false;">Log in</a>';
    }
  }
};

// Make available globally
window.AppState = AppState;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  AppState.init();
});
