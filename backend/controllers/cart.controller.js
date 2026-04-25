/**
 * Cart Controller
 * Handles shopping cart operations
 */

const Cart = require('../models/cart.model');
const MenuItem = require('../models/menu.model');
const Restaurant = require('../models/restaurant.model');
const { db } = require('../config/database');

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

    // Get cart
    const cart = await Cart.getOrCreate(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found or empty'
      });
    }

    // Check if item exists in cart
    const itemExists = cart.items.some(i => i.menuItemId == itemId);
    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update quantity using cart model
    await Cart.updateItemQuantity(userId, itemId, parseInt(quantity));

    // Get updated cart summary
    const cartSummary = await Cart.getCartSummary(userId);

    res.json({
      success: true,
      message: 'Quantity updated',
      data: cartSummary
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

    // Remove item using cart model
    await Cart.removeItem(userId, itemId);

    // Get updated cart summary
    const cartSummary = await Cart.getCartSummary(userId);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cartSummary
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

    // Clear cart using cart model
    await Cart.clear(userId);

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
    const coupon = await Coupon.findByCode(code.toUpperCase());

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired coupon code'
      });
    }

    const cart = await Cart.getOrCreate(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const itemsTotal = cart.totalAmount || 0;

    // Validate coupon (simplified - check minimum order amount)
    if (coupon.minOrderAmount && itemsTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ${coupon.minOrderAmount} required`
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round(itemsTotal * (coupon.discountValue / 100));
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Apply coupon to cart using SQL
    await db.query(
      `UPDATE carts SET couponCode = ?, couponDiscount = ? WHERE userId = ?`,
      [coupon.code, discount, userId]
    );

    const cartSummary = await Cart.getCartSummary(userId);

    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        coupon: {
          code: coupon.code,
          discount: discount,
          type: coupon.discountType
        },
        discount,
        newTotal: cartSummary.totalAmount - discount,
        cart: cartSummary
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

    // Remove coupon using SQL
    await db.query(
      `UPDATE carts SET couponCode = NULL, couponDiscount = 0 WHERE userId = ?`,
      [userId]
    );

    const cartSummary = await Cart.getCartSummary(userId);

    res.json({
      success: true,
      message: 'Coupon removed',
      data: cartSummary
    });
  } catch (error) {
    next(error);
  }
};
