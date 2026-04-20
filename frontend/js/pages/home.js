/**
 * Home Page
 * Main landing page with hero, categories, recommendations
 */

Pages.home = function(container) {
  const content = `
    <!-- Hero Section -->
    <section class="hero" style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); color: white; padding: 60px 0; text-align: center;">
      <div class="container">
        <h1 style="font-size: 2.5rem; margin-bottom: 16px;">Hungry? We've Got You Covered! 🍔</h1>
        <p style="font-size: 1.2rem; margin-bottom: 24px; opacity: 0.95;">Order your favorite food from top restaurants. Fast delivery, great offers!</p>
        <div style="max-width: 600px; margin: 0 auto; display: flex; background: white; border-radius: 50px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <input type="text" id="heroSearch" placeholder="Search for food, restaurants..." 
                 style="flex: 1; border: none; padding: 16px 24px; font-size: 1rem; outline: none;">
          <button onclick="HomePage.search()" style="background: #ff6b6b; color: white; border: none; padding: 16px 32px; font-weight: 600; cursor: pointer;">
            <i class="fas fa-search"></i> Search
          </button>
        </div>
      </div>
    </section>

    <div class="container" style="padding: 40px 0;">
      <!-- Mood Selector -->
      <section style="margin-bottom: 40px;">
        <h2 style="margin-bottom: 20px;">What's your mood today? 😊</h2>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button class="mood-btn" onclick="HomePage.selectMood('happy')" style="padding: 12px 24px; border: 2px solid #e0e0e0; background: white; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 1rem; transition: all 0.2s;">
            <span style="font-size: 1.5rem;">😄</span> Happy
          </button>
          <button class="mood-btn" onclick="HomePage.selectMood('sad')" style="padding: 12px 24px; border: 2px solid #e0e0e0; background: white; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 1rem;">
            <span style="font-size: 1.5rem;">😢</span> Sad
          </button>
          <button class="mood-btn" onclick="HomePage.selectMood('tired')" style="padding: 12px 24px; border: 2px solid #e0e0e0; background: white; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 1rem;">
            <span style="font-size: 1.5rem;">😴</span> Tired
          </button>
          <button class="mood-btn" onclick="HomePage.selectMood('party')" style="padding: 12px 24px; border: 2px solid #e0e0e0; background: white; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 1rem;">
            <span style="font-size: 1.5rem;">🎉</span> Party
          </button>
          <button class="mood-btn" onclick="HomePage.selectMood('hungry')" style="padding: 12px 24px; border: 2px solid #e0e0e0; background: white; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 1rem;">
            <span style="font-size: 1.5rem;">🤤</span> Hungry
          </button>
        </div>
        <div id="moodSuggestions" style="margin-top: 20px;"></div>
      </section>

      <!-- Categories -->
      <section style="margin-bottom: 40px;">
        <h2 style="margin-bottom: 20px;">Popular Cuisines</h2>
        <div id="categoriesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px;">
          ${CONFIG.FOOD_CATEGORIES.map(cat => `
            <div onclick="Router.navigate('/restaurants?cuisine=${encodeURIComponent(cat.name)}')" 
                 style="background: white; border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;"
                 onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.12)';"
                 onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';">
              <div style="font-size: 2.5rem; margin-bottom: 8px;">${cat.icon}</div>
              <div style="font-weight: 600; font-size: 0.9rem;">${cat.name}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Featured Restaurants -->
      <section style="margin-bottom: 40px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2>Featured Restaurants</h2>
          <button onclick="Router.navigate('/restaurants')" style="background: none; border: none; color: #ff6b6b; font-weight: 600; cursor: pointer;">
            View All <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div id="featuredRestaurants" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          <div style="text-align: center; padding: 40px;">
            <i class="fas fa-spinner fa-spin fa-2x" style="color: #ff6b6b;"></i>
            <p style="margin-top: 16px; color: #666;">Loading restaurants...</p>
          </div>
        </div>
      </section>

      <!-- AI Recommendations (Hidden by default) -->
      <section id="aiRecommendationsSection" style="margin-bottom: 40px; display: none;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
            <div>
              <h2 style="margin-bottom: 8px;"><i class="fas fa-brain"></i> Recommended For You</h2>
              <p style="opacity: 0.9; font-size: 0.9rem;">Based on your taste and order history</p>
            </div>
            <span id="userPatternBadge" style="background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 0.85rem;">Loading...</span>
          </div>
          <div id="aiRecommendations" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;"></div>
        </div>
      </section>

      <!-- Order Again (Hidden by default) -->
      <section id="orderAgainSection" style="margin-bottom: 40px; display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2><i class="fas fa-redo"></i> Order Again</h2>
          <button onclick="HomePage.loadOrderAgain()" style="background: none; border: none; color: #ff6b6b; cursor: pointer;">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
        <div id="orderAgainGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;"></div>
      </section>

      <!-- Trending -->
      <section style="margin-bottom: 40px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2><i class="fas fa-fire"></i> Trending Now</h2>
          <span style="background: #ff6b6b; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">Hot 🔥</span>
        </div>
        <div id="trendingGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;"></div>
      </section>

      <!-- Instamart Banner -->
      <section style="margin-bottom: 40px;">
        <div style="background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); color: white; padding: 40px; border-radius: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
            <div>
              <h2 style="margin-bottom: 12px; font-size: 1.8rem;">🛒 Instamart</h2>
              <p style="font-size: 1.1rem; opacity: 0.95;">Groceries delivered in 15-30 minutes</p>
            </div>
            <button onclick="Router.navigate('/instamart')" style="background: white; color: #00b894; border: none; padding: 14px 28px; border-radius: 30px; font-weight: 600; cursor: pointer;">
              Shop Now <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- Today's Offers -->
      <section style="margin-bottom: 40px;">
        <h2 style="margin-bottom: 20px;">Today's Offers</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px;">
          ${[
            { title: 'Get 50% OFF', desc: 'On your first order', code: 'FIRST50', color: '#ff6b6b' },
            { title: 'Free Delivery', desc: 'On orders above ₹499', code: 'FREEDEL', color: '#4ecdc4' },
            { title: 'Buy 1 Get 1', desc: 'On selected items', code: 'BOGO', color: '#45b7d1' },
            { title: '20% Cashback', desc: 'Using wallet', code: 'CASHBACK20', color: '#00b894' }
          ].map(o => `
            <div onclick="Cart.applyCoupon('${o.code}', 50); Utils.showToast('Coupon ${o.code} applied!', 'success');"
                 style="background: ${o.color}; color: white; padding: 24px; border-radius: 16px; cursor: pointer; transition: transform 0.2s;"
                 onmouseover="this.style.transform='translateY(-4px)'"
                 onmouseout="this.style.transform=''">
              <h3 style="margin-bottom: 8px; font-size: 1.3rem;">${o.title}</h3>
              <p style="opacity: 0.9; margin-bottom: 12px; font-size: 0.95rem;">${o.desc}</p>
              <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
                Code: ${o.code}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
  
  container.innerHTML = Pages.wrap(content, { title: 'FoodZap - Food & Grocery Delivery' });
  
  // Initialize home page
  setTimeout(() => {
    if (typeof HomePage !== 'undefined') {
      HomePage.init();
    }
  }, 100);
};
