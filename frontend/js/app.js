/**
 * Main Application Module
 * Handles page initialization and common functionality
 */

const App = {
  user: null,
  location: null,
  notifications: [],
  unreadCount: 0,
  fcmToken: null,
  
  init() {
    this.checkAuth();
    this.initLocation();
    this.setupGlobalListeners();
    this.initNotifications();
    Utils.initNetworkStatus();
  },
  
  async initNotifications() {
    if (!API.auth.isAuthenticated()) return;
    
    // Show notification bell
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
      notificationBtn.style.display = 'block';
      this.setupNotificationDropdown(notificationBtn);
    }
    
    // Get unread count
    this.updateNotificationCount();
    
    // Setup WebSocket for real-time notifications
    this.setupNotificationSocket();
    
    // Request push notification permission
    this.requestNotificationPermission();
  },
  
  async updateNotificationCount() {
    try {
      const result = await API.notifications.getUnreadCount();
      if (result.success) {
        this.unreadCount = result.count;
        this.showNotificationBadge(result.count);
      }
    } catch (error) {
      console.log('Failed to get notification count');
    }
  },
  
  showNotificationBadge(count) {
    const badge = document.getElementById('notificationCount');
    if (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  },
  
  setupNotificationDropdown(button) {
    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'notificationDropdown';
    dropdown.className = 'notification-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      width: 360px;
      max-height: 500px;
      overflow-y: auto;
      display: none;
      z-index: 1000;
      margin-top: 8px;
    `;
    
    dropdown.innerHTML = `
      <div style="padding: 16px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 1.1rem;">Notifications</h3>
        <button onclick="App.markAllAsRead()" style="background: none; border: none; color: var(--primary); cursor: pointer; font-size: 0.85rem;">
          Mark all read
        </button>
      </div>
      <div id="notificationList" style="max-height: 400px; overflow-y: auto;">
        <div style="padding: 40px; text-align: center; color: var(--gray);">
          <i class="fas fa-bell" style="font-size: 2rem; margin-bottom: 12px; display: block;"></i>
          No notifications yet
        </div>
      </div>
      <div style="padding: 12px 16px; border-top: 1px solid #eee; text-align: center;">
        <a href="notifications.html" style="color: var(--primary); text-decoration: none; font-size: 0.9rem;">
          View All Notifications
        </a>
      </div>
    `;
    
    button.parentElement.appendChild(dropdown);
    
    // Toggle dropdown
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = dropdown.style.display === 'block';
      dropdown.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        this.loadNotifications();
      }
    });
    
    // Close on outside click
    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });
    
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  },
  
  async loadNotifications() {
    const list = document.getElementById('notificationList');
    if (!list) return;
    
    list.innerHTML = '<div style="padding: 40px; text-align: center;"><i class="fas fa-spinner fa-spin"></i></div>';
    
    try {
      const result = await API.notifications.getNotifications(10);
      if (result.success && result.data?.length > 0) {
        this.notifications = result.data;
        this.renderNotifications(list, result.data);
      } else {
        list.innerHTML = `
          <div style="padding: 40px; text-align: center; color: var(--gray);">
            <i class="fas fa-bell" style="font-size: 2rem; margin-bottom: 12px; display: block;"></i>
            No notifications yet
          </div>
        `;
      }
    } catch (error) {
      list.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--danger);">Failed to load notifications</div>';
    }
  },
  
  renderNotifications(container, notifications) {
    const icons = {
      'ORDER_CONFIRMED': '✅',
      'ORDER_PREPARING': '👨‍🍳',
      'ORDER_READY': '📦',
      'OUT_FOR_DELIVERY': '🚗',
      'ORDER_DELIVERED': '🍽️',
      'ORDER_CANCELLED': '❌',
      'PROMOTION': '🔥',
      'CHAT_MESSAGE': '💬'
    };
    
    container.innerHTML = notifications.map(n => `
      <div style="padding: 12px 16px; border-bottom: 1px solid #f5f5f5; cursor: pointer; ${n.read ? '' : 'background: rgba(255,107,107,0.05);'}"
           onmouseover="this.style.background='rgba(255,107,107,0.1)'" 
           onmouseout="this.style.background='${n.read ? '' : 'rgba(255,107,107,0.05)'}'"
           onclick="App.handleNotificationClick('${n._id}', '${n.data?.orderId || ''}', '${n.type}')">
        <div style="display: flex; gap: 12px; align-items: flex-start;">
          <span style="font-size: 1.5rem;">${icons[n.type] || '🔔'}</span>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 4px;">${n.title}</div>
            <div style="font-size: 0.85rem; color: var(--dark-gray); line-height: 1.4;">${n.body}</div>
            <div style="font-size: 0.75rem; color: var(--gray); margin-top: 6px;">
              ${Utils.formatRelativeTime(n.createdAt)}
            </div>
          </div>
          ${n.read ? '' : '<span style="width: 8px; height: 8px; background: var(--primary); border-radius: 50%; flex-shrink: 0;"></span>'}
        </div>
      </div>
    `).join('');
  },
  
  async handleNotificationClick(notificationId, orderId, type) {
    // Mark as read
    await API.notifications.markAsRead([notificationId]);
    this.updateNotificationCount();
    
    // Navigate based on type
    if (orderId) {
      window.location.href = `order-tracking.html?orderId=${orderId}`;
    } else if (type === 'PROMOTION') {
      window.location.href = 'offers.html';
    }
  },
  
  async markAllAsRead() {
    await API.notifications.markAsRead();
    this.updateNotificationCount();
    this.loadNotifications();
    Utils.showToast('All notifications marked as read', 'success');
  },
  
  setupNotificationSocket() {
    // Connect to WebSocket for real-time notifications
    const token = API.auth.getToken();
    if (!token) return;
    
    // Use Socket.IO if available
    if (typeof io !== 'undefined') {
      const socket = io(CONFIG.API_BASE_URL.replace('/api', ''), {
        auth: { token }
      });
      
      socket.on('notification', (data) => {
        this.handleRealtimeNotification(data);
      });
      
      socket.on('connect', () => {
        console.log('Notification socket connected');
      });
    }
  },
  
  handleRealtimeNotification(data) {
    // Show toast
    Utils.showToast(data.body, 'info');
    
    // Update badge
    this.unreadCount++;
    this.showNotificationBadge(this.unreadCount);
    
    // Play sound if enabled
    this.playNotificationSound();
  },
  
  playNotificationSound() {
    // Check if user has enabled sound
    const soundEnabled = localStorage.getItem('notificationSound') !== 'false';
    if (!soundEnabled) return;
    
    try {
      const audio = new Audio('/assets/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}
  },
  
  async requestNotificationPermission() {
    if (!('Notification' in window)) return;
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      this.setupFCM();
    }
  },
  
  async setupFCM() {
    // Firebase Cloud Messaging setup
    if (typeof firebase === 'undefined') return;
    
    try {
      const messaging = firebase.messaging();
      
      // Get FCM token
      const token = await messaging.getToken({
        vapidKey: 'YOUR_VAPID_KEY'
      });
      
      if (token) {
        this.fcmToken = token;
        // Save to server
        await API.notifications.saveFCMToken(token);
      }
      
      // Handle foreground messages
      messaging.onMessage((payload) => {
        console.log('Foreground message received:', payload);
        this.handleRealtimeNotification({
          title: payload.notification.title,
          body: payload.notification.body,
          ...payload.data
        });
      });
    } catch (error) {
      console.log('FCM setup failed:', error);
    }
  },
  
  async checkAuth() {
    const token = API.auth.getToken();
    
    if (token) {
      try {
        const result = await API.auth.getProfile();
        if (result.success) {
          this.user = result.user;
          localStorage.setItem('user', JSON.stringify(result.user));
          this.updateAuthUI(true);
        } else {
          this.handleAuthError();
        }
      } catch (error) {
        this.handleAuthError();
      }
    } else {
      this.updateAuthUI(false);
    }
  },
  
  handleAuthError() {
    API.auth.logout();
    this.updateAuthUI(false);
  },
  
  updateAuthUI(isAuthenticated) {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (authButtons && userMenu) {
      if (isAuthenticated && this.user) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        
        // Add user dropdown functionality
        const dropdownBtn = document.getElementById('userDropdownBtn');
        if (dropdownBtn && !dropdownBtn.dataset.initialized) {
          this.setupUserDropdown(dropdownBtn);
          dropdownBtn.dataset.initialized = 'true';
        }
      } else {
        authButtons.style.display = 'block';
        userMenu.style.display = 'none';
      }
    }
  },
  
  setupUserDropdown(button) {
    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 200px;
      padding: 8px 0;
      display: none;
      z-index: 1000;
    `;
    
    dropdown.innerHTML = `
      <div style="padding: 12px 16px; border-bottom: 1px solid #eee;">
        <div style="font-weight: 600;">${this.user?.name || 'User'}</div>
        <div style="font-size: 0.85rem; color: #666;">${this.user?.email || ''}</div>
      </div>
      <a href="profile.html" style="display: block; padding: 10px 16px; color: #333; text-decoration: none;">
        <i class="fas fa-user" style="width: 20px;"></i> Profile
      </a>
      <a href="orders.html" style="display: block; padding: 10px 16px; color: #333; text-decoration: none;">
        <i class="fas fa-box" style="width: 20px;"></i> My Orders
      </a>
      <a href="wallet.html" style="display: block; padding: 10px 16px; color: #333; text-decoration: none;">
        <i class="fas fa-wallet" style="width: 20px;"></i> Wallet
      </a>
      <a href="favorites.html" style="display: block; padding: 10px 16px; color: #333; text-decoration: none;">
        <i class="fas fa-heart" style="width: 20px;"></i> Favorites
      </a>
      <a href="addresses.html" style="display: block; padding: 10px 16px; color: #333; text-decoration: none;">
        <i class="fas fa-map-marker-alt" style="width: 20px;"></i> Addresses
      </a>
      <div style="border-top: 1px solid #eee; margin-top: 8px; padding-top: 8px;">
        <a href="#" onclick="App.logout(); return false;" style="display: block; padding: 10px 16px; color: #ff6b6b; text-decoration: none;">
          <i class="fas fa-sign-out-alt" style="width: 20px;"></i> Logout
        </a>
      </div>
    `;
    
    button.parentElement.style.position = 'relative';
    button.parentElement.appendChild(dropdown);
    
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = dropdown.style.display === 'block';
      dropdown.style.display = isVisible ? 'none' : 'block';
    });
    
    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });
  },
  
  logout() {
    API.auth.logout();
    Utils.showToast('Logged out successfully', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  },
  
  async initLocation() {
    // Try to get saved location first
    let location = Utils.getUserLocation();
    
    // Show default location immediately
    this.location = location;
    this.updateLocationUI();
    
    // Try to detect current location in background
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const detected = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            location = { ...location, ...detected };
            
            // Reverse geocode to get address
            const result = await API.location.reverseGeocode(detected.lat, detected.lng);
            if (result.success) {
              location.address = result.formattedAddress;
              location.city = result.address?.city || location.city;
            }
            
            this.location = location;
            Utils.saveUserLocation(location);
            this.updateLocationUI();
          } catch (error) {
            console.log('Reverse geocoding failed:', error);
          }
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          // Keep using default/saved location
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      console.log('Geolocation not supported');
    }
  },
  
  updateLocationUI() {
    const locationText = document.getElementById('locationText');
    if (locationText && this.location) {
      const display = this.location.address 
        ? this.location.address.split(',').slice(0, 2).join(',')
        : this.location.city || 'Select Location';
      locationText.textContent = display;
    }
    
    const locationSelector = document.getElementById('locationSelector');
    if (locationSelector) {
      locationSelector.addEventListener('click', () => {
        // Show location modal or redirect to location page
        const newAddress = prompt('Enter your delivery location:', this.location?.address || '');
        if (newAddress) {
          this.updateLocation(newAddress);
        }
      });
    }
  },
  
  async updateLocation(address) {
    try {
      const result = await API.location.geocode(address);
      if (result.success) {
        this.location = {
          lat: result.coordinates[1],
          lng: result.coordinates[0],
          address: result.formattedAddress,
          city: result.formattedAddress.split(',').pop()?.trim() || 'Unknown'
        };
        Utils.saveUserLocation(this.location);
        this.updateLocationUI();
        Utils.showToast('Location updated!', 'success');
        
        // Reload page data with new location
        if (typeof HomePage !== 'undefined') {
          HomePage.loadData();
        }
      }
    } catch (error) {
      Utils.showToast('Could not find location', 'error');
    }
  },
  
  setupGlobalListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value.trim();
          if (query) {
            window.location.href = `restaurants.html?search=${encodeURIComponent(query)}`;
          }
        }
      });
    }
    
    // Hero search
    const heroSearch = document.getElementById('heroSearch');
    if (heroSearch) {
      heroSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = heroSearch.value.trim();
          if (query) {
            window.location.href = `restaurants.html?search=${encodeURIComponent(query)}`;
          }
        }
      });
    }
  },
  
  requireAuth() {
    if (!API.auth.isAuthenticated()) {
      Utils.showToast('Please login to continue', 'warning');
      setTimeout(() => {
        window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 1500);
      return false;
    }
    return true;
  }
};

