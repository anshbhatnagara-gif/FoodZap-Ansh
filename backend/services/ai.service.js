/**
 * AI Service
 * Integrates with Google Gemini API for food suggestions and chat
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Get food suggestions based on user mood
   * @param {string} mood - User's current mood
   * @param {string} timeOfDay - Current time context
   * @param {Array} preferences - User dietary preferences
   * @param {string} location - User location (city)
   * @returns {Promise<Object>} Food suggestions
   */
  async suggestFoodByMood(mood, timeOfDay, preferences = {}, location = '') {
    try {
      const { isVeg = false, spiceLevel = 'medium', allergies = [], cuisines = [] } = preferences;
      
      const prompt = `
You are an expert Indian food recommendation AI. Based on the user's mood and context, suggest 5-6 perfect food items.

User Context:
- Mood: ${mood}
- Time of Day: ${timeOfDay}
- Dietary Preference: ${isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
- Spice Preference: ${spiceLevel}
- Allergies: ${allergies.join(', ') || 'None'}
- Preferred Cuisines: ${cuisines.join(', ') || 'Any Indian cuisine'}
- Location: ${location || 'India'}

Provide recommendations in this exact JSON format:
{
  "analysis": "Brief analysis of why these foods match the mood",
  "suggestions": [
    {
      "name": "Food item name in English and Hindi",
      "cuisine": "Cuisine type (North Indian/South Indian/etc.)",
      "category": "Category (Main Course/Starter/Dessert/etc.)",
      "description": "Brief appealing description",
      "whyThis": "Why this matches the mood",
      "bestPairedWith": "What goes well with this",
      "estimatedPrice": "Price range in INR",
      "isVeg": true/false,
      "spiceLevel": "mild/medium/hot"
    }
  ],
  "restaurantKeywords": ["keywords to search for restaurants"],
  "moodBoosters": ["additional items that complement the mood"]
}

Ensure recommendations are authentic Indian dishes suitable for the mood and time. Be creative but practical.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Could not parse AI response');
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      // Return fallback suggestions
      return this.getFallbackSuggestions(mood, isVeg);
    }
  }

  /**
   * Chat with AI about food recommendations
   * @param {string} message - User message
   * @param {Array} history - Previous conversation history
   * @returns {Promise<Object>} AI response
   */
  async chat(message, history = []) {
    try {
      const chat = this.model.startChat({
        history: history.map(h => ({
          role: h.role,
          parts: [{ text: h.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      });

      const systemPrompt = `You are FoodZap AI, a friendly and knowledgeable food assistant specializing in Indian cuisine. 
You help users discover food, suggest restaurants, explain dishes, and provide culinary advice.

Guidelines:
- Be conversational and warm
- Provide specific, actionable recommendations
- Include Hindi names for Indian dishes when relevant
- Suggest food pairings and combinations
- Mention approximate price ranges in INR
- Consider dietary preferences and restrictions
- Keep responses concise but informative

User message: ${message}`;

      const result = await chat.sendMessage(systemPrompt);
      const response = result.response.text();

      return {
        message: response,
        suggestions: this.extractSuggestionsFromText(response)
      };
    } catch (error) {
      console.error('AI Chat Error:', error);
      return {
        message: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        suggestions: []
      };
    }
  }

  /**
   * Get personalized recommendations based on order history
   * @param {Array} orderHistory - User's previous orders
   * @param {Object} preferences - User preferences
   * @returns {Promise<Object>} Personalized recommendations
   */
  async getPersonalizedRecommendations(orderHistory, preferences) {
    try {
      const recentOrders = orderHistory.slice(-5).map(order => ({
        items: order.items.map(i => i.name),
        restaurant: order.restaurant?.name,
        date: order.createdAt
      }));

      const prompt = `
Based on this user's order history and preferences, suggest what they might like next.

Recent Orders: ${JSON.stringify(recentOrders)}
Preferences: ${JSON.stringify(preferences)}

Return JSON format:
{
  "analysis": "Analysis of their food patterns",
  "recommendations": [
    {
      "type": "similar|trending|new|complementary",
      "name": "Dish name",
      "reason": "Why this is recommended"
    }
  ],
  "insights": {
    "favoriteCuisine": "Most ordered cuisine",
    "orderingPattern": "Pattern observed",
    "spendRange": "Typical order value"
  }
}`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.getBasicRecommendations(orderHistory);
    } catch (error) {
      console.error('Personalized Rec Error:', error);
      return this.getBasicRecommendations(orderHistory);
    }
  }

  /**
   * Analyze restaurant menu and suggest popular combinations
   * @param {Array} menuItems - Restaurant menu
   * @returns {Promise<Array>} Suggested combinations
   */
  async getMenuCombinations(menuItems) {
    try {
      const items = menuItems.map(item => ({
        name: item.name,
        category: item.category,
        price: item.price
      }));

      const prompt = `
Given these menu items, suggest 3-4 popular meal combinations or thalis that customers typically enjoy.

Menu Items: ${JSON.stringify(items)}

Return JSON format:
{
  "combinations": [
    {
      "name": "Combination name (e.g., 'Perfect North Indian Dinner')",
      "items": ["Item 1", "Item 2", "Item 3"],
      "totalPrice": "Approximate total",
      "description": "Why these go well together",
      "serves": "Number of people"
    }
  ]
}`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return { combinations: [] };
    } catch (error) {
      console.error('Menu Combo Error:', error);
      return { combinations: [] };
    }
  }

  /**
   * Fallback suggestions when AI API fails
   */
  getFallbackSuggestions(mood, isVeg = false) {
    const suggestions = {
      happy: isVeg ? [
        { name: 'Paneer Tikka Masala', cuisine: 'North Indian', category: 'Main Course', description: 'Creamy cottage cheese in rich tomato gravy' },
        { name: 'Chole Bhature', cuisine: 'North Indian', category: 'Main Course', description: 'Spiced chickpeas with fluffy fried bread' },
        { name: 'Gulab Jamun', cuisine: 'North Indian', category: 'Dessert', description: 'Sweet fried dumplings in sugar syrup' }
      ] : [
        { name: 'Butter Chicken', cuisine: 'North Indian', category: 'Main Course', description: 'Tandoori chicken in buttery tomato gravy' },
        { name: 'Biryani', cuisine: 'Hyderabadi', category: 'Main Course', description: 'Fragrant rice with spices and meat' },
        { name: 'Tandoori Platter', cuisine: 'North Indian', category: 'Starter', description: 'Assorted grilled meats' }
      ],
      sad: [
        { name: 'Dal Makhani', cuisine: 'North Indian', category: 'Main Course', description: 'Creamy black lentils - ultimate comfort food' },
        { name: 'Rajma Chawal', cuisine: 'North Indian', category: 'Main Course', description: 'Kidney bean curry with rice' },
        { name: 'Hot Chocolate', cuisine: 'Continental', category: 'Beverage', description: 'Warm and comforting' }
      ],
      tired: [
        { name: 'Khichdi', cuisine: 'North Indian', category: 'Main Course', description: 'Light rice and lentil dish' },
        { name: 'Idli Sambhar', cuisine: 'South Indian', category: 'Main Course', description: 'Light and easy to digest' },
        { name: 'Soup and Bread', cuisine: 'Continental', category: 'Main Course', description: 'Warm and comforting' }
      ],
      party: isVeg ? [
        { name: 'Veg Biryani', cuisine: 'Hyderabadi', category: 'Main Course', description: 'Festive rice dish' },
        { name: 'Paneer Tikka', cuisine: 'North Indian', category: 'Starter', description: 'Grilled cottage cheese cubes' },
        { name: 'Masala Dosa', cuisine: 'South Indian', category: 'Main Course', description: 'Crispy crepe with spiced potatoes' }
      ] : [
        { name: 'Chicken Biryani', cuisine: 'Hyderabadi', category: 'Main Course', description: 'Celebration special' },
        { name: 'Fish Fry', cuisine: 'Coastal', category: 'Starter', description: 'Crispy fried fish' },
        { name: 'Kebab Platter', cuisine: 'Mughlai', category: 'Starter', description: 'Assorted grilled meats' }
      ],
      romantic: [
        { name: 'Pasta Alfredo', cuisine: 'Italian', category: 'Main Course', description: 'Creamy and indulgent' },
        { name: 'Shahi Paneer', cuisine: 'Mughlai', category: 'Main Course', description: 'Rich and creamy' },
        { name: 'Chocolate Lava Cake', cuisine: 'Continental', category: 'Dessert', description: 'Decadent dessert' }
      ],
      hungry: [
        { name: 'Thali', cuisine: 'North Indian', category: 'Main Course', description: 'Complete meal with variety' },
        { name: 'Biryani', cuisine: 'Hyderabadi', category: 'Main Course', description: 'Filling and flavorful' },
        { name: 'Paratha Platter', cuisine: 'North Indian', category: 'Main Course', description: 'Stuffed bread with accompaniments' }
      ]
    };

    const moodKey = Object.keys(suggestions).find(k => mood.toLowerCase().includes(k)) || 'happy';
    
    return {
      analysis: `Based on your ${mood} mood, here are some comfort food recommendations`,
      suggestions: suggestions[moodKey] || suggestions.happy,
      restaurantKeywords: ['best', 'popular', 'top rated'],
      moodBoosters: ['Fresh lime soda', 'Gulab Jamun']
    };
  }

  /**
   * Extract food suggestions from chat text
   */
  extractSuggestionsFromText(text) {
    const suggestions = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      // Look for dish names (often capitalized or in quotes)
      const matches = line.match(/(?:[A-Z][a-z]+\s*){2,}/g);
      if (matches) {
        suggestions.push(...matches);
      }
    }
    
    return [...new Set(suggestions)].slice(0, 5);
  }

  /**
   * Basic recommendations from order history
   */
  getBasicRecommendations(orderHistory) {
    if (!orderHistory || orderHistory.length === 0) {
      return {
        analysis: "New user - no order history yet",
        recommendations: [
          { type: 'trending', name: 'Butter Chicken', reason: 'Most popular dish' },
          { type: 'trending', name: 'Paneer Tikka', reason: 'Vegetarian favorite' }
        ]
      };
    }

    // Simple frequency analysis
    const itemCounts = {};
    orderHistory.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
      });
    });

    const favorite = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      analysis: `User likes ${favorite?.[0] || 'variety'}`,
      recommendations: [
        { type: 'similar', name: favorite?.[0] || 'Popular Items', reason: 'Based on your preferences' }
      ]
    };
  }
}

module.exports = new AIService();
