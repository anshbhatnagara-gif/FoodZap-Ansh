/**
 * Restaurants Page
 * Browse and filter restaurants
 */

Pages.restaurants = function(container) {
  const content = `
    <div class="container" style="padding: 40px 0;">
      <!-- Filters -->
      <div style="background: white; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <div style="flex: 1; min-width: 200px; position: relative;">
            <i class="fas fa-search" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #999;"></i>
            <input type="text" id="restaurantSearch" placeholder="Search restaurants..." 
                   style="width: 100%; padding: 12px 16px 12px 44px; border: 2px solid #e0e0e0; border-radius: 30px; font-size: 1rem; outline: none;"
                   onfocus="this.style.borderColor='#ff6b6b'" onblur="this.style.borderColor='#e0e0e0'">
          </div>
          <select id="cuisineFilter" style="padding: 12px 20px; border: 2px solid #e0e0e0; border-radius: 30px; font-size: 1rem; background: white; cursor: pointer; outline: none;">
            <option value="">All Cuisines</option>
            ${CONFIG.FOOD_CATEGORIES.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select>
          <select id="sortFilter" style="padding: 12px 20px; border: 2px solid #e0e0e0; border-radius: 30px; font-size: 1rem; background: white; cursor: pointer; outline: none;">
            <option value="rating">Top Rated</option>
            <option value="deliveryTime">Fastest Delivery</option>
            <option value="price">Price: Low to High</option>
          </select>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 12px 16px; background: #f8f9fa; border-radius: 30px;">
            <input type="checkbox" id="vegFilter"> Pure Veg
          </label>
        </div>
      </div>

      <!-- Results Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>All Restaurants</h2>
        <span style="color: #666;">Showing <span id="restaurantCount" style="font-weight: 600; color: #ff6b6b;">0</span> results</span>
      </div>
      
      <!-- Restaurants Grid -->
      <div id="restaurantsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
        <div style="text-align: center; padding: 60px; grid-column: 1 / -1;">
          <i class="fas fa-spinner fa-spin fa-2x" style="color: #ff6b6b;"></i>
          <p style="margin-top: 16px; color: #666;">Loading restaurants...</p>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = Pages.wrap(content, { title: 'Restaurants - FoodZap' });
  
  setTimeout(() => {
    if (typeof RestaurantsPage !== 'undefined') {
      RestaurantsPage.init();
    }
  }, 100);
};
