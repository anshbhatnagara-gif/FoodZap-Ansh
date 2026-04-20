/**
 * Cart Module
 * Handles cart operations and UI
 */

const Cart = {
  items: [],
  restaurant: null,
  coupon: null,
  
  init() {
    this.loadFromStorage();
    this.setupEventListeners();
    this.updateUI();
  },
  
  setupEventListeners() {
    // Cart button click
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.toggleCart());
    }
    
    // Close cart
    const closeCart = document.getElementById('closeCart');
    if (closeCart) {
      closeCart.addEventListener('click', () => this.closeCart());
    }
    
    // Overlay click
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.closeCart());
    }
  },
  
  loadFromStorage() {
    const data = Utils.getStorage('cart', { items: [], restaurant: null, coupon: null });
    this.items = data.items || [];
    this.restaurant = data.restaurant;
    this.coupon = data.coupon;
  },
  
  saveToStorage() {
    Utils.setStorage('cart', {
      items: this.items,
      restaurant: this.restaurant,
      coupon: this.coupon
    });
  },
  
  async addItem(item) {
    // If cart has items from different restaurant, warn user
    if (this.items.length > 0 && this.restaurant && this.restaurant.id !== item.restaurant.id) {
      const confirmed = confirm(
        `Your cart has items from ${this.restaurant.name}. Adding items from ${item.restaurant.name} will clear your current cart. Continue?`
      );
      if (!confirmed) return false;
      this.clearCart(false);
    }
    
    // Check if item already exists (same item, variant, and addons)
    const existingIndex = this.items.findIndex(i => 
      i.menuItemId === item.menuItemId &&
      JSON.stringify(i.variant) === JSON.stringify(item.variant) &&
      JSON.stringify(i.addons?.sort()) === JSON.stringify(item.addons?.sort())
    );
    
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += item.quantity;
    } else {
      this.items.push({
        id: Utils.generateId('item_'),
        ...item,
        addedAt: new Date().toISOString()
      });
    }
    
    this.restaurant = item.restaurant;
    this.saveToStorage();
    this.updateUI();
    
    Utils.showToast(`${item.name} added to cart`, 'success');
    return true;
  },
  
  updateQuantity(itemId, quantity) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;
    
    if (quantity <= 0) {
      this.removeItem(itemId);
    } else {
      item.quantity = quantity;
      this.saveToStorage();
      this.updateUI();
    }
  },
  
  removeItem(itemId) {
    this.items = this.items.filter(i => i.id !== itemId);
    
    if (this.items.length === 0) {
      this.restaurant = null;
      this.coupon = null;
    }
    
    this.saveToStorage();
    this.updateUI();
  },
  
  clearCart(save = true) {
    this.items = [];
    this.restaurant = null;
    this.coupon = null;
    if (save) {
      this.saveToStorage();
      this.updateUI();
    }
  },
  
  applyCoupon(code, discount) {
    this.coupon = { code, discount };
    this.saveToStorage();
    this.updateUI();
  },
  
  removeCoupon() {
    this.coupon = null;
    this.saveToStorage();
    this.updateUI();
  },
  
  getTotals() {
    let itemsTotal = 0;
    
    this.items.forEach(item => {
      let price = item.price;
      if (item.variant?.price) price = item.variant.price;
      
      let addonsTotal = 0;
      if (item.addons) {
        addonsTotal = item.addons.reduce((sum, a) => sum + (a.price || 0), 0);
      }
      
      itemsTotal += (price + addonsTotal) * item.quantity;
    });
    
    const deliveryFee = itemsTotal > 500 ? 0 : 40;
    const platformFee = 5;
    const gst = Math.round(itemsTotal * 0.05);
    const discount = this.coupon?.discount || 0;
    const totalAmount = itemsTotal + deliveryFee + platformFee + gst - discount;
    
    return {
      itemsTotal,
      itemCount: this.items.reduce((sum, i) => sum + i.quantity, 0),
      deliveryFee,
      platformFee,
      gst,
      discount,
      totalAmount: Math.max(0, totalAmount)
    };
  },
  
  toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar.classList.contains('open')) {
      this.closeCart();
    } else {
      sidebar.classList.add('open');
      overlay.classList.add('show');
      this.renderCart();
      document.body.style.overflow = 'hidden';
    }
  },
  
  closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  },
  
  updateUI() {
    // Update cart count badge
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      const totals = this.getTotals();
      if (totals.itemCount > 0) {
        cartCount.textContent = totals.itemCount;
        cartCount.style.display = 'inline-flex';
      } else {
        cartCount.style.display = 'none';
      }
    }
    
    // If cart is open, re-render
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar?.classList.contains('open')) {
      this.renderCart();
    }
  },
  
  renderCart() {
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    
    if (!cartBody) return;
    
    if (this.items.length === 0) {
      cartBody.innerHTML = `
        <div style="text-align: center; padding: var(--xl);">
          <div style="font-size: 4rem; margin-bottom: var(--md);">🛒</div>
          <h3 style="margin-bottom: var(--sm);">Your cart is empty</h3>
          <p style="color: var(--dark-gray); margin-bottom: var(--lg);">
            Looks like you haven't added anything yet!
          </p>
          <a href="restaurants.html" class="btn btn-primary" onclick="Cart.closeCart()">
            Browse Restaurants
          </a>
        </div>
      `;
      cartFooter.style.display = 'none';
      return;
    }
    
    // Restaurant info
    let html = `
      <div style="padding: var(--sm) 0; border-bottom: 1px solid var(--light-gray); margin-bottom: var(--md);">
        <div style="font-weight: 600;">${this.restaurant?.name || 'Restaurant'}</div>
        <div style="font-size: 0.85rem; color: var(--dark-gray);">
          ${this.items.length} item${this.items.length > 1 ? 's' : ''}
        </div>
      </div>
    `;
    
    // Cart items
    this.items.forEach(item => {
      let price = item.price;
      if (item.variant?.price) price = item.variant.price;
      
      let addonsTotal = 0;
      if (item.addons) {
        addonsTotal = item.addons.reduce((sum, a) => sum + (a.price || 0), 0);
      }
      
      const itemTotal = (price + addonsTotal) * item.quantity;
      
      html += `
        <div class="cart-item">
          <img src="${item.image || CONFIG.PLACEHOLDER_IMAGE}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            ${item.variant ? `<div style="font-size: 0.8rem; color: var(--dark-gray);">${item.variant.name}</div>` : ''}
            <div class="cart-item-price">${Utils.formatPrice(itemTotal)}</div>
            <div class="quantity-control" style="margin-top: var(--sm);">
              <button class="qty-btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                <i class="fas fa-minus"></i>
              </button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <button class="btn btn-ghost" onclick="Cart.removeItem('${item.id}')" style="align-self: flex-start;">
            <i class="fas fa-trash" style="color: var(--danger);"></i>
          </button>
        </div>
      `;
    });
    
    cartBody.innerHTML = html;
    
    // Update totals
    const totals = this.getTotals();
    document.getElementById('cartSubtotal').textContent = Utils.formatPrice(totals.itemsTotal);
    document.getElementById('cartDelivery').textContent = totals.deliveryFee === 0 ? 'FREE' : Utils.formatPrice(totals.deliveryFee);
    document.getElementById('cartTotal').textContent = Utils.formatPrice(totals.totalAmount);
    
    cartFooter.style.display = 'block';
  },
  
  // Quick add from menu
  quickAdd(menuItem, restaurant) {
    const item = {
      menuItemId: menuItem._id || menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.images?.[0]?.url || menuItem.image,
      quantity: 1,
      restaurant: {
        id: restaurant._id || restaurant.id,
        name: restaurant.name
      },
      variant: null,
      addons: []
    };
    
    return this.addItem(item);
  }
};

// Make Cart available globally
window.Cart = Cart;
