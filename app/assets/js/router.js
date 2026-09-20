/**
 * AGRI-NEST Hash-based SPA Router
 * Loads HTML partials into the app shell based on hash routes
 */

const Router = (function () {
  const routes = {
    // Farmer
    '/farmer/dashboard': 'pages/farmer/dashboard.html',
    '/farmer/digital-farm': 'pages/farmer/digital-farm.html',
    '/farmer/jicho-ai': 'pages/farmer/jicho-ai.html',
    '/farmer/livestock': 'pages/farmer/livestock.html',
    '/farmer/spray-diary': 'pages/farmer/spray-diary.html',

    // Marketplace
    '/marketplace/soko': 'pages/marketplace/soko.html',
    '/marketplace/buyer-dashboard': 'pages/marketplace/buyer-dashboard.html',
    '/marketplace/consumer-store': 'pages/marketplace/consumer-store.html',
    '/marketplace/orders': 'pages/marketplace/orders.html',
    '/marketplace/saved': 'pages/marketplace/saved.html',
    '/marketplace/alerts': 'pages/marketplace/alerts.html',

    // Admin
    '/admin/dashboard': 'pages/admin/dashboard.html',
    '/admin/users': 'pages/admin/users.html',
    '/admin/verification': 'pages/admin/verification.html',
    '/admin/patterns': 'pages/admin/patterns.html',
    '/admin/disputes': 'pages/admin/disputes.html',
    '/admin/transactions': 'pages/admin/transactions.html',
    '/admin/ai-training': 'pages/admin/ai-training.html',
    '/admin/network': 'pages/admin/network.html',
    '/admin/monetization': 'pages/admin/monetization.html',
    '/admin/security': 'pages/admin/security.html',

    // Finance
    '/finance/hub': 'pages/finance/hub.html',
    '/finance/loans': 'pages/finance/loans.html',
    '/finance/approvals': 'pages/finance/approvals.html',
    '/finance/lender-dashboard': 'pages/finance/lender-dashboard.html',
    '/finance/risk': 'pages/finance/risk.html',
    '/finance/disbursement': 'pages/finance/disbursement.html',
    '/finance/portfolio': 'pages/finance/portfolio.html',
    '/finance/collateral': 'pages/finance/collateral.html',
    '/finance/wallet': 'pages/finance/wallet.html',

    // Logistics
    '/logistics/transport': 'pages/logistics/transport.html',
    '/logistics/transporter-dashboard': 'pages/logistics/transporter-dashboard.html',
    '/logistics/deliveries': 'pages/logistics/deliveries.html',
    '/logistics/fleet': 'pages/logistics/fleet.html',
    '/logistics/routes': 'pages/logistics/routes.html',
    '/logistics/track': 'pages/logistics/track.html',
    '/logistics/history': 'pages/logistics/history.html',

    // AI
    '/ai/assistant': 'pages/ai/assistant.html',
    '/ai/diagnosis': 'pages/ai/diagnosis.html',
    '/ai/analytics': 'pages/ai/analytics.html',

    // GIS
    '/gis/maps': 'pages/gis/maps.html',
    '/gis/precision-view': 'pages/gis/precision-view.html',
    '/gis/boundary': 'pages/gis/boundary.html',

    // Community
    '/community/hub': 'pages/community/hub.html',
    '/community/groups': 'pages/community/groups.html',
    '/community/chat': 'pages/community/chat.html',
    '/community/news': 'pages/community/news.html',
    '/community/events': 'pages/community/events.html',

    // User
    '/user/profile': 'pages/user/profile.html',
    '/user/settings': 'pages/user/settings.html',
    '/user/notifications': 'pages/user/notifications.html',

    // Auth
    '/auth/login': 'pages/auth/login.html',
    '/auth/register': 'pages/auth/register.html',

    // Expert
    '/expert/dashboard': 'pages/expert/dashboard.html',
    '/expert/bookings': 'pages/expert/bookings.html',
    '/expert/knowledge': 'pages/expert/knowledge.html',
    '/expert/consultations': 'pages/expert/consultations.html',
    '/expert/earnings': 'pages/expert/earnings.html',

    // Processor
    '/processor/dashboard': 'pages/processor/dashboard.html',
    '/processor/supply-chain': 'pages/processor/supply-chain.html',
    '/processor/quality': 'pages/processor/quality.html',
    '/processor/inbound': 'pages/processor/inbound.html',
    '/processor/procurement': 'pages/processor/procurement.html',

    // Government
    '/government/dashboard': 'pages/government/dashboard.html',
    '/government/alerts': 'pages/government/alerts.html',
    '/government/regional': 'pages/government/regional.html',
    '/government/compliance': 'pages/government/compliance.html',
    '/government/sustainability': 'pages/government/sustainability.html',

    // Student
    '/student/dashboard': 'pages/student/dashboard.html',
    '/student/learning': 'pages/student/learning.html',
    '/student/courses': 'pages/student/courses.html',
    '/student/scholarships': 'pages/student/scholarships.html',
    '/student/discussions': 'pages/student/discussions.html',

    // Livestock
    '/livestock/hub': 'pages/livestock/hub.html',
    '/livestock/breeding': 'pages/livestock/breeding.html',
    '/livestock/feed': 'pages/livestock/feed.html',
    '/livestock/health': 'pages/livestock/health.html',

    // Landing
    '/': 'pages/landing/home.html',
    '/foundation': 'pages/landing/foundation.html',
  };

  const routeTitles = {
    '/farmer/dashboard': 'Farmer Dashboard',
    '/farmer/digital-farm': 'Digital Farm',
    '/farmer/jicho-ai': 'Jicho AI',
    '/farmer/livestock': 'Livestock',
    '/farmer/spray-diary': 'Spray Diary',
    '/marketplace/soko': 'Soko Marketplace',
    '/marketplace/buyer-dashboard': 'Buyer Dashboard',
    '/marketplace/consumer-store': 'Fresh From The Farm',
    '/marketplace/orders': 'My Orders',
    '/marketplace/saved': 'Saved Listings',
    '/marketplace/alerts': 'Price Alerts',
    '/admin/dashboard': 'Platform Analytics',
    '/admin/users': 'User Management',
    '/admin/verification': 'Verification Queue',
    '/admin/patterns': 'Pattern Review',
    '/admin/disputes': 'Dispute Resolution',
    '/admin/transactions': 'Transaction Monitoring',
    '/admin/ai-training': 'AI Training',
    '/admin/network': 'Network Health',
    '/admin/monetization': 'Monetization',
    '/admin/security': 'Sentinel AI Security',
    '/finance/hub': 'Finance Hub',
    '/finance/loans': 'Smart Loans',
    '/finance/approvals': 'Approval Queue',
    '/finance/lender-dashboard': 'Lender Dashboard',
    '/finance/risk': 'Risk Analytics',
    '/finance/disbursement': 'Disbursement Hub',
    '/finance/portfolio': 'Portfolio',
    '/finance/collateral': 'Collateral',
    '/finance/wallet': 'Wallet',
    '/logistics/transport': 'Usafiri Transport',
    '/logistics/transporter-dashboard': 'Transporter Dashboard',
    '/logistics/deliveries': 'Deliveries',
    '/logistics/fleet': 'Fleet Management',
    '/logistics/routes': 'Route Planner',
    '/logistics/track': 'Track Shipments',
    '/logistics/history': 'Trip History',
    '/ai/assistant': 'Jicho AI Assistant',
    '/ai/diagnosis': 'Crop Diagnosis',
    '/ai/analytics': 'Farm Intelligence',
    '/gis/maps': 'Ramani GIS',
    '/gis/precision-view': 'Precision View',
    '/gis/boundary': 'Boundary Refinement',
    '/community/hub': 'Community Hub',
    '/community/groups': 'Vikundi Groups',
    '/community/chat': 'Chat',
    '/community/news': 'Habari Intelligence',
    '/community/events': 'Events',
    '/user/profile': 'My Profile',
    '/user/settings': 'Settings',
    '/user/notifications': 'Notifications',
    '/auth/login': 'Sign In',
    '/auth/register': 'Register',
    '/expert/dashboard': 'Expert Dashboard',
    '/expert/bookings': 'Bookings',
    '/expert/knowledge': 'Knowledge Base',
    '/expert/consultations': 'Consultations',
    '/expert/earnings': 'Earnings',
    '/processor/dashboard': 'Processor Hub',
    '/processor/supply-chain': 'Supply Chain',
    '/processor/quality': 'Quality Control',
    '/processor/inbound': 'Inbound Logistics',
    '/processor/procurement': 'Procurement',
    '/government/dashboard': 'Institution Dashboard',
    '/government/alerts': 'Alerts & Policy',
    '/government/regional': 'Regional Data',
    '/government/compliance': 'Compliance',
    '/government/sustainability': 'Sustainability',
    '/student/dashboard': 'Student Dashboard',
    '/student/learning': 'Learning Portal',
    '/student/courses': 'My Courses',
    '/student/scholarships': 'Scholarships',
    '/student/discussions': 'Discussions',
    '/livestock/hub': 'Livestock Hub',
    '/livestock/breeding': 'Breeding & Genetics',
    '/livestock/feed': 'Feed Management',
    '/livestock/health': 'Health & Biosecurity',
    '/': 'Welcome to AGRI-NEST',
    '/foundation': 'AGRI-NEST Foundation',
  };

  let currentPath = '';

  function parseHash() {
    const hash = window.location.hash || '#/';
    return hash.replace('#', '').split('?')[0] || '/';
  }

  function parseQuery() {
    const hash = window.location.hash || '';
    const queryIndex = hash.indexOf('?');
    if (queryIndex === -1) return {};
    const params = new URLSearchParams(hash.slice(queryIndex + 1));
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  }

  async function navigate(path, pushState = true) {
    if (!path) return;

    const targetPath = path.startsWith('/') ? path : '/' + path;

    if (typeof AppCore === 'undefined') {
      console.error('[Router] AppCore not loaded — check db.js and script order.');
      return;
    }
    const access = AppCore.resolveNavigation(targetPath);
    if (access.redirect && access.redirect !== targetPath) {
      if (access.reason === 'auth') {
        Shell.toast('Please sign in to continue', 'info');
      }
      await navigate(access.redirect, pushState);
      return;
    }

    if (targetPath === currentPath) {
      AppCore.applyLayout(targetPath);
      return;
    }

    const filePath = routes[targetPath];

    if (!filePath) {
      render404();
      return;
    }

    const currentRole = AppState.get('currentRole');
    if (!RoleSystem.isRouteAccessible(targetPath, currentRole)) {
      const fallbackRoute = RoleSystem.getRoleConfig(currentRole).homeRoute;
      Shell.toast('Access denied for your role. Redirecting to your dashboard.', 'error');
      if (fallbackRoute && fallbackRoute !== targetPath) {
        await navigate(fallbackRoute, true);
        return;
      }
      renderUnauthorized();
      return;
    }

    currentPath = targetPath;
    AppState.set('currentRoute', targetPath);

    if (pushState) {
      window.location.hash = targetPath;
    }

    // Update shell
    Shell.updateActiveStates(targetPath);
    Shell.updatePageTitle(routeTitles[targetPath] || 'AGRI-NEST');

    // Load content
    await loadContent(filePath);
  }

  async function loadContent(filePath) {
    const outlet = document.getElementById('app-content');
    if (!outlet) return;

    outlet.classList.add('is-loading');

    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Failed to load ${filePath}`);

      const html = await response.text();
      outlet.innerHTML = html;
      outlet.classList.remove('is-loading');

      // Trigger page enter animation
      const firstChild = outlet.firstElementChild;
      if (firstChild) {
        firstChild.classList.add('page-enter');
      }

      // Execute any inline scripts in the partial
      executeScripts(outlet);

      if (typeof AppCore !== 'undefined') {
        await AppCore.afterPageLoad(currentPath, outlet);
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Router error:', err);
      outlet.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <span class="material-symbols-outlined text-6xl text-on-surface-variant mb-4">error</span>
          <h2 class="font-headline-md text-headline-md text-primary mb-2">Page Not Available</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mb-6">We couldn't load this page. It may still be under construction.</p>
          <button onclick="Router.navigate('/')" class="btn btn-primary">Go Home</button>
        </div>
      `;
      outlet.classList.remove('is-loading');
    }
  }

  function executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.replaceWith(newScript);
    });
  }

  function render404() {
    const outlet = document.getElementById('app-content');
    if (!outlet) return;
    outlet.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant mb-4">travel_explore</span>
        <h2 class="font-headline-md text-headline-md text-primary mb-2">Page Not Found</h2>
        <p class="font-body-md text-body-md text-on-surface-variant mb-6">The page you're looking for doesn't exist in the AGRI-NEST ecosystem.</p>
        <button onclick="Router.navigate('/')" class="btn btn-primary">Go Home</button>
      </div>
    `;
  }

  function renderUnauthorized() {
    const outlet = document.getElementById('app-content');
    if (!outlet) return;
    outlet.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span class="material-symbols-outlined text-6xl text-error mb-4">lock</span>
        <h2 class="font-headline-md text-headline-md text-primary mb-2">Access Restricted</h2>
        <p class="font-body-md text-body-md text-on-surface-variant mb-6">This section is not available for your current role. You have been redirected to your dashboard.</p>
        <button onclick="Router.navigate('/')" class="btn btn-primary">Go Home</button>
      </div>
    `;
  }

  function init() {
    window.addEventListener('hashchange', () => {
      navigate(parseHash(), false);
    });

    // Handle initial load
    const savedUser = AppCore.getSavedUser();
    const initialPath = parseHash();
    if (savedUser && typeof AppState !== 'undefined') {
      AppState.set('user', savedUser);
      AppState.set('currentRole', savedUser.role || AppState.get('currentRole'));
    }
    if (initialPath && initialPath !== '/') {
      navigate(initialPath, false);
    } else if (savedUser) {
      const role = savedUser.role || AppState.get('currentRole');
      const config = RoleSystem.getRoleConfig(role);
      navigate(config.homeRoute, false);
    } else {
      navigate('/', false);
    }
  }

  function getCurrentPath() {
    return currentPath;
  }

  function getQuery() {
    return parseQuery();
  }

  return {
    navigate,
    init,
    getCurrentPath,
    getQuery,
    routes,
    routeTitles,
  };
})();
