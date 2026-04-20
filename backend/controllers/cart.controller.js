/**
 * Cart Controller
 * Handles shopping cart operations
 */

const Cart = require('../models/cart.model');
const MenuItem = require('../models/menu.model');
const Restaurant = require('../models/restaurant.model');

/**
 * Get user's cart
 */
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cartSummary = await Cart.getCartSummary(userId);

    res.json({
      success: true,
      data: cartSummary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to cart
 */
exports.addToCart = async (req, res, next) => {
  try {
    const { menuItemId, quantity = 1, variant, addons, specialInstructions } = req.body;
    const userId = req.user.id;

    // Validate menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    if (!menuItem.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This item is currently unavailable'
      });
    }

    // Add to cart using MySQL model
    const cart = await Cart.addItem(userId, {
      menuItemId,
      restaurantId: menuItem.restaurantId,
      name: menuItem.name,
      price: menuItem.price,
      quantity: parseInt(quantity),
      variant,
      addons,
      specialInstructions
    });

    // Get updated cart summary
    const cartSummary = await Cart.getCartSummary(userId);

    res.json({
      success: true,
      message: 'Item added to cart',
      data: cartSummary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item quantity
 */
exports.updateQuantity = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    item.quantity = parseInt(quantity);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.menuItem');

    const totals = populatedCart.calculateTotals();

    res.json({
      success: true,
      message: 'Quantity updated',
      data: {
        items: populatedCart.items,
        totals
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart
 */
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items.pull(itemId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('items.menuItem');

    const totals = populatedCart.calculateTotals();

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: {
        items: populatedCart.items,
        totals
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear cart
 */
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.coupon = undefined;
      cart.activeRestaurant = undefined;
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Apply coupon
 */
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const Coupon = require('../models/coupon.model');
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired coupon code'
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.menuItem');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const totals = cart.calculateTotals();

    // Validate coupon
    const validation = coupon.isValid(userId, totals.itemsTotal);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.reason
      });
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(totals.itemsTotal);

    // Apply coupon
    cart.coupon = {
      code: coupon.code,
      discount: discount,
      type: coupon.discountType
    };
    await cart.save();

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        coupon: cart.coupon,
        discount,
        newTotal: totals.totalAmount - discount
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove coupon
 */
exports.removeCoupon = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.coupon = undefined;
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Coupon removed'
    });
  } catch (error) {
    next(error);
  }
};
