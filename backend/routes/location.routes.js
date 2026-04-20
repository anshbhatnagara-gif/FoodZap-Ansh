/**
 * Location Routes
 */

const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Public routes
router.get('/detect', locationController.detectLocation);
router.get('/geocode', locationController.geocodeAddress);
router.get('/reverse-geocode', locationController.reverseGeocode);
router.get('/nearby', locationController.getNearbyRestaurants);
router.get('/distance', locationController.calculateDelivery);
router.get('/autocomplete', locationController.autocompleteAddress);

// Protected routes
router.post('/address', authenticate, locationController.saveAddress);
router.put('/address/:addressId', authenticate, locationController.updateAddress);
router.delete('/address/:addressId', authenticate, locationController.deleteAddress);

module.exports = router;
