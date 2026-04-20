/**
 * API Service
 * Handles all backend API calls
 */

const API = {
  // Base URL from config
  baseURL: CONFIG.API_BASE_URL,
  
  /**
   * Generic fetch wrapper with error handling
   */
  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader()
      }
    };
    
    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  /**
   * Get auth token from storage
   */
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },
  
  /**
   * Authentication APIs
   */
  auth: {
    async register(data) {
      return API.fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    async login(data) {
      return API.fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    async sendOTP(phone) {
      return API.fetch('/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone })
      });
    },
    
    async verifyOTP(phone, otp) {
      return API.fetch('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, otp })
      });
    },
    
    async googleAuth(data) {
      return API.fetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    async getProfile() {
      return API.fetch('/auth/me');
    },
    
    async updateProfile(data) {
      return API.fetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    setToken(token) {
      localStorage.setItem('token', token);
    },
    
    getToken() {
      return localStorage.getItem('token');
    },
    
    removeToken() {
      localStorage.removeItem('token');
    },
    
    isAuthenticated() {
      return !!this.getToken();
    },
    
    logout() {
      this.removeToken();
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
    }
  },
  
  /**
   * Restaurant APIs
   */
  restaurants: {
    async getAll(params = {}) {
      const query = new URLSearchParams(params).toString();
      return API.fetch(`/restaurants?${query}`);
    },
    
    async getById(id, lat, lng) {
      const query = lat && lng ? `?lat=${lat}&lng=${lng}` : '';
      return API.fetch(`/restaurants/${id}${query}`);
    },
    
    async getMenu(id, params = {}) {
      const query = new URLSearchParams(params).toString();
      return API.fetch(`/restaurants/${id}/menu?${query}`);
    },
    
    async getPopular(lat, lng) {
      const query = lat && lng ? `?lat=${lat}&lng=${lng}` : '';
      return API.fetch(`/restaurants/popular${query}`);
    },
    
    async getFeatured() {
      return API.fetch('/restaurants/featured');
    }
  },
  
  /**
   * Menu Item APIs
   */
  menu: {
    async getById(id) {
      return API.fetch(`/restaurants/menu-item/${id}`);
    }
  },
  
  /**
   * Cart APIs
   */
  cart: {
    async get() {
      return API.fetch('/cart');
    },
    
    async add(item) {
      return API.fetch('/cart/add', {
        method: 'POST',
        body: JSON.stringify(item)
      });
    },
    
    async update(itemId, quantity) {
      return API.fetch(`/cart/item/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
    },
    
    async remove(itemId) {
      return API.fetch(`/cart/item/${itemId}`, {
        method: 'DELETE'
      });
    },
    
    async clear() {
      return API.fetch('/cart/clear', { method: 'DELETE' });
    },
    
    async applyCoupon(code) {
      return API.fetch('/cart/coupon', {
        method: 'POST',
        body: JSON.stringify({ code })
      });
    },
    
    async removeCoupon() {
      return API.fetch('/cart/coupon', { method: 'DELETE' });
    }
  },
  
  /**
   * Order APIs
   */
  orders: {
    async create(data) {
      return API.fetch('/orders', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    async getAll(params = {}) {
      const query = new URLSearchParams(params).toString();
      return API.fetch(`/orders?${query}`);
    },
    
    async getById(id) {
      return API.fetch(`/orders/${id}`);
    },
    
    async track(orderId) {
      return API.fetch(`/orders/track/${orderId}`);
    },
    
    async cancel(id, reason) {
      return API.fetch(`/orders/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
      });
    },
    
    async rate(id, data) {
      return API.fetch(`/orders/${id}/rate`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    async reorder(id) {
      return API.fetch(`/orders/${id}/reorder`, {
        method: 'POST'
      });
    }
  },
  
  /**
   * Payment APIs
   */
  payment: {
    async createOrder(orderId) {
      return API.fetch('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ orderId })
      });
    },
    
    async verify(data) {
      return API.fetch('/payments/verify', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    async getKey() {
      return API.fetch('/payments/key');
    }
  },
  
  /**
   * Location APIs
   */
  location: {
    async detect() {
      return API.fetch('/location/detect');
    },
    
    async geocode(address) {
      return API.fetch('/location/geocode', {
        method: 'POST',
        body: JSON.stringify({ address })
      });
    },
    
    async reverseGeocode(lat, lng) {
      return API.fetch(`/location/reverse-geocode?lat=${lat}&lng=${lng}`);
    },
    
    async getNearby(lat, lng, radius = 5000) {
      return API.fetch(`/location/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    },
    
    async calculateDistance(originLat, originLng, destLat, destLng) {
      return API.fetch(`/location/distance?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`);
    },
    
    async autocomplete(input, lat, lng) {
      let url = `/location/autocomplete?input=${encodeURIComponent(input)}`;
      if (lat && lng) url += `&lat=${lat}&lng=${lng}`;
      return API.fetch(url);
    }
  },
  
  /**
   * AI APIs
   */
  ai: {
    async suggestByMood(mood, location) {
      return API.fetch('/ai/suggest', {
        method: 'POST',
        body: JSON.stringify({ mood, location })
      });
    },
    
    async chat(message, history = []) {
      return API.fetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history })
      });
    },
    
    async getRecommendations() {
      return API.fetch('/ai/recommendations');
    },
    
    async getSmartRecommendations(limit = 10, includeTrending = true) {
      return API.fetch(`/ai/smart-recommendations?limit=${limit}&includeTrending=${includeTrending}`);
    },
    
    async getOrderAgain(limit = 5) {
      return API.fetch(`/ai/order-again?limit=${limit}`);
    },
    
    async getSearchSuggestions(query) {
      return API.fetch(`/ai/search-suggestions?query=${encodeURIComponent(query)}`);
    },
    
    async getTrending() {
      return API.fetch('/ai/trending');
    },
    
    async calculateETA(restaurantId, lat, lng, weather = 'clear') {
      return API.fetch('/ai/eta', {
        method: 'POST',
        body: JSON.stringify({ restaurantId, lat, lng, weather })
      });
    },
    
    async getOptimalTimes(restaurantId) {
      return API.fetch(`/ai/optimal-times?restaurantId=${restaurantId}`);
    }
  },
  
  /**
   * Wallet APIs
   */
  wallet: {
    async getWallet() {
      return API.fetch('/wallet');
    },
    
    async getBalance(amount) {
      return API.fetch(`/wallet/balance?amount=${amount}`);
    },
    
    async getTransactions(page = 1, limit = 20, filters = {}) {
      const query = new URLSearchParams({ page, limit, ...filters }).toString();
      return API.fetch(`/wallet/transactions?${query}`);
    },
    
    async addMoney(amount, paymentMethod, paymentId) {
      return API.fetch('/wallet/add-money', {
        method: 'POST',
        body: JSON.stringify({ amount, paymentMethod, paymentId })
      });
    },
    
    async updateAutoRecharge(settings) {
      return API.fetch('/wallet/auto-recharge', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
    },
    
    async getSubscriptionPlans() {
      return API.fetch('/wallet/subscription-plans');
    },
    
    async getSubscription() {
      return API.fetch('/wallet/subscription');
    },
    
    async subscribe(planId, cycle, paymentMethod) {
      return API.fetch('/wallet/subscribe', {
        method: 'POST',
        body: JSON.stringify({ planId, cycle, paymentMethod })
      });
    },
    
    async cancelSubscription(reason) {
      return API.fetch('/wallet/cancel-subscription', {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
    },
    
    async getCashbackSummary(days = 30) {
      return API.fetch(`/wallet/cashback-summary?days=${days}`);
    }
  },
  
  /**
   * Notification APIs
   */
  notifications: {
    async saveFCMToken(token, device = 'web') {
      return API.fetch('/notifications/fcm-token', {
        method: 'POST',
        body: JSON.stringify({ token, device })
      });
    },
    
    async getNotifications(limit = 50) {
      return API.fetch(`/notifications?limit=${limit}`);
    },
    
    async getUnreadCount() {
      return API.fetch('/notifications/unread-count');
    },
    
    async markAsRead(notificationIds = null) {
      return API.fetch('/notifications/mark-read', {
        method: 'PUT',
        body: JSON.stringify({ notificationIds })
      });
    },
    
    async deleteNotification(notificationId) {
      return API.fetch(`/notifications/${notificationId}`, {
        method: 'DELETE'
      });
    },
    
    async subscribeToTopic(topic) {
      return API.fetch('/notifications/subscribe-topic', {
        method: 'POST',
        body: JSON.stringify({ topic })
      });
    },
    
    async testNotification(type = 'ORDER_CONFIRMED') {
      return API.fetch('/notifications/test', {
        method: 'POST',
        body: JSON.stringify({ type })
      });
    }
  },
  
  /**
   * Grocery APIs
   */
  grocery: {
    async getCategories() {
      return API.fetch('/grocery/categories');
    },
    
    async getProducts(params = {}) {
      const query = new URLSearchParams(params).toString();
      return API.fetch(`/grocery/products?${query}`);
    },
    
    async getTrending() {
      return API.fetch('/grocery/trending');
    },
    
    async getOffers() {
      return API.fetch('/grocery/offers');
    }
  },
  
  /**
   * User APIs
   */
  user: {
    async getProfile() {
      return API.fetch('/users/profile');
    },
    
    async updateProfile(data) {
      return API.fetch('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    async updatePreferences(preferences) {
      return API.fetch('/users/preferences', {
        method: 'PUT',
        body: JSON.stringify({ dietaryPreferences: preferences })
      });
    },
    
    async getOrders() {
      return API.fetch('/users/orders');
    },
    
    async addToFavorites(type, id) {
      return API.fetch('/users/favorites', {
        method: 'POST',
        body: JSON.stringify({ type, id })
      });
    },
    
    async removeFromFavorites(type, id) {
      return API.fetch('/users/favorites', {
        method: 'DELETE',
        body: JSON.stringify({ type, id })
      });
    }
  },
  
  /**
   * Payment APIs (Razorpay)
   */
  payment: {
    async getKey() {
      return API.fetch('/payment/key');
    },
    
    async createOrder(orderId) {
      return API.fetch('/payment/order', {
        method: 'POST',
        body: JSON.stringify({ orderId })
      });
    },
    
    async verify(data) {
      return API.fetch('/payment/verify', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
  },
  
  /**
   * AI APIs (Gemini)
   */
  ai: {
    async chat(message, history = []) {
      return API.fetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history })
      });
    },
    
    async suggestByMood(mood, location) {
      return API.fetch('/ai/suggest', {
        method: 'POST',
        body: JSON.stringify({ mood, location })
      });
    }
  }
};

// Make API available globally
window.API = API;
