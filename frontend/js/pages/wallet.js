/**
 * Wallet Page
 * Wallet balance, transactions, and subscriptions
 */

Pages.wallet = function(container) {
  if (!API.auth.isAuthenticated()) {
    Router.navigate('/login');
    return;
  }
  
  const content = `
    <div class="container" style="padding: 40px 0; max-width: 800px;">
      <!-- Balance Card -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(102,126,234,0.3);">
        <div style="font-size: 1rem; opacity: 0.9; margin-bottom: 12px;">Available Balance</div>
        <div style="font-size: 3rem; font-weight: 700; margin-bottom: 24px;" id="walletBalance">₹0</div>
        <div style="display: flex; gap: 16px;">
          <button onclick="Pages.showAddMoney()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 14px 28px; border-radius: 12px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(10px);">
            <i class="fas fa-plus"></i> Add Money
          </button>
          <button onclick="Pages.viewTransactions()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 14px 28px; border-radius: 12px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(10px);">
            <i class="fas fa-list"></i> History
          </button>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
        <div style="background: white; border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="font-size: 1.6rem; font-weight: 700; color: #667eea; margin-bottom: 4px;" id="totalAdded">₹0</div>
          <div style="color: #666; font-size: 0.9rem;">Total Added</div>
        </div>
        <div style="background: white; border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="font-size: 1.6rem; font-weight: 700; color: #ff6b6b; margin-bottom: 4px;" id="totalSpent">₹0</div>
          <div style="color: #666; font-size: 0.9rem;">Total Spent</div>
        </div>
        <div style="background: white; border-radius: 16px; padding: 24px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="font-size: 1.6rem; font-weight: 700; color: #00b894; margin-bottom: 4px;" id="totalCashback">₹0</div>
          <div style="color: #666; font-size: 0.9rem;">Cashback</div>
        </div>
      </div>

      <!-- Subscription Plans -->
      <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <h3 style="margin-bottom: 20px; font-size: 1.2rem;"><i class="fas fa-crown" style="color: #ffc107; margin-right: 8px;"></i>FoodZap Membership</h3>
        <div id="subscriptionSection">
          <div id="currentSubscription" style="display: none; margin-bottom: 20px;"></div>
          <div id="subscriptionPlans" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
            <p style="color: #666;">Loading plans...</p>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 1.2rem;"><i class="fas fa-history" style="color: #667eea; margin-right: 8px;"></i>Recent Transactions</h3>
          <button onclick="Pages.viewAllTransactions()" style="background: none; border: none; color: #667eea; cursor: pointer; font-weight: 500;">
            View All <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <div id="recentTransactions">
          <p style="color: #666;">Loading...</p>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = Pages.wrap(content, { title: 'Wallet - FoodZap' });
  
  setTimeout(() => {
    Pages.loadWalletData();
    Pages.loadSubscriptionData();
  }, 100);
};

Pages.loadWalletData = async function() {
  try {
    const result = await API.wallet.getWallet();
    if (result.success) {
      const { wallet, stats } = result.data;
      document.getElementById('walletBalance').textContent = Utils.formatPrice(wallet.balance);
      document.getElementById('totalAdded').textContent = Utils.formatPrice(stats.totalCredited);
      document.getElementById('totalSpent').textContent = Utils.formatPrice(stats.totalDebited);
      document.getElementById('totalCashback').textContent = Utils.formatPrice(stats.totalCashback);
    }
  } catch (error) {
    console.error('Failed to load wallet', error);
  }
};

Pages.loadSubscriptionData = async function() {
  try {
    const [subResult, plansResult] = await Promise.all([
      API.wallet.getSubscription(),
      API.wallet.getSubscriptionPlans()
    ]);
    
    if (plansResult.success) {
      Pages.renderSubscriptionPlans(plansResult.data, subResult.data);
    }
  } catch (error) {
    console.error('Failed to load subscription data', error);
  }
};

Pages.renderSubscriptionPlans = function(plans, currentSub) {
  const plansContainer = document.getElementById('subscriptionPlans');
  const currentSubDiv = document.getElementById('currentSubscription');
  
  // Show current subscription
  if (currentSub && currentSub.subscription?.isActive) {
    currentSubDiv.style.display = 'block';
    currentSubDiv.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(255,193,7,0.1), rgba(255,193,7,0.05)); border: 1px solid #ffc107; border-radius: 12px; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 4px;">${currentSub.subscription.plan}</div>
            <div style="font-size: 0.85rem; color: #666;">Valid until ${new Date(currentSub.subscription.endDate).toLocaleDateString()}</div>
          </div>
          <button onclick="Pages.cancelSubscription()" style="background: white; border: 1px solid #ddd; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.9rem;">
            Cancel
          </button>
        </div>
      </div>
    `;
  }
  
  // Render plans
  plansContainer.innerHTML = plans.map(plan => `
    <div style="border: 2px solid ${plan.name === 'Pro' ? '#ff6b6b' : '#e0e0e0'}; border-radius: 16px; padding: 24px; ${plan.name === 'Pro' ? 'position: relative;' : ''}"
         ${plan.name === 'Pro' ? 'style="border: 2px solid #ff6b6b; border-radius: 16px; padding: 24px; position: relative;"' : ''}>
      ${plan.name === 'Pro' ? '<div style="position: absolute; top: -10px; right: 20px; background: #ff6b6b; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.7rem; font-weight: 600;">POPULAR</div>' : ''}
      <h4 style="font-size: 1.3rem; margin-bottom: 8px;">${plan.displayName}</h4>
      <div style="font-size: 1.8rem; font-weight: 700; color: #ff6b6b; margin-bottom: 4px;">₹${plan.price.monthly}<span style="font-size: 0.9rem; color: #666; font-weight: 400;">/month</span></div>
      <p style="color: #666; font-size: 0.85rem; margin-bottom: 16px;">or ₹${plan.price.yearly}/year</p>
      <ul style="list-style: none; margin-bottom: 20px;">
        ${plan.features.slice(0, 4).map(f => `
          <li style="padding: 6px 0; display: flex; align-items: center; gap: 8px; font-size: 0.9rem;">
            <i class="fas fa-check" style="color: #00b894;"></i> ${f.name}
          </li>
        `).join('')}
      </ul>
      <button onclick="Pages.subscribe('${plan._id}', '${plan.name}')" style="width: 100%; background: ${currentSub?.subscription?.plan === plan.name ? '#00b894' : '#ff6b6b'}; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: 600;">
        ${currentSub?.subscription?.plan === plan.name ? 'Current Plan' : 'Subscribe'}
      </button>
    </div>
  `).join('');
};

Pages.showAddMoney = function() {
  Utils.showToast('Add money feature - integrate payment here', 'info');
};

Pages.viewTransactions = function() {
  Utils.showToast('Full transaction history coming soon', 'info');
};

Pages.viewAllTransactions = function() {
  Utils.showToast('Full transaction history coming soon', 'info');
};

Pages.subscribe = async function(planId, planName) {
  if (confirm(`Subscribe to ${planName} plan?`)) {
    try {
      const result = await API.wallet.subscribe(planId, 'monthly', 'wallet');
      if (result.success) {
        Utils.showToast('Subscription activated!', 'success');
        Pages.loadWalletData();
        Pages.loadSubscriptionData();
      }
    } catch (error) {
      Utils.showToast('Subscription failed. Check wallet balance.', 'error');
    }
  }
};

Pages.cancelSubscription = async function() {
  if (confirm('Cancel your subscription? Benefits will remain until end of billing period.')) {
    try {
      const result = await API.wallet.cancelSubscription('User requested');
      if (result.success) {
        Utils.showToast('Subscription cancelled', 'success');
        Pages.loadSubscriptionData();
      }
    } catch (error) {
      Utils.showToast('Failed to cancel', 'error');
    }
  }
};
