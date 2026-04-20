/**
 * Profile Page
 * User profile and settings
 */

Pages.profile = function(container) {
  if (!API.auth.isAuthenticated()) {
    Router.navigate('/login');
    return;
  }
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const content = `
    <div class="container" style="padding: 40px 0; max-width: 800px;">
      <!-- Profile Card -->
      <div style="background: white; border-radius: 20px; padding: 40px; margin-bottom: 30px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #ff6b6b, #ff8e53); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: 600;">
          ${user.name ? user.name.charAt(0).toUpperCase() : '👤'}
        </div>
        <h2 style="margin-bottom: 8px; font-size: 1.6rem;">${user.name || 'User'}</h2>
        <p style="color: #666; margin-bottom: 20px;">${user.email || user.phone || ''}</p>
        <button onclick="Pages.editProfile()" style="background: #f8f9fa; border: none; padding: 12px 24px; border-radius: 30px; cursor: pointer; font-weight: 500; color: #444;">
          <i class="fas fa-edit"></i> Edit Profile
        </button>
      </div>
      
      <!-- Menu Grid -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
        <div onclick="Router.navigate('/orders')" style="background: white; border-radius: 16px; padding: 30px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;"
             onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.12)'"
             onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
          <i class="fas fa-box" style="font-size: 2.5rem; color: #ff6b6b; margin-bottom: 16px;"></i>
          <h4 style="font-size: 1.2rem; margin-bottom: 8px;">My Orders</h4>
          <p style="color: #666; font-size: 0.9rem;">View order history</p>
        </div>
        
        <div onclick="Router.navigate('/wallet')" style="background: white; border-radius: 16px; padding: 30px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;"
             onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.12)'"
             onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
          <i class="fas fa-wallet" style="font-size: 2.5rem; color: #00b894; margin-bottom: 16px;"></i>
          <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Wallet</h4>
          <p style="color: #666; font-size: 0.9rem;">Check balance & add money</p>
        </div>
        
        <div onclick="Router.navigate('/addresses')" style="background: white; border-radius: 16px; padding: 30px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;"
             onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.12)'"
             onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
          <i class="fas fa-map-marker-alt" style="font-size: 2.5rem; color: #764ba2; margin-bottom: 16px;"></i>
          <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Addresses</h4>
          <p style="color: #666; font-size: 0.9rem;">Manage delivery addresses</p>
        </div>
        
        <div onclick="Router.navigate('/favorites')" style="background: white; border-radius: 16px; padding: 30px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;"
             onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.12)'"
             onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
          <i class="fas fa-heart" style="font-size: 2.5rem; color: #ff6b6b; margin-bottom: 16px;"></i>
          <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Favorites</h4>
          <p style="color: #666; font-size: 0.9rem;">Saved restaurants & items</p>
        </div>
      </div>
      
      <!-- Logout Button -->
      <button onclick="App.logout()" style="width: 100%; background: white; border: 2px solid #ff6b6b; color: #ff6b6b; padding: 16px; border-radius: 12px; margin-top: 30px; font-weight: 600; cursor: pointer; font-size: 1rem; transition: all 0.2s;"
              onmouseover="this.style.background='#ff6b6b'; this.style.color='white'"
              onmouseout="this.style.background='white'; this.style.color='#ff6b6b'">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  `;
  
  container.innerHTML = Pages.wrap(content, { title: 'My Profile - FoodZap' });
};

Pages.editProfile = function() {
  Utils.showToast('Edit profile coming soon', 'info');
};
