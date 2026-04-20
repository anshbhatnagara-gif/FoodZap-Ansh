/**
 * Offers Page
 * Deals, coupons, and promotions
 */

Pages.offers = function(container) {
  const content = `
    <div class="container" style="padding: 40px 0;">
      <h1 style="margin-bottom: 30px;"><i class="fas fa-gift" style="color: #ff6b6b;"></i> Today's Offers</h1>
      
      <!-- Hero Offer -->
      <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); color: white; border-radius: 24px; padding: 40px; margin-bottom: 40px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;">
          <div>
            <h2 style="font-size: 2rem; margin-bottom: 12px;">50% OFF on First Order! 🎉</h2>
            <p style="font-size: 1.1rem; opacity: 0.95; margin-bottom: 16px;">Use code <strong>FIRST50</strong> and get 50% discount up to ₹100</p>
            <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 30px; font-weight: 600;">
              Code: FIRST50
            </div>
          </div>
          <button onclick="Cart.applyCoupon('FIRST50', 50); Utils.showToast('Coupon FIRST50 applied!', 'success'); Router.navigate('/restaurants');" 
                  style="background: white; color: #ff6b6b; border: none; padding: 16px 32px; border-radius: 30px; font-weight: 700; cursor: pointer; font-size: 1.1rem;">
            Order Now <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Offer Categories -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;">
        ${[
          { title: 'Free Delivery', desc: 'On orders above ₹499', code: 'FREEDEL', color: '#4ecdc4', icon: 'fa-shipping-fast' },
          { title: 'Buy 1 Get 1', desc: 'On selected items', code: 'BOGO', color: '#45b7d1', icon: 'fa-gift' },
          { title: '20% Cashback', desc: 'Using FoodZap Wallet', code: 'CASHBACK20', color: '#00b894', icon: 'fa-wallet' },
          { title: '30% OFF', desc: 'On all restaurants', code: 'FOOD30', color: '#ff6b6b', icon: 'fa-percent' },
          { title: 'Free Dessert', desc: 'On orders above ₹999', code: 'DESSERT', color: '#764ba2', icon: 'fa-ice-cream' },
          { title: '₹100 OFF', desc: 'On first 3 orders', code: 'SAVE100', color: '#667eea', icon: 'fa-rupee-sign' }
        ].map(o => `
          <div style="background: white; border-radius: 20px; padding: 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: transform 0.2s; cursor: pointer;"
               onmouseover="this.style.transform='translateY(-4px)'"
               onmouseout="this.style.transform=''"
               onclick="Cart.applyCoupon('${o.code}', 0); Utils.showToast('Coupon ${o.code} applied!', 'success');">
            <div style="width: 60px; height: 60px; background: ${o.color}15; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <i class="fas ${o.icon}" style="font-size: 1.5rem; color: ${o.color};"></i>
            </div>
            <h3 style="font-size: 1.3rem; margin-bottom: 8px;">${o.title}</h3>
            <p style="color: #666; margin-bottom: 16px;">${o.desc}</p>
            <div style="display: inline-block; background: ${o.color}15; color: ${o.color}; padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
              ${o.code}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Bank Offers -->
      <div style="background: white; border-radius: 20px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 40px;">
        <h2 style="margin-bottom: 24px;"><i class="fas fa-university" style="color: #667eea;"></i> Bank Offers</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
          <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; display: flex; gap: 16px;">
            <div style="width: 50px; height: 50px; background: #1e3a8a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
              HDFC
            </div>
            <div>
              <h4 style="margin-bottom: 4px;">HDFC Credit Card</h4>
              <p style="color: #666; font-size: 0.9rem;">10% instant discount up to ₹150</p>
            </div>
          </div>
          <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; display: flex; gap: 16px;">
            <div style="width: 50px; height: 50px; background: #dc2626; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
              ICICI
            </div>
            <div>
              <h4 style="margin-bottom: 4px;">ICICI Debit Card</h4>
              <p style="color: #666; font-size: 0.9rem;">15% off on orders above ₹500</p>
            </div>
          </div>
          <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; display: flex; gap: 16px;">
            <div style="width: 50px; height: 50px; background: #059669; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
              SBI
            </div>
            <div>
              <h4 style="margin-bottom: 4px;">SBI Credit Card</h4>
              <p style="color: #666; font-size: 0.9rem;">Flat ₹75 off on first order</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Wallet Offers -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 20px; padding: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
          <div>
            <h2 style="margin-bottom: 8px;"><i class="fas fa-wallet"></i> Add Money & Get Cashback</h2>
            <p style="opacity: 0.9;">Add ₹500 or more to your wallet and get 5% instant cashback</p>
          </div>
          <button onclick="Router.navigate('/wallet')" style="background: white; color: #667eea; border: none; padding: 14px 28px; border-radius: 30px; font-weight: 600; cursor: pointer;">
            Add Money Now
          </button>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = Pages.wrap(content, { title: 'Offers - FoodZap' });
};