/**
 * Home Page Module
 */
const HomePage = {
  aiRecommendations: [],
  orderAgainItems: [],
  
  init() {
    App.init();
    Cart.init();
    AIChat.init();
    this.loadData();
    this.setupMoodButtons();
  },
  
  async loadData() {
    this.loadCategories();
    this.loadFeaturedRestaurants();
    this.loadTrendingItems();
    
    // If user is logged in, load AI recommendations
    if (API.auth.isAuthenticated()) {
      this.loadAIRecommendations();
      this.loadOrderAgain();
    }
    
    // Load popular restaurants with location filtering
    const location = Utils.getUserLocation();
    if (location.lat && location.lng) {
      this.loadPopularRestaurants(location.lat, location.lng);
    } else {
      this.loadPopularRestaurants();
    }
    
    this.loadOffers();
  },
  
  async loadAIRecommendations() {
    const container = document.getElementById('aiRecommendations');
    const section = document.getElementById('aiRecommendationsSection');
    const badge = document.getElementById('userPatternBadge');
    
    if (!container || !section) return;
    
    try {
      const result = await API.ai.getSmartRecommendations(8, true);
      
      if (result.success && result.recommendations?.length > 0) {
        this.aiRecommendations = result.recommendations;
        section.style.display = 'block';
        
        // Update badge with user pattern
        if (result.insights?.orderingPattern) {
          badge.textContent = result.insights.orderingPattern;
        }
        
        this.renderAIRecommendations(container, result.recommendations);
      }
    } catch (error) {
      console.log('AI recommendations not loaded:', error);
    }
  },
  
  renderAIRecommendations(container, recommendations) {
    container.innerHTML = recommendations.map(rec => {
      const item = rec.item;
      const restaurant = rec.restaurant;
      
      return `
        <div class="card" style="background: white; color: var(--black); cursor: pointer; transition: transform 0.2s;"
             onmouseover="this.style.transform='translateY(-4px)'" 
             onmouseout="this.style.transform='translateY(0)'"
             onclick="window.location.href='restaurant.html?id=${restaurant?._id || item?.restaurant}'">
          <div style="position: relative; height: 150px; overflow: hidden; border-radius: var(--radius-md) var(--radius-md) 0 0;">
            <img src="${item?.images?.[0] || CONFIG.PLACEHOLDER_IMAGE}" 
                 alt="${item?.name}" 
                 style="width: 100%; height: 100%; object-fit: cover;"
                 onerror="this.src='${CONFIG.PLACEHOLDER_IMAGE}'">
            ${rec.trending ? '<div style="position: absolute; top: 8px; left: 8px; background: #ff6b6b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;"><i class="fas fa-fire"></i> Trending</div>' : ''}
            <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">
              <i class="fas fa-brain" style="color: #667eea;"></i> ${Math.round(rec.confidence * 100)}% match
            </div>
          </div>
          <div style="padding: var(--sm);">
            <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 4px;">${item?.name}</div>
            <div style="font-size: 0.8rem; color: var(--dark-gray); margin-bottom: 4px;">${restaurant?.name || 'Restaurant'}</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600; color: var(--primary);">${Utils.formatPrice(item?.price || 0)}</span>
              <span style="font-size: 0.75rem; color: var(--success); background: rgba(0,184,148,0.1); padding: 2px 6px; border-radius: 4px;">${rec.reason}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },
  
  async loadOrderAgain() {
    const container = document.getElementById('orderAgainGrid');
    const section = document.getElementById('orderAgainSection');
    
    if (!container || !section) return;
    
    try {
      const result = await API.ai.getOrderAgain(6);
      
      if (result.success && result.data?.length > 0) {
        this.orderAgainItems = result.data;
        section.style.display = 'block';
        
        container.innerHTML = result.data.map(item => `
          <div class="card" style="cursor: pointer; transition: transform 0.2s;"
               onmouseover="this.style.transform='translateY(-4px)'" 
               onmouseout="this.style.transform='translateY(0)'"
               onclick="window.location.href='restaurant.html?id=${item.restaurant?._id}'">
            <div style="position: relative; height: 140px; overflow: hidden; border-radius: var(--radius-md) var(--radius-md) 0 0;">
              <img src="${item.item?.image || item.restaurant?.images?.cover || CONFIG.PLACEHOLDER_IMAGE}" 
                   alt="${item.item?.name}" 
                   style="width: 100%; height: 100%; object-fit: cover;">
              <div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.6); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">
                Ordered ${Utils.formatRelativeTime(item.lastOrdered)}
              </div>
            </div>
            <div style="padding: var(--sm);">
              <div style="font-weight: 600; font-size: 0.95rem;">${item.item?.name}</div>
              <div style="font-size: 0.8rem; color: var(--dark-gray);">${item.restaurant?.name}</div>
              <button class="btn btn-primary btn-sm" style="width: 100%; margin-top: var(--sm);" 
                      onclick="event.stopPropagation(); Cart.addItem(${JSON.stringify(item.item).replace(/"/g, '&quot;')}, ${JSON.stringify(item.restaurant).replace(/"/g, '&quot;')})">
                <i class="fas fa-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.log('Order again not loaded:', error);
    }
  },
  
  refreshOrderAgain() {
    this.loadOrderAgain();
    Utils.showToast('Refreshing your favorites...', 'info');
  },
  
  async loadTrendingItems() {
    const container = document.getElementById('trendingGrid');
    if (!container) return;
    
    try {
      const result = await API.ai.getTrending();
      
      if (result.success && result.data?.trending?.length > 0) {
        container.innerHTML = result.data.trending.slice(0, 4).map(item => `
          <div class="card" style="cursor: pointer; transition: transform 0.2s;"
               onmouseover="this.style.transform='translateY(-4px)'" 
               onmouseout="this.style.transform='translateY(0)'"
               onclick="window.location.href='restaurants.html?search=${encodeURIComponent(item.name)}'">
            <div style="padding: var(--md);">
              <div style="font-size: 2rem; margin-bottom: var(--sm);">${item.isVeg ? '🥬' : '🍖'}</div>
              <div style="font-weight: 600; margin-bottom: 4px;">${item.name}</div>
              <div style="font-size: 0.8rem; color: var(--dark-gray); margin-bottom: 4px;">${item.cuisine}</div>
              <div style="font-size: 0.85rem; color: var(--gray);">${item.estimatedPrice}</div>
              <div style="margin-top: var(--sm); font-size: 0.8rem; color: var(--primary);">
                <i class="fas fa-chart-line"></i> Trending now
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.log('Trending not loaded:', error);
    }
  },
  
  loadCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    container.innerHTML = CONFIG.FOOD_CATEGORIES.map(cat => `
      <a href="restaurants.html?cuisine=${encodeURIComponent(cat.name)}" class="category-card">
        <div class="category-icon">${cat.icon}</div>
        <div class="category-name">${cat.name}</div>
      </a>
    `).join('');
  },
  
  async loadFeaturedRestaurants() {
    const container = document.getElementById('featuredRestaurants');
    if (!container) return;
    
    Utils.showLoading(container);
    
    try {
      const result = await API.restaurants.getFeatured();
      if (result.success) {
        this.renderRestaurants(container, result.data);
      }
    } catch (error) {
      Utils.showError(container, 'Failed to load restaurants');
    }
  },
  
  async loadPopularRestaurants(lat = null, lng = null) {
    const container = document.getElementById('popularRestaurants');
    const section = document.getElementById('popularSection');
    if (!container || !section) return;
    
    try {
      const params = { limit: 8 };
      if (lat && lng) {
        params.lat = lat;
        params.lng = lng;
      }
      const result = await API.restaurants.getAll(params);
      if (result.success && result.data.restaurants.length > 0) {
        section.style.display = 'block';
        this.renderRestaurants(container, result.data.restaurants);
      }
    } catch (error) {
      console.log('Failed to load popular restaurants');
    }
  },
  
  renderRestaurants(container, restaurants) {
    container.innerHTML = restaurants.map(r => this.createRestaurantCard(r)).join('');
    Utils.lazyLoadImages();
  },
  
  createRestaurantCard(r) {
    const distance = r.distance?.distance?.text || '';
    
    // Generate cuisine-based image for restaurant
    const getRestaurantImage = (cuisine) => {
      const cuisineImages = {
        'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        'South Indian': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
        'Chinese': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
        'Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
        'Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        'Desserts': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
        'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
        'Fast Food': 'https://images.unsplash.com/photo-1561758033-d3e0fd5f2c88?w=400',
        'default': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
      };
      
      if (!cuisine || cuisine.length === 0) return cuisineImages['default'];
      
      for (const [key, url] of Object.entries(cuisineImages)) {
        if (cuisine.some(c => c.toLowerCase().includes(key.toLowerCase()))) {
          return url;
        }
      }
      return cuisineImages['default'];
    };
    
    const imageUrl = r.images?.cover || r.images?.logo || r.images?.gallery?.[0] || getRestaurantImage(r.cuisine);
    
    return `
      <a href="restaurant.html?id=${r._id}" class="restaurant-card" style="text-decoration: none; color: inherit;">
        <div class="restaurant-image" style="position: relative; height: 200px; overflow: hidden; border-radius: var(--radius-md) var(--radius-md) 0 0;">
          <img src="${imageUrl}" 
               alt="${r.name}" 
               style="width: 100%; height: 100%; object-fit: cover;"
               onerror="this.src='${CONFIG.PLACEHOLDER_IMAGE}'">
          ${r.isOpen ? '' : '<div style="position: absolute; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.2rem;">Closed</div>'}
          <div class="restaurant-badge" style="position: absolute; top: var(--sm); left: var(--sm); display: flex; gap: var(--xs);">
            ${r.foodType === 'veg' ? '<span style="background: #00b894; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">PURE VEG</span>' : ''}
            ${r.rating?.average >= 4.2 ? '<span style="background: var(--primary); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">TOP RATED</span>' : ''}
          </div>
          ${r.delivery?.freeDeliveryAbove ? `<div style="position: absolute; bottom: var(--sm); right: var(--sm); background: #00b894; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Free Delivery</div>` : ''}
        </div>
        <div class="restaurant-info" style="padding: var(--md);">
          <div class="restaurant-name" style="font-weight: 700; font-size: 1.1rem; margin-bottom: var(--xs);">${r.name}</div>
          <div class="restaurant-cuisine" style="color: var(--gray); font-size: 0.9rem; margin-bottom: var(--sm);">${r.cuisine?.slice(0, 3).join(', ') || 'Multi Cuisine'}</div>
          <div class="restaurant-meta" style="display: flex; gap: var(--md); font-size: 0.9rem; margin-bottom: var(--sm);">
            <span class="rating" style="display: flex; align-items: center; gap: 4px; background: #00b894; color: white; padding: 4px 8px; border-radius: 4px; font-weight: 600;">
              <i class="fas fa-star" style="font-size: 0.8rem;"></i> ${r.rating?.average?.toFixed(1) || '4.0'}
            </span>
            <span class="delivery-time" style="display: flex; align-items: center; gap: 4px; color: var(--gray);">
              <i class="fas fa-clock"></i> ${r.delivery?.deliveryTime?.min || 30}-${r.delivery?.deliveryTime?.max || 45} min
            </span>
            ${distance ? `<span class="delivery-time" style="display: flex; align-items: center; gap: 4px; color: var(--gray);"><i class="fas fa-map-marker-alt"></i> ${distance}</span>` : ''}
          </div>
          <div class="price-for-two" style="color: var(--light-gray); font-size: 0.9rem; border-top: 1px solid var(--light-gray); padding-top: var(--sm); margin-top: var(--sm);">
            ₹${r.priceForTwo || 300} for two
          </div>
        </div>
      </a>
    `;
  },
  
  loadOffers() {
    const container = document.getElementById('offersGrid');
    if (!container) return;
    
    const offers = [
      { title: 'Get 50% OFF', desc: 'On your first order', code: 'FIRST50', color: '#ff6b6b' },
      { title: 'Free Delivery', desc: 'On orders above ₹499', code: 'FREEDEL', color: '#4ecdc4' },
      { title: 'Buy 1 Get 1', desc: 'On selected items', code: 'BOGO', color: '#45b7d1' },
      { title: '20% Cashback', desc: 'Using digital wallet', code: 'CASHBACK20', color: '#00b894' }
    ];
    
    container.innerHTML = offers.map(o => `
      <div class="card" style="background: ${o.color}; color: white; padding: var(--lg); cursor: pointer;"
           onclick="Cart.applyCoupon('${o.code}', 0); Utils.showToast('Coupon ${o.code} applied!', 'success');">
        <h3 style="margin-bottom: var(--sm);">${o.title}</h3>
        <p style="opacity: 0.9; margin-bottom: var(--sm);">${o.desc}</p>
        <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: var(--xs) var(--sm); 
                    border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600;">
          Code: ${o.code}
        </div>
      </div>
    `).join('');
  },
  
  setupMoodButtons() {
    const buttons = document.querySelectorAll('.mood-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active', 'btn-primary'));
        buttons.forEach(b => b.classList.add('btn-outline'));
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary', 'active');
        
        const mood = btn.dataset.mood;
        AIChat.handleMoodClick(mood);
      });
    });
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('categoriesGrid')) {
    // We're on the home page
    HomePage.init();
  } else {
    App.init();
    Cart.init();
    AIChat.init();
  }
});

// Make modules available globally
window.App = App;
window.HomePage = HomePage;
