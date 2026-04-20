/**
 * Login Page
 * User authentication
 */

Pages.login = function(container) {
  const content = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); padding: 20px;">
      <div style="background: white; border-radius: 24px; padding: 48px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🍕</div>
          <h2 style="font-size: 1.8rem; margin-bottom: 8px; color: #333;">Welcome Back!</h2>
          <p style="color: #666;">Login to order your favorite food</p>
        </div>
        
        <form onsubmit="event.preventDefault(); Pages.handleLogin();">
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #444;">Email or Phone</label>
            <input type="text" id="loginEmail" placeholder="Enter email or phone" required
                   style="width: 100%; padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 1rem; outline: none; transition: border-color 0.2s;"
                   onfocus="this.style.borderColor='#ff6b6b'" onblur="this.style.borderColor='#e0e0e0'">
          </div>
          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #444;">Password</label>
            <input type="password" id="loginPassword" placeholder="Enter password" required
                   style="width: 100%; padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 1rem; outline: none; transition: border-color 0.2s;"
                   onfocus="this.style.borderColor='#ff6b6b'" onblur="this.style.borderColor='#e0e0e0'">
          </div>
          <button type="submit" style="width: 100%; background: #ff6b6b; color: white; border: none; padding: 16px; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;"
                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(255,107,107,0.4)'"
                  onmouseout="this.style.transform=''; this.style.boxShadow='none'">
            Login
          </button>
        </form>
        
        <div style="text-align: center; margin: 24px 0; color: #999; font-size: 0.9rem;">or continue with</div>
        
        <button onclick="Pages.googleLogin()" style="width: 100%; background: white; border: 2px solid #e0e0e0; padding: 14px; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; font-weight: 500; transition: border-color 0.2s;"
                onmouseover="this.style.borderColor='#ff6b6b'" onmouseout="this.style.borderColor='#e0e0e0'">
          <i class="fab fa-google" style="color: #DB4437; font-size: 1.2rem;"></i> Google
        </button>
        
        <p style="text-align: center; margin-top: 24px; color: #666;">
          Don't have an account? 
          <a href="#" onclick="event.preventDefault(); Router.navigate('/register');" style="color: #ff6b6b; font-weight: 600; text-decoration: none;">Sign Up</a>
        </p>
      </div>
    </div>
  `;
  
  container.innerHTML = content;
};

Pages.handleLogin = async function() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const result = await API.auth.login(email, password);
    if (result.success) {
      Utils.showToast('Login successful!', 'success');
      Router.navigate('/');
    } else {
      Utils.showToast(result.message || 'Login failed', 'error');
    }
  } catch (error) {
    Utils.showToast('Login error', 'error');
  }
};

Pages.googleLogin = function() {
  Utils.showToast('Google login coming soon', 'info');
};
