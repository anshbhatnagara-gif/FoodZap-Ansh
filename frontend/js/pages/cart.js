/**
 * Cart Page
 * Shopping cart with items and checkout button
 */

Pages.cart = function(container) {
  const content = `
    <div class="container" style="padding: 40px 0; max-width: 900px;">
      <h1 style="margin-bottom: 30px;"><i class="fas fa-shopping-cart" style="color: #ff6b6b;"></i> Your Cart</h1>
      
      <div id="cartContent">
        <div style="text-align: center; padding: 60px;">
          <i class="fas fa-spinner fa-spin fa-2x" style="color: #ff6b6b;"></i>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = Pages.wrap(content, { title: 'Cart - FoodZap' });
  
  setTimeout(() => {
    Pages.renderCartContent();
  }, 100);
};

Pages.renderCartContent = function() {
  const cart = Utils.getStorage('cart', { items: [], restaurant: null });
  const container = document.getElementById('cartContent');
  
  if (!cart.items || cart.items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 80px 40px; background: white; border-radius: 20px;">
        <i class="fas fa-shopping-cart" style="font-size: 5rem; color: #e0e0e0; margin-bottom: 24px;"></i>
        <h2 style="margin-bottom: 12px;">Your cart is empty</h2>
        <p style="color: #666; margin-bottom: 24px;">Add some delicious food to your cart!</p>
        <button onclick="Router.navigate('/restaurants')" style="background: #ff6b6b; color: white; border: none; padding: 14px 32px; border-radius: 30px; font-weight: 600; cursor: pointer; font-size: 1rem;">
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
      <div style="display: flex; gap: 20px; padding: 20px; border-bottom: 1px solid #f0f0f0; align-items: center;">
        <div style="flex: 1;">
          <h4 style="margin-bottom: 6px; font-size: 1.1rem;">${item.name}</h4>
          ${item.variant ? `<p style="font-size: 0.85rem; color: #666; margin-bottom: 4px;">${item.variant.name}</p>` : ''}
          <p style="font-size: 0.95rem; color: #ff6b6b; font-weight: 600;">${Utils.formatPrice(price)}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; background: #f8f9fa; padding: 8px 12px; border-radius: 8px;">
          <button onclick="Cart.updateQuantity('${item.menuItemId}', ${item.quantity - 1})" style="width: 28px; height: 28px; border: none; background: white; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-minus" style="font-size: 0.7rem;"></i>
          </button>
          <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
          <button onclick="Cart.updateQuantity('${item.menuItemId}', ${item.quantity + 1})" style="width: 28px; height: 28px; border: none; background: white; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-plus" style="font-size: 0.7rem;"></i>
          </button>
        </div>
        <div style="font-weight: 600; min-width: 80px; text-align: right; font-size: 1.1rem;">
          ${Utils.formatPrice(itemTotal)}
        </div>
        <button onclick="Cart.removeItem('${item.menuItemId}')" style="color: #ff6b6b; background: none; border: none; cursor: pointer; padding: 8px;">
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
    <div style="display: grid; grid-template-columns: 1fr 350px; gap: 24px;">
      <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        ${itemsHtml}
      </div>
      
      <div>
        <div style="background: white; border-radius: 20px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 100px;">
          <h3 style="margin-bottom: 20px; font-size: 1.3rem;">Bill Details</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #666;">
            <span>Item Total</span>
            <span>${Utils.formatPrice(itemsTotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #666;">
            <span>Delivery Fee</span>
            <span style="color: ${deliveryFee === 0 ? '#00b894' : '#666'};">${deliveryFee === 0 ? 'FREE' : Utils.formatPrice(deliveryFee)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; color: #666;">
            <span>Platform Fee</span>
            <span>${Utils.formatPrice(platformFee)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px solid #f0f0f0; color: #666;">
            <span>GST</span>
            <span>${Utils.formatPrice(gst)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: 700; margin-bottom: 20px;">
            <span>To Pay</span>
            <span style="color: #ff6b6b;">${Utils.formatPrice(total)}</span>
          </div>
          <button onclick="Router.navigate('/checkout')" style="background: #ff6b6b; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer; width: 100%; font-size: 1.1rem;">
            Proceed to Checkout <i class="fas fa-arrow-right" style="margin-left: 8px;"></i>
          </button>
        </div>
      </div>
    </div>
  `;
};
