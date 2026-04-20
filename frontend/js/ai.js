/**
 * AI Chat Module
 * Handles AI chat and food suggestions
 */

const AIChat = {
  isOpen: false,
  history: [],
  suggestions: [],
  
  init() {
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    const chatBtn = document.getElementById('aiChatBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const sendBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    
    if (chatBtn) {
      chatBtn.addEventListener('click', () => this.toggle());
    }
    
    if (sendBtn && chatInput) {
      sendBtn.addEventListener('click', () => this.sendMessage());
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }
  },
  
  toggle() {
    const chatWindow = document.getElementById('aiChatWindow');
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      chatWindow.classList.add('open');
      document.getElementById('chatInput')?.focus();
    } else {
      chatWindow.classList.remove('open');
    }
  },
  
  addMessage(content, sender = 'user') {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = content;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Add to history
    if (sender === 'user') {
      this.history.push({ role: 'user', content });
    } else {
      this.history.push({ role: 'model', content });
    }
    
    // Keep only last 10 messages
    if (this.history.length > 10) {
      this.history = this.history.slice(-10);
    }
  },
  
  async sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput?.value?.trim();
    
    if (!message) return;
    
    // Add user message
    this.addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    this.showTyping();
    
    try {
      // Check for mood-based queries
      const mood = this.detectMood(message);
      if (mood) {
        const suggestions = await this.getMoodSuggestions(mood);
        this.hideTyping();
        this.addMessage(suggestions, 'ai');
      } else {
        // Regular chat
        const response = await API.ai.chat(message, this.history);
        this.hideTyping();
        this.addMessage(response.data.message || 'I can help you find food!', 'ai');
        
        // Add suggestion buttons if available
        if (response.data.suggestions?.length > 0) {
          this.addSuggestions(response.data.suggestions);
        }
      }
    } catch (error) {
      this.hideTyping();
      this.addMessage('Sorry, I am having trouble connecting. Please try again!', 'ai');
    }
  },
  
  detectMood(message) {
    const moodKeywords = {
      happy: ['happy', 'excited', 'cheerful', 'joy', 'celebration', 'party', '😄', '🎉'],
      sad: ['sad', 'depressed', 'down', 'upset', 'feeling low', '😢', '😔'],
      tired: ['tired', 'exhausted', 'sleepy', 'fatigue', 'no energy', '😴', '😫'],
      romantic: ['romantic', 'date', 'anniversary', 'love', 'special', '💕', '😍'],
      hungry: ['hungry', 'starving', 'very hungry', 'famished', '🤤', '😋'],
      stressed: ['stressed', 'anxious', 'tense', 'worried', '😰', '😓']
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(k => lowerMessage.includes(k))) {
        return mood;
      }
    }
    
    return null;
  },
  
  async getMoodSuggestions(mood) {
    const moodFoods = {
      happy: {
        message: "🎉 You're feeling happy! Let's keep that vibe going with these delicious options:",
        foods: [
          { name: 'Butter Chicken', cuisine: 'North Indian', price: '₹350' },
          { name: 'Paneer Tikka', cuisine: 'North Indian', price: '₹280' },
          { name: 'Chole Bhature', cuisine: 'North Indian', price: '₹150' },
          { name: 'Gulab Jamun', cuisine: 'Dessert', price: '₹80' }
        ]
      },
      sad: {
        message: "😢 Feeling down? Here's some comfort food to cheer you up:",
        foods: [
          { name: 'Dal Makhani', cuisine: 'North Indian', price: '₹220' },
          { name: 'Rajma Chawal', cuisine: 'North Indian', price: '₹180' },
          { name: 'Hot Chocolate', cuisine: 'Beverage', price: '₹120' },
          { name: 'Ice Cream Sundae', cuisine: 'Dessert', price: '₹150' }
        ]
      },
      tired: {
        message: "😴 Feeling tired? These light and energizing options are perfect:",
        foods: [
          { name: 'Idli Sambhar', cuisine: 'South Indian', price: '₹120' },
          { name: 'Khichdi', cuisine: 'North Indian', price: '₹150' },
          { name: 'Fresh Juice', cuisine: 'Beverage', price: '₹100' },
          { name: 'Dosa', cuisine: 'South Indian', price: '₹80' }
        ]
      },
      romantic: {
        message: "💕 Planning something special? These romantic options are perfect:",
        foods: [
          { name: 'Shahi Paneer', cuisine: 'Mughlai', price: '₹320' },
          { name: 'Biryani', cuisine: 'Hyderabadi', price: '₹380' },
          { name: 'Chocolate Lava Cake', cuisine: 'Dessert', price: '₹200' },
          { name: 'Pasta Alfredo', cuisine: 'Italian', price: '₹280' }
        ]
      },
      hungry: {
        message: "🤤 Super hungry? These filling options will satisfy you:",
        foods: [
          { name: 'Non-Veg Thali', cuisine: 'North Indian', price: '₹350' },
          { name: 'Chicken Biryani', cuisine: 'Hyderabadi', price: '₹320' },
          { name: 'Burger Combo', cuisine: 'Fast Food', price: '₹250' },
          { name: 'Paratha Platter', cuisine: 'North Indian', price: '₹200' }
        ]
      },
      stressed: {
        message: "😰 Stressed? Take a break with these calming foods:",
        foods: [
          { name: 'Herbal Tea', cuisine: 'Beverage', price: '₹80' },
          { name: 'Soup', cuisine: 'Starter', price: '₹120' },
          { name: 'Salad', cuisine: 'Healthy', price: '₹150' },
          { name: 'Yogurt', cuisine: 'Dairy', price: '₹60' }
        ]
      }
    };
    
    const suggestion = moodFoods[mood];
    if (!suggestion) return 'I can help you find great food! What are you craving?';
    
    let html = `<p>${suggestion.message}</p><div style="margin-top: 10px;">`;
    
    suggestion.foods.forEach(food => {
      html += `
        <div style="background: rgba(255,107,107,0.1); padding: 8px; border-radius: 8px; margin: 5px 0; cursor: pointer;" 
             onclick="window.location.href='restaurants.html?search=${encodeURIComponent(food.name)}'">
          <strong>${food.name}</strong> - ${food.cuisine} - ${food.price}
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  },
  
  addSuggestions(suggestions) {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody || !suggestions?.length) return;
    
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'chat-message ai';
    suggestionsDiv.innerHTML = `
      <p>You might also like:</p>
      <div style="margin-top: 8px;">
        ${suggestions.map(s => `
          <span style="display: inline-block; background: var(--lighter-gray); padding: 4px 12px; 
                       border-radius: 16px; margin: 4px; font-size: 0.9rem; cursor: pointer;"
                onclick="document.getElementById('chatInput').value = '${s}'; AIChat.sendMessage()">
            ${s}
          </span>
        `).join('')}
      </div>
    `;
    
    chatBody.appendChild(suggestionsDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  },
  
  showTyping() {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span>●</span><span>●</span><span>●</span>';
    typingDiv.style.cssText = 'display: flex; gap: 4px; padding: 12px;';
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
      .typing-indicator span {
        animation: typing 1.4s infinite both;
        font-size: 0.8rem;
        color: var(--dark-gray);
      }
      .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
      .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes typing {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  },
  
  hideTyping() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  },
  
  // Mood button handler
  async handleMoodClick(mood) {
    const suggestionsDiv = document.getElementById('moodSuggestions');
    if (!suggestionsDiv) return;
    
    suggestionsDiv.style.display = 'block';
    suggestionsDiv.innerHTML = '<div style="text-align: center; padding: 20px;">🤔 Analyzing your mood...</div>';
    
    try {
      const location = Utils.getUserLocation();
      const result = await API.ai.suggestByMood(mood, location.city);
      
      if (result.success) {
        this.renderMoodSuggestions(result.data);
      }
    } catch (error) {
      // Fallback to local suggestions
      const fallback = await this.getMoodSuggestions(mood);
      suggestionsDiv.innerHTML = fallback;
    }
  },
  
  renderMoodSuggestions(data) {
    const suggestionsDiv = document.getElementById('moodSuggestions');
    if (!suggestionsDiv) return;
    
    let html = `
      <div style="margin-bottom: var(--md);">
        <h4>${data.analysis}</h4>
        <p style="color: var(--dark-gray);">Time: ${data.timeOfDay}</p>
      </div>
      <div class="grid grid-2" style="gap: var(--md);">
    `;
    
    data.suggestions.forEach(item => {
      html += `
        <div class="card" style="padding: var(--md); cursor: pointer;"
             onclick="window.location.href='restaurants.html?cuisine=${encodeURIComponent(item.cuisine)}'">
          <div class="flex items-center gap-sm mb-sm">
            <span class="badge badge-primary">${item.cuisine}</span>
            <span class="badge badge-success">${item.isVeg ? 'Veg' : 'Non-Veg'}</span>
          </div>
          <h4 style="margin-bottom: var(--xs);">${item.name}</h4>
          <p style="font-size: 0.9rem; color: var(--dark-gray); margin-bottom: var(--sm);">
            ${item.description}
          </p>
          <p style="font-size: 0.85rem; color: var(--primary);">
            <i class="fas fa-lightbulb"></i> ${item.whyThis}
          </p>
          <div class="flex justify-between items-center mt-sm">
            <span class="text-muted">${item.estimatedPrice}</span>
            <span class="text-sm text-muted">Best with: ${item.bestPairedWith}</span>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    
    if (data.moodBoosters?.length > 0) {
      html += `
        <div style="margin-top: var(--lg); padding: var(--md); background: var(--lighter-gray); border-radius: var(--radius-md);">
          <h4 style="margin-bottom: var(--sm);">🌟 Mood Boosters</h4>
          <div class="flex gap-sm flex-wrap">
            ${data.moodBoosters.map(booster => `
              <span class="badge badge-warning">${booster}</span>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    suggestionsDiv.innerHTML = html;
    Utils.scrollTo(suggestionsDiv);
  }
};

// Make AIChat available globally
window.AIChat = AIChat;
