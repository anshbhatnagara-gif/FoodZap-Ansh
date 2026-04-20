/**
 * Configuration
 * Global settings and constants
 */

const CONFIG = {
  // API Configuration
  API_BASE_URL: 'http://localhost:5000/api',
  
  // App Settings
  APP_NAME: 'FoodZap',
  APP_VERSION: '1.0.0',
  
  // Default Location (Delhi)
  DEFAULT_LAT: 28.6139,
  DEFAULT_LNG: 77.2090,
  DEFAULT_CITY: 'Delhi',
  
  // Pagination
  ITEMS_PER_PAGE: 20,
  
  // Cache Duration (in minutes)
  CACHE_DURATION: 5,
  
  // Image Placeholder
  PLACEHOLDER_IMAGE: 'https://via.placeholder.com/400x300?text=No+Image',
  
  // Food Categories
  FOOD_CATEGORIES: [
    { id: 'north-indian', name: 'North Indian', icon: '🍛' },
    { id: 'south-indian', name: 'South Indian', icon: '🍘' },
    { id: 'chinese', name: 'Chinese', icon: '🥡' },
    { id: 'italian', name: 'Italian', icon: '🍝' },
    { id: 'biryani', name: 'Biryani', icon: '🍚' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'burger', name: 'Burger', icon: '🍔' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' },
    { id: 'street-food', name: 'Street Food', icon: '🥪' }
  ],
  
  // Order Status
  ORDER_STATUS: {
    pending: { label: 'Pending', color: '#fdcb6e', icon: 'fa-clock' },
    confirmed: { label: 'Confirmed', color: '#74b9ff', icon: 'fa-check' },
    preparing: { label: 'Preparing', color: '#00b894', icon: 'fa-fire' },
    ready: { label: 'Ready', color: '#00b894', icon: 'fa-box' },
    out_for_delivery: { label: 'Out for Delivery', color: '#e17055', icon: 'fa-motorcycle' },
    delivered: { label: 'Delivered', color: '#00b894', icon: 'fa-check-circle' },
    cancelled: { label: 'Cancelled', color: '#d63031', icon: 'fa-times-circle' }
  },
  
  // Payment Methods
  PAYMENT_METHODS: [
    { id: 'cod', name: 'Cash on Delivery', icon: 'fa-money-bill' },
    { id: 'upi', name: 'UPI / GPay / PhonePe', icon: 'fa-mobile-alt' },
    { id: 'card', name: 'Credit / Debit Card', icon: 'fa-credit-card' },
    { id: 'netbanking', name: 'Net Banking', icon: 'fa-university' }
  ],
  
  // Google Maps API Key
  GOOGLE_MAPS_API_KEY: 'AIzaSyBkWF4sx2W3bQ1cFddLXTbHMaDLsPR4jEs',
  
  // Google OAuth Client ID (get from https://console.cloud.google.com/)
  // TODO: Replace with your actual Google OAuth Client ID
  GOOGLE_CLIENT_ID: 'your_client_id.apps.googleusercontent.com'
};

// Make CONFIG available globally
window.CONFIG = CONFIG;
