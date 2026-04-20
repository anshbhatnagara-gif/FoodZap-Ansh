/**
 * FoodZap Pages
 * All page templates rendered dynamically via JavaScript
 * Replaces static HTML files with dynamic rendering
 */

const Pages = {
  
  // Common layout wrapper
  wrap(content, options = {}) {
    const { title = 'FoodZap', hideHeader = false, hideFooter = false } = options;
    
    return `
      ${!hideHeader ? this.header() : ''}
      <main id="page-content">
        ${content}
      </main>
      ${!hideFooter ? this.footer() : ''}
      ${this.cartSidebar()}
      ${this.aiChat()}
      ${this.toastContainer()}
    `;
  },
  
  // Header component
  header() {
    const isLoggedIn = API.auth.isAuthenticated();
    const user = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    
    return `
      <header class="header">
        <div class="container header-content">
          <a href="/" class="logo" onclick="event.preventDefault(); Router.navigate('/');">
            <span class="logo-icon">🍕</span>
            <span>FoodZap</span>
          </a>

          <div class="location-selector" id="locationSelector">
            <i class="fas fa-map-marker-alt location-icon"></i>
            <span class="location-text" id="locationText">Detecting location...</span>
            <i class="fas fa-chevron-down"></i>
          </div>

          <nav class="nav-links">
            <a href="/" class="nav-link active" onclick="event.preventDefault(); Router.navigate('/');">Home</a>
            <a href="/restaurants" class="nav-link" onclick="event.preventDefault(); Router.navigate('/restaurants');">Restaurants</a>
            <a href="/instamart" class="nav-link" onclick="event.preventDefault(); Router.navigate('/instamart');">Instamart</a>
            <a href="/offers" class="nav-link" onclick="event.preventDefault(); Router.navigate('/offers');">Offers</a>
          </nav>

          <div class="header-actions">
            <div class="search-bar" style="max-width: 200px;">
              <i class="fas fa-search search-icon"></i>
              <input type="text" class="search-input" placeholder="Search..." id="searchInput">
            </div>
            
            ${isLoggedIn ? `
              <button class="btn btn-ghost" id="notificationBtn" style="display: none; position: relative;">
                <i class="fas fa-bell"></i>
                <span class="badge badge-danger" id="notificationCount" style="display: none; position: absolute; top: -2px; right: -2px;">0</span>
              </button>
            ` : ''}
            
            <button class="btn btn-ghost" id="cartBtn" onclick="Cart.toggleCart()">
              <i class="fas fa-shopping-cart"></i>
              <span class="badge badge-primary" id="cartCount" style="display: none;">0</span>
            </button>

            ${!isLoggedIn ? `
              <button class="btn btn-primary btn-sm" onclick="Router.navigate('/login');">Login</button>
            ` : `
              <div class="user-menu">
                <button class="btn btn-ghost" id="userDropdownBtn">
                  <i class="fas fa-user"></i>
                </button>
              </div>
            `}
          </div>
        </div>
      </header>
    `;
  },
  
  // Footer component
  footer() {
    return `
      <footer style="background: var(--black); color: var(--white); padding: var(--xl) 0; margin-top: auto;">
        <div class="container">
          <div class="grid grid-4" style="gap: var(--lg);">
            <div>
              <div class="logo" style="margin-bottom: var(--md); color: white;">
                <span class="logo-icon">🍕</span>
                <span>FoodZap</span>
              </div>
              <p style="color: var(--gray); font-size: 0.9rem;">
                Your favorite food and groceries delivered fast. Order now and enjoy!
              </p>
            </div>
            <div>
              <h4 style="margin-bottom: var(--md);">Quick Links</h4>
              <ul style="list-style: none; line-height: 2;">
                <li><a href="/" onclick="event.preventDefault(); Router.navigate('/');" style="color: var(--gray);">Home</a></li>
                <li><a href="/restaurants" onclick="event.preventDefault(); Router.navigate('/restaurants');" style="color: var(--gray);">Restaurants</a></li>
                <li><a href="/instamart" onclick="event.preventDefault(); Router.navigate('/instamart');" style="color: var(--gray);">Instamart</a></li>
                <li><a href="/offers" onclick="event.preventDefault(); Router.navigate('/offers');" style="color: var(--gray);">Offers</a></li>
              </ul>
            </div>
            <div>
              <h4 style="margin-bottom: var(--md);">Support</h4>
              <ul style="list-style: none; line-height: 2;">
                <li><a href="#" style="color: var(--gray);">Help Center</a></li>
                <li><a href="/orders" onclick="event.preventDefault(); Router.navigate('/orders');" style="color: var(--gray);">Track Order</a></li>
                <li><a href="#" style="color: var(--gray);">Contact Us</a></li>
                <li><a href="#" style="color: var(--gray);">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 style="margin-bottom: var(--md);">Connect</h4>
              <div class="flex gap-md" style="font-size: 1.5rem;">
                <a href="#" style="color: var(--gray);"><i class="fab fa-facebook"></i></a>
                <a href="#" style="color: var(--gray);"><i class="fab fa-twitter"></i></a>
                <a href="#" style="color: var(--gray);"><i class="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
          <div style="border-top: 1px solid var(--dark-gray); margin-top: var(--lg); padding-top: var(--md); text-align: center; color: var(--gray); font-size: 0.9rem;">
            © 2024 FoodZap. All rights reserved.
          </div>
        </div>
      </footer>
    `;
  },
  
  // Cart sidebar component
  cartSidebar() {
    return `
      <div class="overlay" id="overlay" onclick="Cart.closeCart()"></div>
      <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
          <h3><i class="fas fa-shopping-cart"></i> Your Cart</h3>
          <button class="btn btn-ghost" onclick="Cart.closeCart()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="cart-body" id="cartBody">
          <div style="text-align: center; padding: 40px; color: var(--gray);">
            <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 16px;"></i>
            <p>Your cart is empty</p>
            <button class="btn btn-primary" style="margin-top: 16px;" onclick="Cart.closeCart(); Router.navigate('/restaurants');">
              Browse Restaurants
            </button>
          </div>
        </div>
        <div class="cart-footer" id="cartFooter" style="display: none;">
          <div class="flex justify-between mb-sm">
            <span>Subtotal</span>
            <span id="cartSubtotal">₹0</span>
          </div>
          <div class="flex justify-between mb-sm">
            <span>Delivery</span>
            <span id="cartDelivery">₹0</span>
          </div>
          <div class="flex justify-between mb-md" style="font-weight: 600; font-size: 1.1rem;">
            <span>Total</span>
            <span id="cartTotal">₹0</span>
          </div>
          <button class="btn btn-primary btn-full btn-lg" onclick="Cart.closeCart(); Router.navigate('/checkout');">
            Proceed to Checkout
          </button>
        </div>
      </div>
    `;
  },
  
  // AI Chat component
  aiChat() {
    return `
      <div class="ai-chat-container">
        <button class="ai-chat-btn" id="aiChatBtn" onclick="AIChat.toggle()">
          <i class="fas fa-robot"></i>
        </button>
        <div class="ai-chat-window" id="aiChatWindow">
          <div class="ai-chat-header">
            <div class="flex items-center gap-sm">
              <i class="fas fa-robot"></i>
              <div>
                <div style="font-weight: 600;">FoodZap AI</div>
                <div style="font-size: 0.8rem; opacity: 0.9;">Ask me anything about food!</div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="AIChat.toggle()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="ai-chat-body" id="aiChatBody">
            <div class="chat-message ai">
              Hi! I'm your food assistant. Tell me your mood or ask for recommendations! 😊
            </div>
          </div>
          <div class="ai-chat-input">
            <input type="text" id="aiChatInput" placeholder="Type your message..." 
                   onkeypress="if(event.key==='Enter') AIChat.sendMessage()">
            <button onclick="AIChat.sendMessage()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  },
  
  // Toast container
  toastContainer() {
    return '<div class="toast-container" id="toastContainer"></div>';
  },
  
  // ==========================================
  // HOME PAGE
  // ==========================================
  home(container) {
    const content = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1>Hungry? We've Got You Covered! 🍔</h1>
            <p>Order your favorite food from top restaurants. Fast delivery, great offers!</p>
            <div class="hero-search">
              <input type="text" class="hero-search-input" placeholder="Search for food, restaurants..." id="heroSearch">
              <button class="hero-search-btn" onclick="HomePage.search()">
                <i class="fas fa-search"></i> Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <div class="container" style="padding: var(--lg) 0;">
        <!-- Mood Selector -->
        <section class="mb-lg">
          <h2 class="mb-md">What's your mood today? 😊</h2>
          <div class="flex gap-sm" style="flex-wrap: wrap;">
            <button class="mood-btn btn btn-outline" data-mood="happy" onclick="HomePage.selectMood('happy')">
              <span class="mood-emoji">😄</span> Happy
            </button>
            <button class="mood-btn btn btn-outline" data-mood="sad" onclick="HomePage.selectMood('sad')">
              <span class="mood-emoji">😢</span> Sad
            </button>
            <button class="mood-btn btn btn-outline" data-mood="tired" onclick="HomePage.selectMood('tired')">
              <span class="mood-emoji">😴</span> Tired
            </button>
            <button class="mood-btn btn btn-outline" data-mood="party" onclick="HomePage.selectMood('party')">
              <span class="mood-emoji">🎉</span> Party
            </button>
            <button class="mood-btn btn btn-outline" data-mood="hungry" onclick="HomePage.selectMood('hungry')">
              <span class="mood-emoji">🤤</span> Hungry
            </button>
          </div>
          <div id="moodSuggestions" style="margin-top: var(--md);"></div>
        </section>

        <!-- Categories -->
        <section class="mb-lg">
          <h2 class="mb-md">Popular Cuisines</h2>
          <div class="grid" id="categoriesGrid" style="--min-width: 120px;">
            ${CONFIG.FOOD_CATEGORIES.map(cat => `
              <div class="category-card" onclick="Router.navigate('/restaurants?cuisine=${encodeURIComponent(cat.name)}')">
                <div class="category-icon">${cat.icon}</div>
                <div class="category-name">${cat.name}</div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Featured Restaurants -->
        <section class="mb-lg">
          <div class="flex justify-between items-center mb-md">
            <h2>Featured Restaurants</h2>
            <button class="btn btn-ghost text-primary" onclick="Router.navigate('/restaurants');">
              View All <i class="fas fa-arrow-right"></i>
            </button>
          </div>
          <div class="grid grid-auto" id="featuredRestaurants">
            <div style="text-align: center; padding: 40px;">
              <i class="fas fa-spinner fa-spin fa-2x"></i>
            </div>
          </div>
        </section>

        <!-- AI Recommendations -->
        <section class="mb-lg" id="aiRecommendationsSection" style="display: none;">
          <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: var(--lg);">
            <div class="flex justify-between items-center mb-md" style="flex-wrap: wrap; gap: var(--sm);">
              <div>
                <h2 style="margin-bottom: var(--xs);"><i class="fas fa-brain"></i> Recommended For You</h2>
                <p style="opacity: 0.9; font-size: 0.9rem;">Based on your taste and order history</p>
              </div>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: white;" id="userPatternBadge">Loading...</span>
            </div>
            <div class="grid grid-auto" id="aiRecommendations" style="--min-width: 200px;"></div>
          </div>
        </section>

        <!-- Order Again -->
        <section class="mb-lg" id="orderAgainSection" style="display: none;">
          <div class="flex justify-between items-center mb-md">
            <h2><i class="fas fa-redo"></i> Order Again</h2>
            <button class="btn btn-ghost text-primary" onclick="HomePage.loadOrderAgain()">
              <i class="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
          <div class="grid grid-auto" id="orderAgainGrid"></div>
        </section>

        <!-- Trending -->
        <section class="mb-lg">
          <div class="flex justify-between items-center mb-md">
            <h2><i class="fas fa-fire"></i> Trending Now</h2>
            <span class="badge badge-primary" style="background: #ff6b6b;">Hot 🔥</span>
          </div>
          <div class="grid grid-auto" id="trendingGrid"></div>
        </section>

        <!-- Instamart Banner -->
        <section class="mb-lg">
          <div class="card" style="background: linear-gradient(135deg, var(--secondary), var(--accent)); color: white; padding: var(--xl);">
            <div class="flex justify-between items-center" style="flex-wrap: wrap; gap: var(--md);">
              <div>
                <h2 style="margin-bottom: var(--sm);">🛒 Instamart</h2>
                <p style="font-size: 1.1rem; opacity: 0.9;">Groceries delivered in 15-30 minutes</p>
              </div>
              <button class="btn" style="background: white; color: var(--secondary);" onclick="Router.navigate('/instamart');">
                Shop Now <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </section>

        <!-- Offers -->
        <section class="mb-lg">
          <h2 class="mb-md">Today's Offers</h2>
          <div class="grid grid-auto" id="offersGrid">
            ${[
              { title: 'Get 50% OFF', desc: 'On your first order', code: 'FIRST50', color: '#ff6b6b' },
              { title: 'Free Delivery', desc: 'On orders above ₹499', code: 'FREEDEL', color: '#4ecdc4' },
              { title: 'Buy 1 Get 1', desc: 'On selected items', code: 'BOGO', color: '#45b7d1' },
              { title: '20% Cashback', desc: 'Using wallet', code: 'CASHBACK20', color: '#00b894' }
            ].map(o => `
              <div class="card" style="background: ${o.color}; color: white; padding: var(--lg); cursor: pointer;"
                   onclick="Cart.applyCoupon('${o.code}', 0); Utils.showToast('Coupon ${o.code} applied!', 'success');">
                <h3 style="margin-bottom: var(--sm);">${o.title}</h3>
                <p style="opacity: 0.9; margin-bottom: var(--sm);">${o.desc}</p>
                <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: var(--xs) var(--sm); 
                            border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600;">
                  Code: ${o.code}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
    
    container.innerHTML = this.wrap(content, { title: 'FoodZap - Food & Grocery Delivery' });
    
    // Initialize home page functionality
    setTimeout(() => {
      if (typeof HomePage !== 'undefined') {
        HomePage.init();
      }
    }, 100);
  },
  
  // ==========================================
  // RESTAURANTS PAGE
  // ==========================================
  restaurants(container) {
    const content = `
      <div class="container" style="padding: var(--lg) 0;">
        <!-- Filters -->
        <div class="card mb-md" style="padding: var(--md);">
          <div class="flex gap-md" style="flex-wrap: wrap; align-items: center;">
            <div class="search-bar" style="flex: 1; min-width: 200px;">
              <i class="fas fa-search search-icon"></i>
              <input type="text" class="search-input" placeholder="Search restaurants..." id="restaurantSearch">
            </div>
            <select class="form-control" id="cuisineFilter" style="width: auto;">
              <option value="">All Cuisines</option>
              ${CONFIG.FOOD_CATEGORIES.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
            </select>
            <select class="form-control" id="sortFilter" style="width: auto;">
              <option value="rating">Top Rated</option>
              <option value="deliveryTime">Fastest Delivery</option>
              <option value="price">Price: Low to High</option>
            </select>
            <label style="display: flex; align-items: center; gap: var(--sm); cursor: pointer;">
              <input type="checkbox" id="vegFilter"> Pure Veg
            </label>
          </div>
        </div>

        <!-- Results -->
        <div class="flex justify-between items-center mb-md">
          <h2>All Restaurants</h2>
          <span style="color: var(--gray);">Showing <span id="restaurantCount">0</span> results</span>
        </div>
        
        <div class="grid grid-auto" id="restaurantsGrid">
          <div style="text-align: center; padding: 60px;">
            <i class="fas fa-spinner fa-spin fa-2x"></i>
            <p style="margin-top: var(--md);">Loading restaurants...</p>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = this.wrap(content, { title: 'Restaurants - FoodZap' });
    
    setTimeout(() => {
      // Use MenuLoader if available, otherwise fall back to RestaurantsPage
      if (typeof MenuLoader !== 'undefined' && MenuLoader.getRestaurants) {
        this.renderMenuRestaurants();
      } else if (typeof RestaurantsPage !== 'undefined') {
        RestaurantsPage.init();
      } else {
        document.getElementById('restaurantsGrid').innerHTML = 
          '<div style="text-align: center; padding: 40px;"><p>Loading menu data...</p></div>';
      }
    }, 100);
  },

  // Render restaurants from menu data
  renderMenuRestaurants() {
    const grid = document.getElementById('restaurantsGrid');
    const count = document.getElementById('restaurantCount');
    const searchInput = document.getElementById('restaurantSearch');
    const cuisineFilter = document.getElementById('cuisineFilter');
    const sortFilter = document.getElementById('sortFilter');
    const vegFilter = document.getElementById('vegFilter');
    
    let restaurants = MenuLoader.getRestaurants();
    
    // Update cuisine filter options
    if (cuisineFilter) {
      const cuisines = [...new Set(restaurants.flatMap(r => r.cuisine))];
      cuisineFilter.innerHTML = `
        <option value="">All Cuisines</option>
        ${cuisines.map(c => `<option value="${c}">${c}</option>`).join('')}
      `;
    }
    
    const render = () => {
      let filtered = [...restaurants];
      
      // Search filter
      if (searchInput?.value) {
        const query = searchInput.value.toLowerCase();
        filtered = filtered.filter(r => 
          r.name.toLowerCase().includes(query) || 
          r.cuisine.some(c => c.toLowerCase().includes(query))
        );
      }
      
      // Cuisine filter
      if (cuisineFilter?.value) {
        filtered = filtered.filter(r => 
          r.cuisine.some(c => c.toLowerCase().includes(cuisineFilter.value.toLowerCase()))
        );
      }
      
      // Veg filter
      if (vegFilter?.checked) {
        filtered = filtered.filter(r => r.isVeg);
      }
      
      // Sort
      if (sortFilter?.value === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortFilter?.value === 'price') {
        filtered.sort((a, b) => a.priceForTwo - b.priceForTwo);
      }
      
      // Update count
      if (count) count.textContent = filtered.length;
      
      // Render
      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="text-align: center; padding: 60px; grid-column: 1 / -1;">
            <i class="fas fa-store-slash fa-3x" style="color: var(--gray); margin-bottom: var(--md);"></i>
            <h3>No restaurants found</h3>
            <p style="color: var(--gray);">Try adjusting your filters</p>
          </div>
        `;
        return;
      }
      
      grid.innerHTML = filtered.map(r => `
        <a href="/restaurant?id=${r.id}" class="restaurant-card" data-nav style="text-decoration: none; color: inherit; background: white; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.2s, box-shadow 0.2s;">
          <div style="position: relative; height: 180px; overflow: hidden;">
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #f97316, #ea580c); display: flex; align-items: center; justify-content: center; font-size: 4rem;">
              ${r.icon}
            </div>
            ${r.offers.length ? `<div style="position: absolute; top: 10px; left: 10px; background: var(--success); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${r.offers[0]}</div>` : ''}
            ${r.isVeg ? '<div style="position: absolute; top: 10px; right: 10px; background: #00b894; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">PURE VEG</div>' : ''}
          </div>
          <div style="padding: var(--md);">
            <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: var(--xs);">${r.name}</div>
            <div style="color: var(--gray); font-size: 0.9rem; margin-bottom: var(--sm);">${r.cuisine.join(', ')}</div>
            <div style="display: flex; gap: var(--md); font-size: 0.85rem; color: var(--gray);">
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="background: #00b894; color: white; padding: 2px 6px; border-radius: 4px; font-weight: 600;">⭐ ${r.rating}</span>
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">🕐 ${r.deliveryTime}</span>
              <span>₹${r.priceForTwo} for two</span>
            </div>
            <div style="margin-top: var(--sm); color: var(--primary); font-size: 0.85rem;">${r.menuCount} items</div>
          </div>
        </a>
      `).join('');
    };
    
    // Add event listeners
    if (searchInput) searchInput.addEventListener('input', render);
    if (cuisineFilter) cuisineFilter.addEventListener('change', render);
    if (sortFilter) sortFilter.addEventListener('change', render);
    if (vegFilter) vegFilter.addEventListener('change', render);
    
    render();
  },
  
  // ==========================================
  // RESTAURANT DETAIL PAGE
  // ==========================================
  restaurant(container, restaurantId) {
    if (!restaurantId) {
      Router.navigate('/restaurants');
      return;
    }
    
    const content = `
      <div id="restaurantDetail">
        <div style="text-align: center; padding: 60px;">
          <i class="fas fa-spinner fa-spin fa-2x"></i>
          <p style="margin-top: var(--md);">Loading restaurant...</p>
        </div>
      </div>
    `;
    
    container.innerHTML = this.wrap(content, { title: 'Restaurant - FoodZap' });
    
    setTimeout(() => {
      // Use MenuLoader if available
      if (typeof MenuLoader !== 'undefined' && MenuLoader.getRestaurant) {
        this.renderMenuRestaurantDetail(restaurantId);
      } else if (typeof RestaurantPage !== 'undefined') {
        RestaurantPage.init(restaurantId);
      }
    }, 100);
  },

  // Render restaurant menu detail
  renderMenuRestaurantDetail(cuisine) {
    const detailContainer = document.getElementById('restaurantDetail');
    if (!detailContainer) return;

    const restaurant = MenuLoader.getRestaurant(cuisine);
    if (!restaurant) {
      detailContainer.innerHTML = `
        <div style="text-align: center; padding: 60px;">
          <h3>Restaurant not found</h3>
          <button class="btn-primary" onclick="Router.navigate('/restaurants')">Browse Restaurants</button>
        </div>
      `;
      return;
    }

    const menu = restaurant.fullMenu;
    
    // Generate menu HTML
    let menuHtml = '';
    for (const category of menu.categories) {
      const itemsHtml = category.items.map(item => `
        <div class="menu-item" style="display: flex; gap: var(--md); padding: var(--md); border-bottom: 1px solid #eee; background: white; border-radius: var(--radius-md); margin-bottom: var(--sm);">
          <div style="font-size: 3rem; flex-shrink: 0;">${item.image || '🍽️'}</div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h4 style="margin: 0; font-size: 1.1rem;">
                  ${item.isVeg ? '🟢' : '🔴'} ${item.name}
                  ${item.isBestseller ? '<span style="background: gold; color: #333; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">⭐ BESTSELLER</span>' : ''}
                </h4>
                <p style="margin: 4px 0; color: var(--gray); font-size: 0.9rem;">${item.description || ''}</p>
                <span style="color: var(--primary); font-weight: 600;">⭐ ${item.rating || 4.0}</span>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: var(--sm);">₹${item.price}</div>
                <button class="btn-primary" style="padding: 8px 16px; font-size: 0.9rem;" 
                  onclick="Cart.addItem('${item.id}', '${item.name}', ${item.price}, '${item.image || '🍽️'}')">
                  ADD +
                </button>
              </div>
            </div>
            ${item.variants ? `
              <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
                ${item.variants.map(v => `<span style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${v.name} ₹${v.price}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `).join('');

      menuHtml += `
        <div style="margin-bottom: var(--lg);">
          <h3 style="font-size: 1.3rem; margin-bottom: var(--md); padding-bottom: var(--sm); border-bottom: 2px solid var(--primary);">
            ${category.name} <span style="color: var(--gray); font-size: 0.9rem;">(${category.items.length} items)</span>
          </h3>
          <div style="display: grid; gap: var(--sm);">
            ${itemsHtml}
          </div>
        </div>
      `;
    }

    detailContainer.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto;">
        <!-- Restaurant Header -->
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: var(--xl); border-radius: var(--radius-lg); margin-bottom: var(--lg);">
          <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: var(--md);">
            <div>
              <span style="font-size: 4rem;">${restaurant.icon}</span>
              <h1 style="margin: var(--sm) 0; font-size: 2rem;">${restaurant.name}</h1>
              <p style="opacity: 0.9; margin-bottom: var(--sm);">${restaurant.cuisine.join(' • ')}</p>
              <div style="display: flex; gap: var(--lg); flex-wrap: wrap;">
                <span>⭐ ${restaurant.rating} rating</span>
                <span>🕐 ${restaurant.deliveryTime}</span>
                <span>₹${restaurant.priceForTwo} for two</span>
              </div>
            </div>
            <div style="text-align: right;">
              ${restaurant.offers.map(o => `<div style="background: rgba(255,255,255,0.2); padding: var(--sm) var(--md); border-radius: var(--radius-md); margin-bottom: var(--sm);">${o}</div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Menu Navigation -->
        <div style="position: sticky; top: 0; background: white; padding: var(--md) 0; border-bottom: 1px solid #eee; margin-bottom: var(--lg); z-index: 100; overflow-x: auto;">
          <div style="display: flex; gap: var(--md); min-width: max-content;">
            ${menu.categories.map(cat => `
              <a href="#${cat.name.toLowerCase().replace(/\s+/g, '-')}" 
                 style="padding: var(--sm) var(--md); background: #f5f5f5; border-radius: var(--radius-md); text-decoration: none; color: var(--dark); white-space: nowrap; font-size: 0.9rem;">
                ${cat.name}
              </a>
            `).join('')}
          </div>
        </div>

        <!-- Menu Content -->
        <div class="menu-container">
          ${menuHtml}
        </div>
      </div>
    `;

    // Update page title
    document.title = `${restaurant.name} - FoodZap`;
  },
  
  // ==========================================
  // CART PAGE
  // ==========================================
  cart(container) {
    const content = `
      <div class="container" style="padding: var(--lg) 0; max-width: 800px;">
        <h1 class="mb-lg"><i class="fas fa-shopping-cart"></i> Your Cart</h1>
        
        <div id="cartContent">
          <div style="text-align: center; padding: 60px;">
            <i class="fas fa-spinner fa-spin fa-2x"></i>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = this.wrap(content, { title: 'Cart - FoodZap' });
    
    setTimeout(() => {
      this.renderCartContent();
    }, 100);
  },
  
  renderCartContent() {
    const cart = Utils.getStorage('cart', { items: [], restaurant: null });
    const container = document.getElementById('cartContent');
    
    if (!cart.items || cart.items.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 80px 40px;">
          <i class="fas fa-shopping-cart" style="font-size: 4rem; color: var(--light-gray); margin-bottom: var(--lg);"></i>
          <h2 style="margin-bottom: var(--sm);">Your cart is empty</h2>
          <p style="color: var(--gray); margin-bottom: var(--lg);">Add some delicious food to your cart!</p>
          <button class="btn btn-primary btn-lg" onclick="Router.navigate('/restaurants');">
            <i class="fas fa-utensils"></i> Browse Restaurants
          </button>
        </div>
      `;
      return;
    }
    
    let itemsTotal = 0;
    
    const itemsHtml = cart.items.map(item => {
      let price = item.price;
      if (item.variant?.price) price = item.variant.price;
      let addonsTotal = item.addons?.reduce((sum, a) => sum + (a.price || 0), 0) || 0;
      const itemTotal = (price + addonsTotal) * item.quantity;
      itemsTotal += itemTotal;
      
      return `
        <div class="cart-item" style="display: flex; gap: var(--md); padding: var(--md); border-bottom: 1px solid var(--light-gray);">
          <div style="flex: 1;">
            <h4 style="margin-bottom: 4px;">${item.name}</h4>
            ${item.variant ? `<p style="font-size: 0.85rem; color: var(--dark-gray);">${item.variant.name}</p>` : ''}
            <p style="font-size: 0.9rem; color: var(--primary); font-weight: 600;">${Utils.formatPrice(price)}</p>
          </div>
          <div style="display: flex; align-items: center; gap: var(--sm);">
            <button class="btn btn-ghost btn-sm" onclick="Cart.updateQuantity('${item.menuItemId}', ${item.quantity - 1})">
              <i class="fas fa-minus"></i>
            </button>
            <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
            <button class="btn btn-ghost btn-sm" onclick="Cart.updateQuantity('${item.menuItemId}', ${item.quantity + 1})">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div style="font-weight: 600; min-width: 80px; text-align: right;">
            ${Utils.formatPrice(itemTotal)}
          </div>
          <button class="btn btn-ghost btn-sm" style="color: var(--danger);" onclick="Cart.removeItem('${item.menuItemId}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
    }).join('');
    
    const deliveryFee = itemsTotal > 500 ? 0 : 40;
    const platformFee = 5;
    const gst = Math.round(itemsTotal * 0.05);
    const total = itemsTotal + deliveryFee + platformFee + gst;
    
    container.innerHTML = `
      <div class="card" style="margin-bottom: var(--lg);">
        ${itemsHtml}
      </div>
      
      <div class="card" style="margin-bottom: var(--lg);">
        <h3 class="mb-md">Bill Details</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: var(--sm);">
          <span>Item Total</span>
          <span>${Utils.formatPrice(itemsTotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: var(--sm);">
          <span>Delivery Fee</span>
          <span style="color: ${deliveryFee === 0 ? 'var(--success)' : ''};">
            ${deliveryFee === 0 ? 'FREE' : Utils.formatPrice(deliveryFee)}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: var(--sm);">
          <span>Platform Fee</span>
          <span>${Utils.formatPrice(platformFee)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: var(--md); padding-bottom: var(--md); border-bottom: 1px solid var(--light-gray);">
          <span>GST</span>
          <span>${Utils.formatPrice(gst)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 700;">
          <span>To Pay</span>
          <span>${Utils.formatPrice(total)}</span>
        </div>
      </div>
      
      <button class="btn btn-primary btn-lg btn-full" onclick="Router.navigate('/checkout');">
        Proceed to Checkout <i class="fas fa-arrow-right"></i>
      </button>
    `;
  },
  
  // ==========================================
  // CHECKOUT PAGE
  // ==========================================
  checkout(container) {
    const content = `
      <div class="container" style="padding: var(--lg) 0;">
        <div class="grid" style="grid-template-columns: 1fr 350px; gap: var(--lg);">
          <!-- Left Column -->
          <div>
            <!-- Delivery Address -->
            <div class="card mb-md" style="padding: var(--lg);">
              <h3 class="mb-md"><span style="background: var(--primary); color: white; padding: 4px 12px; border-radius: 50%; margin-right: var(--sm);">1</span> Delivery Address</h3>
              <div id="addressesList">
                <p style="color: var(--gray);">Loading addresses...</p>
              </div>
              <button class="btn btn-outline btn-full mt-md" onclick="Pages.showAddAddressModal()">
                <i class="fas fa-plus"></i> Add New Address
              </button>
            </div>
            
            <!-- Payment Method -->
            <div class="card" style="padding: var(--lg);">
              <h3 class="mb-md"><span style="background: var(--primary); color: white; padding: 4px 12px; border-radius: 50%; margin-right: var(--sm);">2</span> Payment Method</h3>
              <div class="flex flex-col gap-sm">
                <label class="payment-option" style="display: flex; align-items: center; gap: var(--md); padding: var(--md); border: 2px solid var(--primary); border-radius: var(--radius-md); cursor: pointer;">
                  <input type="radio" name="payment" value="cod" checked style="width: 20px; height: 20px;">
                  <i class="fas fa-money-bill-wave" style="font-size: 1.5rem; color: var(--success);"></i>
                  <div>
                    <div style="font-weight: 600;">Cash on Delivery</div>
                    <div style="font-size: 0.85rem; color: var(--gray);">Pay when you receive</div>
                  </div>
                </label>
                <label class="payment-option" style="display: flex; align-items: center; gap: var(--md); padding: var(--md); border: 2px solid var(--light-gray); border-radius: var(--radius-md); cursor: pointer;">
                  <input type="radio" name="payment" value="online" style="width: 20px; height: 20px;">
                  <i class="fas fa-credit-card" style="font-size: 1.5rem; color: var(--primary);"></i>
                  <div>
                    <div style="font-weight: 600;">Pay Online</div>
                    <div style="font-size: 0.85rem; color: var(--gray);">Card, UPI, NetBanking</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Right Column - Order Summary -->
          <div>
            <div class="card" style="padding: var(--lg); position: sticky; top: 80px;">
              <h3 class="mb-md">Order Summary</h3>
              <div id="orderSummary">
                <p style="color: var(--gray);">Loading...</p>
              </div>
              <button class="btn btn-primary btn-full btn-lg mt-md" id="placeOrderBtn" onclick="Pages.placeOrder()">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = this.wrap(content, { title: 'Checkout - FoodZap' });
    
    setTimeout(() => {
      this.renderCheckoutSummary();
      this.loadAddresses();
    }, 100);
  },
  
  renderCheckoutSummary() {
    const cart = Utils.getStorage('cart', { items: [], restaurant: null });
    const container = document.getElementById('orderSummary');
    
    if (!cart.items || cart.items.length === 0) {
      container.innerHTML = '<p style="color: var(--danger);">Your cart is empty</p>';
      return;
    }
    
    let itemsTotal = 0;
    const itemsHtml = cart.items.map(item => {
      let price = item.price;
      if (item.variant?.price) price = item.variant.price;
      const itemTotal = price * item.quantity;
      itemsTotal += itemTotal;
      return `
        <div style="display: flex; justify-content: space-between; margin-bottom: var(--sm); font-size: 0.9rem;">
          <span>${item.name} x ${item.quantity}</span>
          <span>${Utils.formatPrice(itemTotal)}</span>
        </div>
      `;
    }).join('');
    
    const deliveryFee = itemsTotal > 500 ? 0 : 40;
    const platformFee = 5;
    const gst = Math.round(itemsTotal * 0.05);
    const total = itemsTotal + deliveryFee + platformFee + gst;
    
    container.innerHTML = `
      <div style="margin-bottom: var(--md); padding-bottom: var(--md); border-bottom: 1px solid var(--light-gray);">
        ${itemsHtml}
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--sm);">
        <span>Subtotal</span>
        <span>${Utils.formatPrice(itemsTotal)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--sm);">
        <span>Delivery</span>
        <span style="color: ${deliveryFee === 0 ? 'var(--success)' : ''};">${deliveryFee === 0 ? 'FREE' : Utils.formatPrice(deliveryFee)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--sm);">
        <span>GST</span>
        <span>${Utils.formatPrice(gst)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 700; margin-top: var(--md); padding-top: var(--md); border-top: 2px solid var(--light-gray);">
        <span>Total</span>
        <span>${Utils.formatPrice(total)}</span>
      </div>
    `;
  },
  
  // ==========================================
  // LOGIN PAGE
  // ==========================================
  login(container) {
    const content = `
      <div class="container" style="padding: var(--xl) 0; max-width: 450px;">
        <div class="card" style="padding: var(--xl);">
          <div style="text-align: center; margin-bottom: var(--lg);">
            <div class="logo" style="justify-content: center; font-size: 2rem; margin-bottom: var(--sm);">
              <span class="logo-icon">🍕</span>
              <span>FoodZap</span>
            </div>
            <h2>Welcome Back!</h2>
            <p style="color: var(--gray);">Login to order your favorite food</p>
          </div>
          
          <form id="loginForm" onsubmit="event.preventDefault(); Pages.handleLogin();">
            <div class="form-group">
              <label>Email or Phone</label>
              <input type="text" class="form-control" id="loginEmail" placeholder="Enter email or phone" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" class="form-control" id="loginPassword" placeholder="Enter password" required>
            </div>
            <button type="submit" class="btn btn-primary btn-full btn-lg">Login</button>
          </form>
          
          <div style="text-align: center; margin: var(--md) 0; color: var(--gray);">or</div>
          
          <button class="btn btn-outline btn-full" onclick="Pages.googleLogin()">
            <i class="fab fa-google" style="color: #DB4437;"></i> Continue with Google
          </button>
          
          <p style="text-align: center; margin-top: var(--lg); color: var(--gray);">
            Don't have an account? 
            <a href="#" onclick="event.preventDefault(); Router.navigate('/register');" style="color: var(--primary); font-weight: 600;">Sign Up</a>
          </p>
        </div>
      </div>
    `;
    
    container.innerHTML = this.wrap(content, { title: 'Login - FoodZap', hideHeader: true, hideFooter: true });
  },
  
  // ==========================================
  // PROFILE PAGE
  // ==========================================
  profile(container) {
    if (!API.auth.isAuthenticated()) {
      Router.navigate('/login');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const content = `
      <div class="container" style="padding: var(--lg) 0; max-width: 800px;">
        <div class="card mb-lg" style="padding: var(--xl); text-align: center;">
          <div style="width: 100px; height: 100px; background: var(--primary); border-radius: 50%; margin: 0 auto var(--md); display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem;">
            ${user.name ? user.name.charAt(0).toUpperCase() : '👤'}
          </div>
          <h2 style="margin-bottom: var(--xs);">${user.name || 'User'}</h2>
          <p style="color: var(--gray); margin-bottom: var(--md);">${user.email || user.phone || ''}</p>
          <button class="btn btn-secondary" onclick="Pages.editProfile()">Edit Profile</button>
        </div>
        
        <div class="grid grid-2" style="gap: var(--md);">
          <div class="card" style="padding: var(--lg); cursor: pointer;" onclick="Router.navigate('/orders');">
            <i class="fas fa-box" style="font-size: 2rem; color: var(--primary); margin-bottom: var(--sm);"></i>
            <h4>My Orders</h4>
            <p style="color: var(--gray); font-size: 0.9rem;">View order history</p>
          </div>
          <div class="card" style="padding: var(--lg); cursor: pointer;" onclick="Router.navigate('/wallet');">
            <i class="fas fa-wallet" style="font-size: 2rem; color: var(--success); margin-bottom: var(--sm);"></i>
            <h4>Wallet</h4>
            <p style="color: var(--gray); font-size: 0.9rem;">Check balance & add money</p>
          </div>
          <div class="card" style="padding: var(--lg); cursor: pointer;" onclick="Router.navigate('/addresses');">
            <i class="fas fa-map-marker-alt" style="font-size: 2rem; color: var(--accent); margin-bottom: var(--sm);"></i>
            <h4>Addresses</h4>
            <p style="color: var(--gray); font-size: 0.9rem;">Manage delivery addresses</p>
          </div>
          <div class="card" style="padding: var(--lg); cursor: pointer;" onclick="Router.navigate('/favorites');">
            <i class="fas fa-heart" style="font-size: 2rem; color: #ff6b6b; margin-bottom: var(--sm);"></i>
            <h4>Favorites</h4>
            <p style="color: var(--gray); font-size: 0.9rem;">Saved restaurants & items</p>
          </div>
        </div>
        
        <button class="btn btn-danger btn-full mt-lg" onclick="App.logout()">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    `;
    
    container.innerHTML = this.wrap(content, { title: 'My Profile - FoodZap' });
  },
  
  // ==========================================
  // WALLET PAGE
  // ==========================================
  wallet(container) {
    if (!API.auth.isAuthenticated()) {
      Router.navigate('/login');
      return;
    }
    
    const content = `
      <div class="container" style="padding: var(--lg) 0; max-width: 800px;">
        <!-- Balance Card -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: var(--xl); border-radius: var(--radius-lg); margin-bottom: var(--lg);">
          <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: var(--sm);">Available Balance</div>
          <div style="font-size: 3rem; font-weight: 700; margin-bottom: var(--md);" id="walletBalance">₹0</div>
          <div style="display: flex; gap: var(--md);">
            <button class="btn" style="background: rgba(255,255,255,0.2); color: white;" onclick="Pages.addMoney()">
              <i class="fas fa-plus"></i> Add Money
            </button>
          </div>
        </div>
        
        <div class="card" style="padding: var(--lg);">
          <h3 class="mb-md">Subscription Plans</h3>
          <div id="subscriptionPlans">
            <p style="color: var(--gray);">Loading plans...</p>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = this.wrap(content, { title: 'Wallet - FoodZap' });
    
    setTimeout(() => {
      this.loadWalletData();
    }, 100);
  },
  
  // Helper methods
  async loadWalletData() {
    try {
      const result = await API.wallet.getWallet();
      if (result.success) {
        document.getElementById('walletBalance').textContent = Utils.formatPrice(result.data.wallet.balance);
      }
    } catch (error) {
      console.error('Failed to load wallet', error);
    }
  },
  
  async loadAddresses() {
    const addresses = Utils.getSavedAddresses();
    const container = document.getElementById('addressesList');
    
    if (addresses.length === 0) {
      container.innerHTML = '<p style="color: var(--gray);">No saved addresses. Please add one.</p>';
      return;
    }
    
    container.innerHTML = addresses.map((addr, index) => `
      <label style="display: block; padding: var(--md); border: 2px solid ${index === 0 ? 'var(--primary)' : 'var(--light-gray)'}; border-radius: var(--radius-md); margin-bottom: var(--sm); cursor: pointer;">
        <input type="radio" name="address" value="${index}" ${index === 0 ? 'checked' : ''} style="margin-right: var(--sm);">
        <strong>${addr.label || 'Address'}</strong>
        <p style="margin: 4px 0; color: var(--gray); font-size: 0.9rem;">${addr.address}</p>
      </label>
    `).join('');
  },
  
  async handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      const result = await API.auth.login(email, password);
      if (result.success) {
        Utils.showToast('Login successful!', 'success');
        Router.navigate('/');
      } else {
        Utils.showToast(result.message || 'Login failed', 'error');
      }
    } catch (error) {
      Utils.showToast('Login error', 'error');
    }
  },
  
  async placeOrder() {
    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    const cart = Utils.getStorage('cart', { items: [], restaurant: null });
    if (!cart.items || cart.items.length === 0) {
      Utils.showToast('Cart is empty', 'error');
      btn.disabled = false;
      btn.textContent = 'Place Order';
      return;
    }
    
    // Get selected address
    const addressRadio = document.querySelector('input[name="address"]:checked');
    if (!addressRadio) {
      Utils.showToast('Please select delivery address', 'warning');
      btn.disabled = false;
      btn.textContent = 'Place Order';
      return;
    }
    
    const addresses = Utils.getSavedAddresses();
    const selectedAddress = addresses[parseInt(addressRadio.value)];
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
    
    try {
      const orderData = {
        paymentMethod,
        deliveryAddress: selectedAddress,
        items: cart.items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          variant: item.variant,
          addons: item.addons
        }))
      };
      
      const result = await API.orders.create(orderData);
      
      if (result.success) {
        Cart.clearCart();
        Utils.showToast('Order placed successfully!', 'success');
        Router.navigate(`/order-tracking?orderId=${result.data.orderId}`);
      } else {
        Utils.showToast(result.message || 'Failed to place order', 'error');
        btn.disabled = false;
        btn.textContent = 'Place Order';
      }
    } catch (error) {
      Utils.showToast('Order failed', 'error');
      btn.disabled = false;
      btn.textContent = 'Place Order';
    }
  },
  
  googleLogin() {
    Utils.showToast('Google login coming soon', 'info');
  },
  
  editProfile() {
    Utils.showToast('Edit profile coming soon', 'info');
  },
  
  addMoney() {
    Utils.showToast('Add money feature - integrate Razorpay here', 'info');
  },
  
  showAddAddressModal() {
    Utils.showToast('Add address modal - implement form here', 'info');
  }
};

// Make pages global
window.Pages = Pages;
