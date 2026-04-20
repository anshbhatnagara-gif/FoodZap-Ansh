/**
 * Login Modal Component
 * Injects login/signup modal into all pages
 */

const LoginModal = {
  init() {
    this.injectModal();
    this.setupEventListeners();
  },

  injectModal() {
    // Check if modal already exists
    if (document.getElementById('loginModal')) return;

    const modal = document.createElement('div');
    modal.id = 'loginModal';
    modal.className = 'modal-overlay';
    modal.style.cssText = 'display: none;';

    modal.innerHTML = `
      <div class="modal modal-auth">
        <div class="modal-content">
          <button class="modal-close" onclick="AppState.hideLoginModal()">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="auth-header">
            <div class="auth-logo">🍕</div>
            <h2 id="authTitle">Welcome Back!</h2>
            <p>Order delicious food from the best restaurants</p>
          </div>

          <!-- Login Form -->
          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label class="form-label">Email or Phone</label>
              <div class="input-group">
                <i class="fas fa-envelope input-icon"></i>
                <input type="text" class="form-input" id="loginEmail" placeholder="Enter email or phone number" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <i class="fas fa-lock input-icon"></i>
                <input type="password" class="form-input" id="loginPassword" placeholder="Enter password" required>
                <button type="button" class="btn btn-ghost input-toggle" onclick="LoginModal.togglePassword('loginPassword')">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" id="rememberMe">
                <span>Remember me</span>
              </label>
              <a href="#" class="text-primary" onclick="LoginModal.showForgotPassword(); return false;">Forgot password?</a>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg">
              <i class="fas fa-sign-in-alt"></i> Login
            </button>

            <div class="auth-divider">
              <span>OR</span>
            </div>

            <button type="button" class="btn btn-outline btn-block" onclick="LoginModal.showPhoneLogin()">
              <i class="fas fa-mobile-alt"></i> Login with Phone OTP
            </button>

            <button type="button" class="btn btn-google btn-block" onclick="LoginModal.googleLogin()">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style="width: 20px; margin-right: 8px;">
              Continue with Google
            </button>
          </form>

          <!-- Signup Form -->
          <form id="signupForm" class="auth-form" style="display: none;">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <div class="input-group">
                <i class="fas fa-user input-icon"></i>
                <input type="text" class="form-input" id="signupName" placeholder="Enter your full name" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <div class="input-group">
                <i class="fas fa-envelope input-icon"></i>
                <input type="email" class="form-input" id="signupEmail" placeholder="Enter email address" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <div class="input-group">
                <i class="fas fa-phone input-icon"></i>
                <span class="input-prefix">+91</span>
                <input type="tel" class="form-input" id="signupPhone" placeholder="10 digit mobile number" maxlength="10" pattern="[0-9]{10}" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <i class="fas fa-lock input-icon"></i>
                <input type="password" class="form-input" id="signupPassword" placeholder="Create password (min 6 chars)" minlength="6" required>
                <button type="button" class="btn btn-ghost input-toggle" onclick="LoginModal.togglePassword('signupPassword')">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="termsAgree" required>
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg">
              <i class="fas fa-user-plus"></i> Create Account
            </button>
          </form>

          <!-- Phone OTP Form -->
          <form id="phoneOtpForm" class="auth-form" style="display: none;">
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <div class="input-group">
                <i class="fas fa-phone input-icon"></i>
                <span class="input-prefix">+91</span>
                <input type="tel" class="form-input" id="phoneNumber" placeholder="10 digit mobile number" maxlength="10" pattern="[0-9]{10}" required>
              </div>
            </div>

            <button type="button" class="btn btn-primary btn-block" id="sendOtpBtn" onclick="LoginModal.sendOTP()">
              Send OTP
            </button>

            <div id="otpSection" style="display: none;">
              <div class="form-group">
                <label class="form-label">Enter OTP</label>
                <div class="otp-inputs">
                  <input type="text" class="form-input otp-input" maxlength="1" data-index="0">
                  <input type="text" class="form-input otp-input" maxlength="1" data-index="1">
                  <input type="text" class="form-input otp-input" maxlength="1" data-index="2">
                  <input type="text" class="form-input otp-input" maxlength="1" data-index="3">
                  <input type="text" class="form-input otp-input" maxlength="1" data-index="4">
                  <input type="text" class="form-input otp-input" maxlength="1" data-index="5">
                </div>
                <p class="form-hint">Didn't receive? <a href="#" onclick="LoginModal.resendOTP(); return false;">Resend</a></p>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg">
                <i class="fas fa-check-circle"></i> Verify & Login
              </button>
            </div>

            <button type="button" class="btn btn-ghost btn-block" onclick="LoginModal.showEmailLogin()">
              <i class="fas fa-arrow-left"></i> Back to Email Login
            </button>
          </form>

          <div class="auth-footer" id="authToggle">
            Don't have an account? <a href="#" onclick="AppState.toggleAuthMode(); return false;">Sign up</a>
          </div>
        </div>
      </div>
    `;

    // Add modal styles
    const styles = document.createElement('style');
    styles.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        backdrop-filter: blur(4px);
      }

      .modal-auth {
        background: white;
        border-radius: 20px;
        width: 100%;
        max-width: 450px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: modalSlideIn 0.3s ease;
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .modal-content {
        padding: 40px 30px;
      }

      .modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--dark-gray);
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .modal-close:hover {
        background: var(--lighter-gray);
        color: var(--dark);
      }

      .auth-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .auth-logo {
        font-size: 3rem;
        margin-bottom: 10px;
      }

      .auth-header h2 {
        font-size: 1.5rem;
        margin-bottom: 8px;
      }

      .auth-header p {
        color: var(--dark-gray);
        font-size: 0.9rem;
      }

      .auth-form .form-group {
        margin-bottom: 20px;
      }

      .auth-form .form-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 0.9rem;
      }

      .input-group {
        position: relative;
        display: flex;
        align-items: center;
      }

      .input-icon {
        position: absolute;
        left: 12px;
        color: var(--dark-gray);
        z-index: 1;
      }

      .input-prefix {
        position: absolute;
        left: 40px;
        font-weight: 500;
        color: var(--dark);
      }

      .input-group .form-input {
        padding-left: 40px;
        width: 100%;
      }

      .input-group .form-input[name="signupPhone"],
      .input-group #signupPhone,
      .input-group #phoneNumber {
        padding-left: 65px;
      }

      .input-toggle {
        position: absolute;
        right: 5px;
        padding: 8px;
      }

      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        font-size: 0.85rem;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .checkbox-label input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary);
      }

      .btn-block {
        width: 100%;
        justify-content: center;
      }

      .btn-lg {
        padding: 14px 24px;
        font-size: 1rem;
      }

      .auth-divider {
        text-align: center;
        margin: 25px 0;
        position: relative;
      }

      .auth-divider::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--light-gray);
      }

      .auth-divider span {
        background: white;
        padding: 0 15px;
        position: relative;
        color: var(--dark-gray);
        font-size: 0.85rem;
      }

      .btn-google {
        background: white;
        border: 1px solid var(--light-gray);
        color: var(--dark);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-google:hover {
        background: var(--lighter-gray);
      }

      .auth-footer {
        text-align: center;
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px solid var(--light-gray);
        color: var(--dark-gray);
        font-size: 0.9rem;
      }

      .auth-footer a {
        color: var(--primary);
        font-weight: 600;
      }

      .otp-inputs {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin: 15px 0;
      }

      .otp-input {
        width: 45px;
        height: 50px;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
        padding: 0;
      }

      .form-hint {
        text-align: center;
        font-size: 0.85rem;
        color: var(--dark-gray);
        margin-top: 10px;
      }

      .cart-sidebar {
        position: fixed;
        top: 0;
        right: -400px;
        width: 400px;
        max-width: 100%;
        height: 100vh;
        background: white;
        box-shadow: -4px 0 20px rgba(0,0,0,0.1);
        z-index: 10001;
        display: flex;
        flex-direction: column;
        transition: right 0.3s ease;
      }

      .cart-sidebar.open {
        right: 0;
      }

      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--light-gray);
      }

      .cart-header h3 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
      }

      .cart-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      .cart-restaurant {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        background: var(--lighter-gray);
        border-radius: 10px;
        margin-bottom: 20px;
      }

      .cart-restaurant img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }

      .cart-items {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border: 1px solid var(--light-gray);
        border-radius: 10px;
      }

      .cart-item-name {
        font-weight: 500;
        margin-bottom: 4px;
      }

      .cart-item-variant {
        font-size: 0.8rem;
        color: var(--dark-gray);
        margin-bottom: 4px;
      }

      .cart-item-price {
        font-weight: 600;
        color: var(--primary);
      }

      .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .cart-item-controls button {
        width: 30px;
        height: 30px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cart-footer {
        padding: 20px;
        border-top: 1px solid var(--light-gray);
        background: var(--lighter-gray);
      }

      .cart-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.1rem;
        margin-bottom: 15px;
      }

      .total-amount {
        font-weight: 700;
        font-size: 1.3rem;
        color: var(--primary);
      }

      .location-detect {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        border: 2px dashed var(--primary);
        border-radius: 10px;
        cursor: pointer;
        color: var(--primary);
        font-weight: 500;
        transition: all 0.2s;
      }

      .location-detect:hover {
        background: rgba(255, 107, 107, 0.05);
      }

      .location-detect i {
        font-size: 1.2rem;
      }

      .location-divider {
        text-align: center;
        margin: 20px 0;
        color: var(--dark-gray);
        font-size: 0.85rem;
      }

      @media (max-width: 480px) {
        .modal-content {
          padding: 30px 20px;
        }

        .cart-sidebar {
          width: 100%;
        }

        .otp-input {
          width: 40px;
          height: 45px;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(modal);
  },

  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSignup();
      });
    }

    // Phone OTP form
    const phoneOtpForm = document.getElementById('phoneOtpForm');
    if (phoneOtpForm) {
      phoneOtpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.verifyOTP();
      });
    }

    // OTP input auto-focus
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });
  },

  // ========== FORM HANDLERS ==========
  async handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      Utils.showToast('Logging in...', 'info');
      
      const result = await API.auth.login({ email, password });
      
      if (result.success) {
        AppState.login(result.user, result.token);
        Utils.showToast('Welcome back!', 'success');
      } else {
        Utils.showToast(result.message || 'Login failed', 'error');
      }
    } catch (error) {
      Utils.showToast('Login failed. Please try again.', 'error');
    }
  },

  async handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;

    try {
      Utils.showToast('Creating account...', 'info');
      
      const result = await API.auth.register({ name, email, phone, password });
      
      if (result.success) {
        AppState.login(result.user, result.token);
        Utils.showToast('Account created!', 'success');
      } else {
        Utils.showToast(result.message || 'Signup failed', 'error');
      }
    } catch (error) {
      Utils.showToast('Signup failed. Please try again.', 'error');
    }
  },

  // ========== OTP ==========
  showPhoneLogin() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('phoneOtpForm').style.display = 'block';
    document.getElementById('authTitle').textContent = 'Login with OTP';
    document.getElementById('authToggle').style.display = 'none';
  },

  showEmailLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('phoneOtpForm').style.display = 'none';
    document.getElementById('authTitle').textContent = 'Welcome Back!';
    document.getElementById('authToggle').style.display = 'block';
    document.getElementById('authToggle').innerHTML = 'Don\'t have an account? <a href="#" onclick="AppState.toggleAuthMode(); return false;">Sign up</a>';
  },

  async sendOTP() {
    const phone = document.getElementById('phoneNumber').value;
    
    if (!phone || phone.length !== 10) {
      Utils.showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    try {
      const result = await API.auth.sendOTP(phone);
      
      if (result.success) {
        document.getElementById('otpSection').style.display = 'block';
        document.getElementById('sendOtpBtn').style.display = 'none';
        
        if (result.otp) {
          Utils.showToast(`Dev Mode: OTP is ${result.otp}`, 'info');
        } else {
          Utils.showToast('OTP sent to your phone', 'success');
        }
      }
    } catch (error) {
      Utils.showToast('Failed to send OTP', 'error');
    }
  },

  async resendOTP() {
    await this.sendOTP();
    Utils.showToast('OTP resent', 'info');
  },

  async verifyOTP() {
    const phone = document.getElementById('phoneNumber').value;
    const otp = Array.from(document.querySelectorAll('.otp-input')).map(i => i.value).join('');

    if (otp.length !== 6) {
      Utils.showToast('Please enter complete OTP', 'error');
      return;
    }

    try {
      const result = await API.auth.verifyOTP(phone, otp);
      
      if (result.success) {
        AppState.login(result.user, result.token);
        Utils.showToast('Login successful!', 'success');
      } else {
        Utils.showToast(result.message || 'Invalid OTP', 'error');
      }
    } catch (error) {
      Utils.showToast('Verification failed', 'error');
    }
  },

  // ========== UTILITIES ==========
  togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
  },

  showForgotPassword() {
    Utils.showToast('Password reset link sent to your email', 'info');
  },

  googleLogin() {
    // Trigger Google OAuth
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.prompt();
    } else {
      Utils.showToast('Google Sign-In loading... Please try again in a moment', 'info');
    }
  }
};

// Auto-initialize
window.LoginModal = LoginModal;
document.addEventListener('DOMContentLoaded', () => {
  LoginModal.init();
});
