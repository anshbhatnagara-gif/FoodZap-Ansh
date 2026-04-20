/**
 * Utilities
 * Helper functions and utilities
 */

const Utils = {
  /**
   * Format price in INR
   */
  formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  },
  
  /**
   * Format date
   */
  formatDate(date, options = {}) {
    const d = new Date(date);
    const defaultOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...options
    };
    return d.toLocaleDateString('en-IN', defaultOptions);
  },
  
  /**
   * Format time
   */
  formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  /**
   * Format relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(date) {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return this.formatDate(date);
  },
  
  /**
   * Format distance
   */
  formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  },
  
  /**
   * Format duration
   */
  formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  },
  
  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  /**
   * Generate random ID
   */
  generateId(prefix = '') {
    return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
  },
  
  /**
   * Deep clone object
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  
  /**
   * Get from localStorage with default
   */
  getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  /**
   * Set localStorage
   */
  setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  
  /**
   * Remove from localStorage
   */
  removeStorage(key) {
    localStorage.removeItem(key);
  },
  
  /**
   * Show toast notification
   */
  showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
      <i class="fas ${icons[type]}"></i>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove after duration
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
  
  /**
   * Show loading spinner
   */
  showLoading(element, message = 'Loading...') {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return;
    
    element.innerHTML = `
      <div style="text-align: center; padding: var(--lg);">
        <div style="font-size: 2rem; margin-bottom: var(--sm);">⏳</div>
        <p style="color: var(--dark-gray);">${message}</p>
      </div>
    `;
  },
  
  /**
   * Hide loading
   */
  hideLoading(element, content = '') {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return;
    
    element.innerHTML = content;
  },
  
  /**
   * Show error message
   */
  showError(element, message) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return;
    
    element.innerHTML = `
      <div style="text-align: center; padding: var(--lg);">
        <div style="font-size: 2rem; margin-bottom: var(--sm);">😕</div>
        <p style="color: var(--danger);">${message}</p>
      </div>
    `;
  },
  
  /**
   * Confirm dialog
   */
  confirm(message, callback) {
    if (window.confirm(message)) {
      callback();
    }
  },
  
  /**
   * Copy to clipboard
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Copied to clipboard!', 'success');
    } catch (err) {
      this.showToast('Failed to copy', 'error');
    }
  },
  
  /**
   * Download data as JSON
   */
  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
  
  /**
   * Parse query parameters
   */
  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },
  
  /**
   * Build URL with query parameters
   */
  buildUrl(base, params = {}) {
    const url = new URL(base, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });
    return url.pathname + url.search;
  },
  
  /**
   * Scroll to element
   */
  scrollTo(element, offset = 80) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  },
  
  /**
   * Lazy load images
   */
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => observer.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  },
  
  /**
   * Detect online/offline status
   */
  initNetworkStatus() {
    window.addEventListener('online', () => {
      this.showToast('You are back online!', 'success');
    });
    
    window.addEventListener('offline', () => {
      this.showToast('You are offline. Some features may not work.', 'warning');
    });
  },
  
  /**
   * Detect user's location
   */
  async detectLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  },
  
  /**
   * Save user location
   */
  saveUserLocation(location) {
    this.setStorage('userLocation', location);
  },
  
  /**
   * Get saved user location
   */
  getUserLocation() {
    return this.getStorage('userLocation', {
      lat: CONFIG.DEFAULT_LAT,
      lng: CONFIG.DEFAULT_LNG,
      city: CONFIG.DEFAULT_CITY
    });
  },
  
  /**
   * Get user's saved addresses
   */
  getSavedAddresses() {
    return this.getStorage('savedAddresses', []);
  },
  
  /**
   * Save address
   */
  saveAddress(address) {
    const addresses = this.getSavedAddresses();
    address.id = this.generateId('addr_');
    addresses.push(address);
    this.setStorage('savedAddresses', addresses);
    return address;
  },
  
  /**
   * Remove address
   */
  removeAddress(addressId) {
    const addresses = this.getSavedAddresses().filter(a => a.id !== addressId);
    this.setStorage('savedAddresses', addresses);
  },
  
  /**
   * Set default address
   */
  setDefaultAddress(addressId) {
    const addresses = this.getSavedAddresses().map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    this.setStorage('savedAddresses', addresses);
  },
  
  /**
   * Get default address
   */
  getDefaultAddress() {
    const addresses = this.getSavedAddresses();
    return addresses.find(a => a.isDefault) || addresses[0] || null;
  }
};

// Make Utils available globally
window.Utils = Utils;
