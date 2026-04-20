/**
 * Location Service
 * Handles geocoding, distance calculation, and map-related operations
 */

const axios = require('axios');

class LocationService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  /**
   * Geocode an address to coordinates
   * @param {string} address - Address to geocode
   * @returns {Promise<Object>} Lat and lng
   */
  async geocodeAddress(address) {
    try {
      const url = `${this.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
      const response = await axios.get(url);

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        const formattedAddress = response.data.results[0].formatted_address;
        
        return {
          success: true,
          coordinates: [lng, lat],
          formattedAddress,
          placeId: response.data.results[0].place_id
        };
      }

      return {
        success: false,
        message: 'Could not geocode address'
      };
    } catch (error) {
      console.error('Geocoding Error:', error.message);
      return {
        success: false,
        message: 'Geocoding service error'
      };
    }
  }

  /**
   * Reverse geocode coordinates to address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} Address details
   */
  async reverseGeocode(lat, lng) {
    try {
      const url = `${this.baseUrl}/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
      const response = await axios.get(url);

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const addressComponents = result.address_components;

        // Extract address parts
        const getComponent = (type) => {
          const component = addressComponents.find(c => c.types.includes(type));
          return component ? component.long_name : '';
        };

        return {
          success: true,
          formattedAddress: result.formatted_address,
          address: {
            street: getComponent('route') + ' ' + getComponent('street_number'),
            area: getComponent('sublocality') || getComponent('neighborhood'),
            city: getComponent('locality') || getComponent('administrative_area_level_2'),
            state: getComponent('administrative_area_level_1'),
            pincode: getComponent('postal_code'),
            country: getComponent('country')
          },
          placeId: result.place_id
        };
      }

      return {
        success: false,
        message: 'Could not reverse geocode'
      };
    } catch (error) {
      console.error('Reverse Geocoding Error:', error.message);
      return {
        success: false,
        message: 'Reverse geocoding service error'
      };
    }
  }

  /**
   * Calculate distance between two points
   * @param {Array} origin - [lng, lat]
   * @param {Array} destination - [lng, lat]
   * @returns {Promise<Object>} Distance and duration
   */
  async calculateDistance(origin, destination) {
    try {
      const origins = `${origin[1]},${origin[0]}`;
      const destinations = `${destination[1]},${destination[0]}`;
      
      const url = `${this.baseUrl}/distancematrix/json?origins=${origins}&destinations=${destinations}&mode=driving&key=${this.apiKey}`;
      const response = await axios.get(url);

      if (response.data.status === 'OK') {
        const element = response.data.rows[0].elements[0];
        
        if (element.status === 'OK') {
          return {
            success: true,
            distance: {
              text: element.distance.text,
              value: element.distance.value // meters
            },
            duration: {
              text: element.duration.text,
              value: element.duration.value // seconds
            },
            distanceKm: (element.distance.value / 1000).toFixed(2)
          };
        }
      }

      return {
        success: false,
        message: 'Could not calculate distance'
      };
    } catch (error) {
      console.error('Distance Calculation Error:', error.message);
      // Fallback to Haversine formula
      return this.calculateHaversineDistance(origin, destination);
    }
  }

  /**
   * Calculate distance using Haversine formula (fallback)
   * @param {Array} origin - [lng, lat]
   * @param {Array} destination - [lng, lat]
   * @returns {Object} Distance
   */
  calculateHaversineDistance(origin, destination) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(destination[1] - origin[1]);
    const dLon = this.toRad(destination[0] - origin[0]);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(origin[1])) * Math.cos(this.toRad(destination[1])) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Estimate duration (assuming average speed of 25 km/h for delivery)
    const durationMinutes = Math.round((distance / 25) * 60);

    return {
      success: true,
      distance: {
        text: `${distance.toFixed(1)} km`,
        value: distance * 1000
      },
      duration: {
        text: `${durationMinutes} mins`,
        value: durationMinutes * 60
      },
      distanceKm: distance.toFixed(2),
      isEstimate: true
    };
  }

  toRad(value) {
    return value * Math.PI / 180;
  }

  /**
   * Get directions between two points
   * @param {Array} origin - [lng, lat]
   * @param {Array} destination - [lng, lat]
   * @returns {Promise<Object>} Route details
   */
  async getDirections(origin, destination) {
    try {
      const origins = `${origin[1]},${origin[0]}`;
      const destinations = `${destination[1]},${destination[0]}`;
      
      const url = `${this.baseUrl}/directions/json?origin=${origins}&destination=${destinations}&mode=driving&key=${this.apiKey}`;
      const response = await axios.get(url);

      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const leg = route.legs[0];

        return {
          success: true,
          route: {
            distance: leg.distance,
            duration: leg.duration,
            steps: leg.steps.map(step => ({
              instructions: step.html_instructions,
              distance: step.distance,
              duration: step.duration
            })),
            polyline: route.overview_polyline.points
          }
        };
      }

      return {
        success: false,
        message: 'Could not get directions'
      };
    } catch (error) {
      console.error('Directions Error:', error.message);
      return {
        success: false,
        message: 'Directions service error'
      };
    }
  }

  /**
   * Search for places
   * @param {string} query - Search query
   * @param {Array} location - [lng, lat] center
   * @param {number} radius - Search radius in meters
   * @returns {Promise<Object>} Places results
   */
  async searchPlaces(query, location, radius = 5000) {
    try {
      const locationStr = `${location[1]},${location[0]}`;
      const url = `${this.baseUrl}/place/textsearch/json?query=${encodeURIComponent(query)}&location=${locationStr}&radius=${radius}&key=${this.apiKey}`;
      
      const response = await axios.get(url);

      if (response.data.status === 'OK') {
        return {
          success: true,
          places: response.data.results.map(place => ({
            name: place.name,
            address: place.formatted_address,
            location: [place.geometry.location.lng, place.geometry.location.lat],
            rating: place.rating,
            placeId: place.place_id,
            types: place.types
          }))
        };
      }

      return {
        success: false,
        message: 'No places found'
      };
    } catch (error) {
      console.error('Place Search Error:', error.message);
      return {
        success: false,
        message: 'Place search service error'
      };
    }
  }

  /**
   * Get place details
   * @param {string} placeId - Google Place ID
   * @returns {Promise<Object>} Place details
   */
  async getPlaceDetails(placeId) {
    try {
      const url = `${this.baseUrl}/place/details/json?place_id=${placeId}&key=${this.apiKey}`;
      const response = await axios.get(url);

      if (response.data.status === 'OK') {
        const result = response.data.result;

        return {
          success: true,
          details: {
            name: result.name,
            address: result.formatted_address,
            phone: result.international_phone_number,
            website: result.website,
            rating: result.rating,
            reviews: result.reviews?.slice(0, 5),
            photos: result.photos?.slice(0, 5),
            openingHours: result.opening_hours,
            location: [result.geometry.location.lng, result.geometry.location.lat]
          }
        };
      }

      return {
        success: false,
        message: 'Could not get place details'
      };
    } catch (error) {
      console.error('Place Details Error:', error.message);
      return {
        success: false,
        message: 'Place details service error'
      };
    }
  }

  /**
   * Autocomplete address suggestions
   * @param {string} input - User input
   * @param {Array} location - [lng, lat] bias
   * @returns {Promise<Object>} Suggestions
   */
  async autocomplete(input, location) {
    try {
      let url = `${this.baseUrl}/place/autocomplete/json?input=${encodeURIComponent(input)}&types=address&components=country:in&key=${this.apiKey}`;
      
      if (location) {
        url += `&location=${location[1]},${location[0]}&radius=50000`;
      }

      const response = await axios.get(url);

      if (response.data.status === 'OK') {
        return {
          success: true,
          predictions: response.data.predictions.map(p => ({
            description: p.description,
            placeId: p.place_id,
            mainText: p.structured_formatting?.main_text,
            secondaryText: p.structured_formatting?.secondary_text
          }))
        };
      }

      return {
        success: false,
        message: 'No suggestions found'
      };
    } catch (error) {
      console.error('Autocomplete Error:', error.message);
      return {
        success: false,
        message: 'Autocomplete service error'
      };
    }
  }
}

module.exports = new LocationService();
