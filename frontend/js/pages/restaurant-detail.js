/**
 * Restaurant Detail Page
 * Individual restaurant with menu
 */

Pages.restaurant = function(container, restaurantId) {
  if (!restaurantId) {
    Router.navigate('/restaurants');
    return;
  }
  
  const content = `
    <div id="restaurantDetail">
      <div style="text-align: center; padding: 80px 40px;">
        <i class="fas fa-spinner fa-spin fa-2x" style="color: #ff6b6b;"></i>
        <p style="margin-top: 20px; color: #666;">Loading restaurant...</p>
      </div>
    </div>
  `;
  
  container.innerHTML = Pages.wrap(content, { title: 'Restaurant - FoodZap' });
  
  setTimeout(() => {
    if (typeof RestaurantPage !== 'undefined') {
      RestaurantPage.init(restaurantId);
    }
  }, 100);
};
