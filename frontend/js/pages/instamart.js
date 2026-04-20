/**
 * Instamart Page
 * Grocery delivery
 */

Pages.instamart = function(container) {
  const categories = [
    { name: 'Fruits & Vegetables', icon: '🥬', color: '#00b894' },
    { name: 'Dairy & Eggs', icon: '🥛', color: '#4ecdc4' },
    { name: 'Snacks', icon: '🍿', color: '#ff6b6b' },
    { name: 'Beverages', icon: '🥤', color: '#45b7d1' },
    { name: 'Household', icon: '🧼', color: '#764ba2' },
    { name: 'Personal Care', icon: '🧴', color: '#667eea' }
  ];
  
  const products = [
    { name: 'Fresh Apples (500g)', price: 89, mrp: 120, image: '🍎', discount: '26% OFF' },
    { name: 'Banana (1 dozen)', price: 45, mrp: 60, image: '🍌', discount: '25% OFF' },
    { name: 'Tomato (1 kg)', price: 35, mrp: 50, image: '🍅', discount: '30% OFF' },
    { name: 'Potato (1 kg)', price: 28, mrp: 40, image: '🥔', discount: '30% OFF' },
    { name: 'Milk (1L)', price: 68, mrp: 72, image: '🥛', discount: '6% OFF' },
    { name: 'Bread', price: 35, mrp: 40, image: '🍞', discount: '12% OFF' },
    { name: 'Eggs (12 pcs)', price: 85, mrp: 100, image: '🥚', discount: '15% OFF' },
    { name: 'Rice (5kg)', price: 245, mrp: 320, image: '🍚', discount: '23% OFF' }
  ];
  
  const content = `
    <!-- Hero Banner -->
    <div style="background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); color: white; padding: 50px 0;">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 30px;">
          <div>
            <h1 style="font-size: 2.5rem; margin-bottom: 12px;">🛒 Instamart</h1>
            <p style="font-size: 1.2rem; opacity: 0.95; margin-bottom: 8px;">Groceries delivered in 15-30 minutes</p>
            <div style="display: flex; gap: 20px; margin-top: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700;">15-30</div>
                <div style="font-size: 0.85rem; opacity: 0.9;">min delivery</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700;">1000+</div>
                <div style="font-size: 0.85rem; opacity: 0.9;">products</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700;">Up to 50%</div>
                <div style="font-size: 0.85rem; opacity: 0.9;">discount</div>
              </div>
            </div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 6rem;">🚀</div>
          </div>
        </div>
      </div>
    </div>

    <div class="container" style="padding: 40px 0;">
      <!-- Categories -->
      <div style="margin-bottom: 40px;">
        <h2 style="margin-bottom: 20px;">Categories</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px;">
          ${categories.map(cat => `
            <div style="background: white; border-radius: 16px; padding: 24px; text-align: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s; border-bottom: 3px solid ${cat.color};"
                 onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.12)'"
                 onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
              <div style="font-size: 3rem; margin-bottom: 12px;">${cat.icon}</div>
              <div style="font-weight: 600; font-size: 0.95rem;">${cat.name}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Products -->
      <div style="margin-bottom: 40px;">
        <h2 style="margin-bottom: 20px;">Popular Products</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
          ${products.map(p => `
            <div style="background: white; border-radius: 16px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: relative; transition: transform 0.2s;"
                 onmouseover="this.style.transform='translateY(-4px)'"
                 onmouseout="this.style.transform=''">
              <div style="position: absolute; top: 12px; left: 12px; background: #00b894; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                ${p.discount}
              </div>
              <div style="font-size: 4rem; text-align: center; margin: 20px 0;">${p.image}</div>
              <h4 style="margin-bottom: 8px; font-size: 0.95rem;">${p.name}</h4>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="font-weight: 700; font-size: 1.1rem;">${Utils.formatPrice(p.price)}</span>
                <span style="text-decoration: line-through; color: #999; font-size: 0.9rem;">${Utils.formatPrice(p.mrp)}</span>
              </div>
              <button onclick="Utils.showToast('${p.name} added to cart!', 'success')" style="width: 100%; background: #00b894; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Why Instamart -->
      <div style="background: #f8f9fa; border-radius: 20px; padding: 40px;">
        <h2 style="text-align: center; margin-bottom: 30px;">Why choose Instamart?</h2>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
          <div style="text-align: center;">
            <div style="width: 70px; height: 70px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              ⚡
            </div>
            <h4 style="margin-bottom: 8px;">Lightning Fast</h4>
            <p style="color: #666; font-size: 0.9rem;">15-30 min delivery</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 70px; height: 70px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              💰
            </div>
            <h4 style="margin-bottom: 8px;">Best Prices</h4>
            <p style="color: #666; font-size: 0.9rem;">Up to 50% off MRP</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 70px; height: 70px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              🥬
            </div>
            <h4 style="margin-bottom: 8px;">Fresh Quality</h4>
            <p style="color: #666; font-size: 0.9rem;">Handpicked items</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 70px; height: 70px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              🔄
            </div>
            <h4 style="margin-bottom: 8px;">Easy Returns</h4>
            <p style="color: #666; font-size: 0.9rem;">No questions asked</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = Pages.wrap(content, { title: 'Instamart - FoodZap' });
};
