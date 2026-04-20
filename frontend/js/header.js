/**
 * Header Component with Geolocation and Auth
 */

const Header = {
  init() {
    this.setupLocationDetection();
    this.setupEventListeners();
    this.updateCartBadge();
  },

  // ========== GEOLOCATION ==========
  setupLocationDetection() {
    const locationText = document.getElementById('locationText');
    
    // Check if location is already saved
    const saved = localStorage.getItem('location');
    if (saved) {
      const loc = JSON.parse(saved);
      this.updateLocationDisplay(loc.address);
      return;
    }

    // Try to detect location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => this.handleLocationSuccess(position),
        (error) => this.handleLocationError(error),
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      this.updateLocationDisplay('Location not available');
    }
  },

  async handleLocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    
    try {
      // Use Google Geocoding API
      const apiKey = window.CONFIG?.GOOGLE_MAPS_API_KEY || '';
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const address = data.results[0].formatted_address;
        const shortAddress = this.formatAddress(address);
        
        // Save location
        AppState.setLocation(shortAddress, latitude, longitude);
        this.updateLocationDisplay(shortAddress);
      } else {
        this.updateLocationDisplay(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      this.updateLocationDisplay('Current Location');
    }
  },

  handleLocationError(error) {
    console.error('Location error:', error);
    let message = 'Location unavailable';
    
    switch(error.code) {
      case error.PERMISSION_DENIED:
        message = 'Enable location access';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location unavailable';
        break;
      case error.TIMEOUT:
        message = 'Location timeout';
        break;
    }
    
    this.updateLocationDisplay(message);
  },

  formatAddress(fullAddress) {
    // Extract main parts: locality, city
    const parts = fullAddress.split(',');
    if (parts.length >= 3) {
      return `${parts[0].trim()}, ${parts[1].trim()}`;
    }
    return fullAddress.substring(0, 40) + '...';
  },

  updateLocationDisplay(address) {
    const locationText = document.getElementById('locationText');
    if (locationText) {
      locationText.textContent = address;
    }
  },

  // ========== EVENT LISTENERS ==========
  setupEventListeners() {
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        AppState.showLoginModal();
      });
    }

    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        this.openCartSidebar();
      });
    }

    // Location selector
    const locationSelector = document.getElementById('locationSelector');
    if (locationSelector) {
      locationSelector.addEventListener('click', () => {
        this.openLocationModal();
      });
    }

    // Close modals on overlay click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  },

  // ========== CART SIDEBAR ==========
  openCartSidebar() {
    const cart = AppState.cart;
    
    if (cart.items.length === 0) {
      Utils.showToast('Your cart is empty', 'info');
      return;
    }

    // Create cart sidebar if not exists
    let sidebar = document.getElementById('cartSidebar');
    if (!sidebar) {
      sidebar = document.createElement('div');
      sidebar.id = 'cartSidebar';
      sidebar.className = 'cart-sidebar';
      document.body.appendChild(sidebar);
    }

    this.renderCartSidebar(sidebar);
    sidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  renderCartSidebar(sidebar) {
    const cart = AppState.cart;
    
    sidebar.innerHTML = `
      <div class="cart-header">
        <h3><i class="fas fa-shopping-cart"></i> Your Cart</h3>
        <button class="btn btn-ghost" onclick="Header.closeCartSidebar()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="cart-body">
        ${cart.restaurant ? `
          <div class="cart-restaurant">
            <img src="${cart.restaurant.logo || CONFIG.PLACEHOLDER_IMAGE}" alt="${cart.restaurant.name}">
            <span>${cart.restaurant.name}</span>
          </div>
        ` : ''}
        <div class="cart-items">
          ${cart.items.map(item => `
            <div class="cart-item">
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                ${item.variant ? `<div class="cart-item-variant">${item.variant.name}</div>` : ''}
                <div class="cart-item-price">₹${item.price}</div>
              </div>
              <div class="cart-item-controls">
                <button class="btn btn-sm btn-outline" onclick="AppState.updateQuantity('${item.id}', ${JSON.stringify(item.variant)}, ${JSON.stringify(item.addons)}, ${item.quantity - 1}); Header.updateCartUI()">-</button>
                <span>${item.quantity}</span>
                <button class="btn btn-sm btn-outline" onclick="AppState.updateQuantity('${item.id}', ${JSON.stringify(item.variant)}, ${JSON.stringify(item.addons)}, ${item.quantity + 1}); Header.updateCartUI()">+</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total</span>
          <span class="total-amount">₹${cart.total.toFixed(2)}</span>
        </div>
        <a href="checkout.html" class="btn btn-primary btn-block" onclick="Header.closeCartSidebar()">
          Proceed to Checkout
        </a>
      </div>
    `;
  },

  closeCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) {
      sidebar.classList.remove('open');
      document.body.style.overflow = '';
    }
  },

  updateCartUI() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      this.renderCartSidebar(sidebar);
    }
    AppState.updateCartBadge();
  },

  updateCartBadge() {
    AppState.updateCartBadge();
  },

  // ========== LOCATION MODAL ==========
  openLocationModal() {
    let modal = document.getElementById('locationModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'locationModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h3><i class="fas fa-map-marker-alt"></i> Select Location</h3>
            <button class="btn btn-ghost" onclick="document.getElementById('locationModal').style.display='none'">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="location-detect" onclick="Header.detectLocation()">
              <i class="fas fa-crosshairs"></i>
              <span>Detect My Location</span>
            </div>
            <div class="location-divider">OR</div>
            <input type="text" class="form-input" placeholder="Search for area, street, landmark..." id="locationSearch">
            <div class="saved-locations" id="savedLocations"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  },

  async detectLocation() {
    Utils.showToast('Detecting location...', 'info');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.handleLocationSuccess(position);
          document.getElementById('locationModal').style.display = 'none';
          Utils.showToast('Location updated!', 'success');
        },
        (error) => {
          this.handleLocationError(error);
          Utils.showToast('Could not detect location', 'error');
        }
      );
    }
  }
};

// Initialize
window.Header = Header;
document.addEventListener('DOMContentLoaded', () => {
  Header.init();
});
