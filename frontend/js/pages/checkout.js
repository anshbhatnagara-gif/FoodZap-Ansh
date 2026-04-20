/**
 * Checkout Page
 * Payment and address selection
 */

Pages.checkout = function(container) {
  const content = `
    <div class="container" style="padding: 40px 0;">
      <div style="display: grid; grid-template-columns: 1fr 380px; gap: 30px;">
        <!-- Left Column -->
        <div>
          <!-- Delivery Address -->
          <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <h3 style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
              <span style="background: #ff6b6b; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">1</span>
              Delivery Address
            </h3>
            <div id="addressesList">
              <p style="color: #666;">Loading addresses...</p>
            </div>
            <button onclick="Pages.showAddAddressModal()" style="margin-top: 16px; background: none; border: 2px dashed #ddd; padding: 12px 24px; border-radius: 12px; cursor: pointer; color: #666; font-weight: 500; width: 100%;">
              <i class="fas fa-plus"></i> Add New Address
            </button>
          </div>
          
          <!-- Payment Method -->
          <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <h3 style="margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
              <span style="background: #ff6b6b; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">2</span>
              Payment Method
            </h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <label style="display: flex; align-items: center; gap: 16px; padding: 16px; border: 2px solid #ff6b6b; border-radius: 12px; cursor: pointer; background: rgba(255,107,107,0.05);">
                <input type="radio" name="payment" value="cod" checked style="width: 20px; height: 20px; accent-color: #ff6b6b;">
                <i class="fas fa-money-bill-wave" style="font-size: 1.5rem; color: #00b894;"></i>
                <div>
                  <div style="font-weight: 600;">Cash on Delivery</div>
                  <div style="font-size: 0.85rem; color: #666;">Pay when you receive</div>
                </div>
              </label>
              <label style="display: flex; align-items: center; gap: 16px; padding: 16px; border: 2px solid #e0e0e0; border-radius: 12px; cursor: pointer; transition: border-color 0.2s;"
                     onmouseover="this.style.borderColor='#ff6b6b'" onmouseout="if(!this.querySelector('input').checked) this.style.borderColor='#e0e0e0'">
                <input type="radio" name="payment" value="online" style="width: 20px; height: 20px; accent-color: #ff6b6b;">
                <i class="fas fa-credit-card" style="font-size: 1.5rem; color: #ff6b6b;"></i>
                <div>
                  <div style="font-weight: 600;">Pay Online</div>
                  <div style="font-size: 0.85rem; color: #666;">Card, UPI, NetBanking</div>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Right Column - Order Summary -->
        <div>
          <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 100px;">
            <h3 style="margin-bottom: 20px; font-size: 1.2rem;">Order Summary</h3>
            <div id="orderSummary">
              <p style="color: #666;">Loading...</p>
            </div>
            <button id="placeOrderBtn" onclick="Pages.placeOrder()" style="background: #ff6b6b; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer; width: 100%; font-size: 1.1rem; margin-top: 20px;">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = Pages.wrap(content, { title: 'Checkout - FoodZap' });
  
  setTimeout(() => {
    Pages.renderCheckoutSummary();
    Pages.loadCheckoutAddresses();
  }, 100);
};

Pages.renderCheckoutSummary = function() {
  const cart = Utils.getStorage('cart', { items: [], restaurant: null });
  const container = document.getElementById('orderSummary');
  
  if (!cart.items || cart.items.length === 0) {
    container.innerHTML = '<p style="color: #ff6b6b;">Your cart is empty</p>';
    return;
  }
  
  let itemsTotal = 0;
  const itemsHtml = cart.items.map(item => {
    let price = item.price;
    if (item.variant?.price) price = item.variant.price;
    const itemTotal = price * item.quantity;
    itemsTotal += itemTotal;
    return `
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem; color: #444;">
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
    <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0;">
      ${itemsHtml}
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #666; font-size: 0.95rem;">
      <span>Subtotal</span>
      <span>${Utils.formatPrice(itemsTotal)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #666; font-size: 0.95rem;">
      <span>Delivery</span>
      <span style="color: ${deliveryFee === 0 ? '#00b894' : '#666'}; font-weight: ${deliveryFee === 0 ? '600' : 'normal'};">${deliveryFee === 0 ? 'FREE' : Utils.formatPrice(deliveryFee)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #666; font-size: 0.95rem;">
      <span>GST</span>
      <span>${Utils.formatPrice(gst)}</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: 700; margin-top: 16px; padding-top: 16px; border-top: 2px solid #f0f0f0;">
      <span>Total</span>
      <span style="color: #ff6b6b;">${Utils.formatPrice(total)}</span>
    </div>
  `;
};

Pages.loadCheckoutAddresses = function() {
  const addresses = Utils.getSavedAddresses();
  const container = document.getElementById('addressesList');
  
  if (addresses.length === 0) {
    container.innerHTML = '<p style="color: #666;">No saved addresses. Please add one.</p>';
    return;
  }
  
  container.innerHTML = addresses.map((addr, index) => `
    <label style="display: block; padding: 16px; border: 2px solid ${index === 0 ? '#ff6b6b' : '#e0e0e0'}; border-radius: 12px; margin-bottom: 12px; cursor: pointer; background: ${index === 0 ? 'rgba(255,107,107,0.03)' : 'white'};">
      <div style="display: flex; gap: 12px;">
        <input type="radio" name="address" value="${index}" ${index === 0 ? 'checked' : ''} style="margin-top: 2px;">
        <div>
          <strong style="font-size: 1.05rem;">${addr.label || 'Address'}</strong>
          <p style="margin: 6px 0 0 0; color: #666; font-size: 0.9rem; line-height: 1.5;">${addr.address}</p>
        </div>
      </div>
    </label>
  `).join('');
};

Pages.placeOrder = async function() {
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
  
  const addressRadio = document.querySelector('input[name="address"]:checked');
  if (!addressRadio) {
    Utils.showToast('Please select delivery address', 'warning');
    btn.disabled = false;
    btn.textContent = 'Place Order';
    return;
  }
  
  const addresses = Utils.getSavedAddresses();
  const selectedAddress = addresses[parseInt(addressRadio.value)];
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
};

Pages.showAddAddressModal = function() {
  Utils.showToast('Add address feature - implement modal here', 'info');
};
