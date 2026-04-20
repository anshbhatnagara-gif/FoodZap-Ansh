/**
 * Orders Page
 * Order history and tracking
 */

Pages.orders = function(container) {
  if (!API.auth.isAuthenticated()) {
    Router.navigate('/login');
    return;
  }
  
  const content = `
    <div class="container" style="padding: 40px 0; max-width: 900px;">
      <h1 style="margin-bottom: 30px;"><i class="fas fa-box" style="color: #ff6b6b;"></i> My Orders</h1>
      
      <div id="ordersList">
        <div style="text-align: center; padding: 60px;">
          <i class="fas fa-spinner fa-spin fa-2x" style="color: #ff6b6b;"></i>
          <p style="margin-top: 16px; color: #666;">Loading orders...</p>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = Pages.wrap(content, { title: 'My Orders - FoodZap' });
  
  setTimeout(() => {
    Pages.loadOrders();
  }, 100);
};

Pages.loadOrders = async function() {
  const container = document.getElementById('ordersList');
  
  try {
    const result = await API.orders.getHistory();
    
    if (result.success && result.data && result.data.length > 0) {
      container.innerHTML = result.data.map(order => `
        <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <h3 style="font-size: 1.1rem; margin-bottom: 4px;">Order #${order.orderId}</h3>
              <p style="color: #666; font-size: 0.9rem;">${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span style="background: ${Pages.getStatusColor(order.status)}; color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase;">
              ${order.status}
            </span>
          </div>
          
          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
            <div style="width: 60px; height: 60px; background: #f8f9fa; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
              🍽️
            </div>
            <div style="flex: 1;">
              <p style="font-weight: 500; margin-bottom: 4px;">${order.restaurant?.name || 'Restaurant'}</p>
              <p style="color: #666; font-size: 0.9rem;">${order.items?.length || 0} items • ${Utils.formatPrice(order.pricing?.totalAmount || 0)}</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 12px;">
            <button onclick="Router.navigate('/order-tracking?orderId=${order.orderId}')" style="flex: 1; background: #ff6b6b; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: 500;">
              Track Order
            </button>
            <button onclick="Pages.reorder('${order._id}')" style="background: #f8f9fa; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; font-weight: 500; color: #444;">
              <i class="fas fa-redo"></i> Reorder
            </button>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = `
        <div style="text-align: center; padding: 80px 40px; background: white; border-radius: 20px;">
          <i class="fas fa-box-open" style="font-size: 4rem; color: #e0e0e0; margin-bottom: 20px;"></i>
          <h2 style="margin-bottom: 12px;">No orders yet</h2>
          <p style="color: #666; margin-bottom: 24px;">Start ordering your favorite food!</p>
          <button onclick="Router.navigate('/restaurants')" style="background: #ff6b6b; color: white; border: none; padding: 14px 32px; border-radius: 30px; font-weight: 600; cursor: pointer;">
            Browse Restaurants
          </button>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #ff6b6b;">
        <i class="fas fa-exclamation-circle fa-2x" style="margin-bottom: 16px;"></i>
        <p>Failed to load orders</p>
      </div>
    `;
  }
};

Pages.getStatusColor = function(status) {
  const colors = {
    'pending': '#ffc107',
    'confirmed': '#17a2b8',
    'preparing': '#ff6b6b',
    'out_for_delivery': '#764ba2',
    'delivered': '#00b894',
    'cancelled': '#dc3545'
  };
  return colors[status] || '#666';
};

Pages.reorder = function(orderId) {
  Utils.showToast('Reorder feature coming soon', 'info');
};
