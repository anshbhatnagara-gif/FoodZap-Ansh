/**
 * Location Controller
 * Handles location-based operations
 */

const locationService = require('../services/location.service');
const User = require('../models/user.model');
const Restaurant = require('../models/restaurant.model');

/**
 * Geocode an address
 */
exports.geocodeAddress = async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    const result = await locationService.geocodeAddress(address);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Reverse geocode coordinates
 */
exports.reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const result = await locationService.reverseGeocode(parseFloat(lat), parseFloat(lng));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Detect user location
 */
exports.detectLocation = async (req, res, next) => {
  try {
    // If user provides coordinates, reverse geocode
    if (req.query.lat && req.query.lng) {
      const result = await locationService.reverseGeocode(
        parseFloat(req.query.lat),
        parseFloat(req.query.lng)
      );
      
      if (result.success) {
        return res.json({
          success: true,
          data: {
            detected: true,
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
            address: result.address,
            formattedAddress: result.formattedAddress
          }
        });
      }
    }

    // Try IP-based location (simplified - in production use a service like ipapi)
    res.json({
      success: true,
      data: {
        detected: false,
        message: 'Please enable location services or enter your address manually'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get nearby restaurants
 */
exports.getNearbyRestaurants = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000, cuisine, veg } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Build query
    const query = {
      status: 'approved',
      isActive: true,
      'address.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    };

    if (cuisine) {
      query.cuisine = { $in: cuisine.split(',') };
    }

    if (veg === 'true') {
      query.foodType = { $in: ['veg', 'both'] };
    }

    const restaurants = await Restaurant.find(query)
      .select('name address cuisine rating priceForTwo images delivery isOpen')
      .limit(20);

    // Calculate distance for each restaurant
    const restaurantsWithDistance = await Promise.all(
      restaurants.map(async (restaurant) => {
        const distance = await locationService.calculateDistance(
          [parseFloat(lng), parseFloat(lat)],
          restaurant.address.location.coordinates
        );

        return {
          ...restaurant.toObject(),
          distance: distance.success ? distance : null
        };
      })
    );

    // Sort by distance
    restaurantsWithDistance.sort((a, b) => {
      const distA = a.distance?.distance?.value || Infinity;
      const distB = b.distance?.distance?.value || Infinity;
      return distA - distB;
    });

    res.json({
      success: true,
      count: restaurantsWithDistance.length,
      data: restaurantsWithDistance
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate delivery distance
 */
exports.calculateDelivery = async (req, res, next) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.query;

    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination coordinates are required'
      });
    }

    const origin = [parseFloat(originLng), parseFloat(originLat)];
    const destination = [parseFloat(destLng), parseFloat(destLat)];

    const result = await locationService.calculateDistance(origin, destination);

    if (result.success) {
      // Calculate delivery fee based on distance
      const distanceKm = parseFloat(result.distanceKm);
      let deliveryFee = 0;

      if (distanceKm <= 2) deliveryFee = 0;
      else if (distanceKm <= 5) deliveryFee = 20;
      else if (distanceKm <= 10) deliveryFee = 40;
      else deliveryFee = 60;

      res.json({
        success: true,
        data: {
          ...result,
          deliveryFee,
          estimatedTime: Math.round(distanceKm * 4) // Rough estimate: 4 mins per km
        }
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get address autocomplete suggestions
 */
exports.autocompleteAddress = async (req, res, next) => {
  try {
    const { input, lat, lng } = req.query;

    if (!input) {
      return res.status(400).json({
        success: false,
        message: 'Input is required'
      });
    }

    const location = lat && lng ? [parseFloat(lng), parseFloat(lat)] : null;
    const result = await locationService.autocomplete(input, location);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Save user address
 */
exports.saveAddress = async (req, res, next) => {
  try {
    const { label, address, landmark, city, state, pincode, lat, lng } = req.body;
    const userId = req.user.id;

    // If coordinates not provided, geocode the address
    let coordinates = [lng, lat];
    if (!lat || !lng) {
      const geoResult = await locationService.geocodeAddress(
        `${address}, ${city}, ${state}, ${pincode}`
      );
      if (geoResult.success) {
        coordinates = geoResult.coordinates;
      }
    }

    const newAddress = {
      label: label || 'Other',
      address,
      landmark,
      city,
      state,
      pincode,
      location: {
        type: 'Point',
        coordinates
      },
      isDefault: false
    };

    // Check if this is the first address
    const existingAddresses = await User.getAddresses(userId);
    if (existingAddresses.length === 0) {
      newAddress.isDefault = true;
    }

    // Add address using User model
    const addedAddress = await User.addAddress(userId, {
      label: newAddress.label,
      street: address,
      city,
      state,
      pincode,
      landmark,
      latitude: coordinates ? coordinates[1] : null,
      longitude: coordinates ? coordinates[0] : null,
      isDefault: newAddress.isDefault
    });

    res.json({
      success: true,
      message: 'Address saved successfully',
      data: addedAddress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user address
 */
exports.updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    // Update address using User model
    const updatedAddress = await User.updateAddress(addressId, userId, {
      label: updates.label,
      street: updates.address,
      city: updates.city,
      state: updates.state,
      pincode: updates.pincode,
      landmark: updates.landmark,
      latitude: updates.coordinates ? updates.coordinates[1] : null,
      longitude: updates.coordinates ? updates.coordinates[0] : null,
      isDefault: updates.isDefault
    });

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: updatedAddress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user address
 */
exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    // Delete address using User model
    const result = await User.deleteAddress(addressId, userId);

    if (!result || !result.deleted) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
