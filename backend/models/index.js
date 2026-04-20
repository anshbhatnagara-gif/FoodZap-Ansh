/**
 * Models Index
 * Central export for all database models
 */

const User = require('./user.model');
const Restaurant = require('./restaurant.model');
const MenuItem = require('./menu.model');
const Order = require('./order.model');
const Cart = require('./cart.model');
const Review = require('./review.model');
const Coupon = require('./coupon.model');

module.exports = {
  User,
  Restaurant,
  MenuItem,
  Order,
  Cart,
  Review,
  Coupon
};
