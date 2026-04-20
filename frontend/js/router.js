/**
 * FoodZap Router
 * Single Page Application (SPA) routing system
 * Dynamically renders pages without reloading
 */

const Router = {
  routes: {
    '/': 'home',
    '/home': 'home',
    '/restaurants': 'restaurants',
    '/restaurant': 'restaurant',
    '/cart': 'cart',
    '/checkout': 'checkout',
    '/login': 'login',
    '/register': 'register',
    '/profile': 'profile',
    '/orders': 'orders',
    '/order-tracking': 'orderTracking',
    '/wallet': 'wallet',
    '/offers': 'offers',
    '/instamart': 'instamart',
    '/favorites': 'favorites',
    '/addresses': 'addresses'
  },
  
  currentRoute: null,
  currentParams: {},
  
  init() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      this.handleRoute(window.location.pathname + window.location.search);
    });
    
    // Handle initial route
    this.handleRoute(window.location.pathname + window.location.search);
  },
  
  navigate(path, pushState = true) {
    if (pushState) {
      window.history.pushState({}, '', path);
    }
    this.handleRoute(path);
  },
  
  handleRoute(path) {
    // Parse path and query params
    const [pathname, search] = path.split('?');
    const params = new URLSearchParams(search || '');
    this.currentParams = Object.fromEntries(params.entries());
    
    // Find route handler
    const routeName = this.routes[pathname] || 'home';
    this.currentRoute = routeName;
    
    // Render the page
    this.renderPage(routeName);
    
    // Update active nav links
    this.updateActiveNav(pathname);
    
    // Scroll to top
    window.scrollTo(0, 0);
  },
  
  renderPage(routeName) {
    const app = document.getElementById('app');
    if (!app) return;
    
    // Show loading
    app.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh;"><i class="fas fa-spinner fa-spin fa-3x" style="color: var(--primary);"></i></div>';
    
    // Render appropriate page
    switch(routeName) {
      case 'home':
        Pages.home(app);
        break;
      case 'restaurants':
        Pages.restaurants(app);
        break;
      case 'restaurant':
        Pages.restaurant(app, this.currentParams.id);
        break;
      case 'cart':
        Pages.cart(app);
        break;
      case 'checkout':
        Pages.checkout(app);
        break;
      case 'login':
        Pages.login(app);
        break;
      case 'profile':
        Pages.profile(app);
        break;
      case 'orders':
        Pages.orders(app);
        break;
      case 'orderTracking':
        Pages.orderTracking(app, this.currentParams.orderId);
        break;
      case 'wallet':
        Pages.wallet(app);
        break;
      case 'offers':
        Pages.offers(app);
        break;
      case 'instamart':
        Pages.instamart(app);
        break;
      default:
        Pages.home(app);
    }
  },
  
  updateActiveNav(pathname) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === pathname || 
          (pathname === '/' && link.getAttribute('href') === '/home')) {
        link.classList.add('active');
      }
    });
  },
  
  // Helper to create links that work with router
  createLink(href, text, options = {}) {
    const { icon, className = '', onClick } = options;
    return `
      <a href="${href}" 
         class="${className}" 
         onclick="event.preventDefault(); Router.navigate('${href}'); ${onClick || ''}">
        ${icon ? `<i class="${icon}"></i> ` : ''}${text}
      </a>
    `;
  }
};

// Make router global
window.Router = Router;
