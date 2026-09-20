/**
 * AGRI-NEST Shell Controller
 * Renders sidebar, topbar, mobile nav, and handles role switching
 */

const Shell = (function () {
  function init() {
    renderSidebar();
    renderTopbar();
    renderMobileNav();
    renderRoleSwitcher();
    renderToastContainer();

    // Subscribe to role changes
    AppState.subscribe('currentRole', () => {
      renderSidebar();
      renderTopbar();
      renderMobileNav();
      // Update user based on role
      const roleUser = DB.users.find(u => u.role === AppState.get('currentRole'));
      if (roleUser) {
        AppState.set('user', roleUser);
        localStorage.setItem('agri-nest-user', JSON.stringify(roleUser));
      }
    });

    AppState.subscribe('sidebarCollapsed', () => {
      renderSidebar();
      renderTopbar();
    });

    AppState.subscribe('theme', () => {
      renderTopbar();
    });

    AppState.subscribe('language', () => {
      renderTopbar();
    });

    // Close sidebar when clicking backdrop
    const backdrop = document.getElementById('mobile-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', AppState.closeSidebar);
    }

    // Close dropdowns / search results / modal on outside click
    document.addEventListener('click', (e) => {
      const profileDropdown = document.getElementById('profile-dropdown');
      const notifDropdown = document.getElementById('notif-dropdown');
      const searchResults = document.getElementById('search-results');
      const roleModal = document.getElementById('role-switcher-modal');
      const target = e.target;

      if (profileDropdown && !profileDropdown.contains(target)) {
        profileDropdown.classList.add('hidden');
        document.getElementById('profile-btn')?.setAttribute('aria-expanded', 'false');
      }
      if (notifDropdown && !notifDropdown.contains(target)) {
        notifDropdown.classList.add('hidden');
        document.getElementById('notif-btn')?.setAttribute('aria-expanded', 'false');
      }
      if (searchResults && !searchResults.contains(target) && target !== document.getElementById('global-search')) {
        searchResults.classList.add('hidden');
      }
      if (roleModal && roleModal.classList.contains('open') && !roleModal.contains(target)) {
        closeRoleSwitcher();
      }

      const sidebar = document.getElementById('sidebar');
      const sidebarToggle = document.getElementById('sidebar-toggle');
      if (
        sidebar &&
        AppState.get('sidebarOpen') &&
        !sidebar.contains(target) &&
        !(sidebarToggle && sidebarToggle.contains(target))
      ) {
        AppState.closeSidebar();
      }
    });

    // Close dropdowns and search results with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('profile-dropdown')?.classList.add('hidden');
        document.getElementById('notif-dropdown')?.classList.add('hidden');
        document.getElementById('search-results')?.classList.add('hidden');
        closeRoleSwitcher();
      }
    });

    // Handle browser back/forward for mobile
    window.addEventListener('popstate', () => {
      const hash = window.location.hash || '#/';
      const path = hash.replace('#', '') || '/';
      if (path !== AppState.get('currentRoute')) {
        Router.navigate(path, false);
      }
    });
  }

  /* AGRI-NEST SVG Logo markup */
  const LOGO_SVG = `<svg viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8 w-auto">
    <!-- Leaf / plant sprout icon -->
    <g>
      <circle cx="18" cy="18" r="18" fill="#2d6a4f"/>
      <path d="M18 27 C18 27 11 21 11 15 C11 11.13 14.13 8 18 8 C21.87 8 25 11.13 25 15 C25 21 18 27 18 27Z" fill="#74c69d"/>
      <path d="M18 14 L18 27" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M18 18 C18 18 14 16 13 13" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
      <path d="M18 20 C18 20 22 17.5 23 14.5" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
    </g>
    <!-- AGRI-NEST wordmark -->
    <text x="42" y="14" font-family="Syne,sans-serif" font-weight="800" font-size="11" fill="currentColor" letter-spacing="0.5">AGRI-NEST</text>
    <text x="42" y="26" font-family="DM Sans,sans-serif" font-weight="400" font-size="8" fill="currentColor" opacity="0.65" letter-spacing="0.8">DIGITAL AGRI-OS</text>
  </svg>`;

  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const collapsed = AppState.get('sidebarCollapsed');

    // Apply glass sidebar
    sidebar.classList.add('glass-sidebar');
    sidebar.classList.toggle('collapsed', collapsed);

    const role = AppState.get('currentRole');
    const config = RoleSystem.getRoleConfig(role);
    const user = AppState.get('user');

    const navItems = config.sidebar
      .map(
        (item) => `
        <a href="#${item.route}" 
           data-route="${item.route}"
           class="nav-item ${item.route === AppState.get('currentRoute') ? 'active' : ''}">
          <span class="material-symbols-outlined ${item.route === AppState.get('currentRoute') ? 'icon-fill' : ''}">${item.icon}</span>
          <div class="nav-item-content">
            <span class="nav-item-label">${item.label}</span>
            ${item.description ? `<span class="nav-item-description text-[11px] text-white/60 mt-0.5">${item.description}</span>` : ''}
          </div>
          ${item.badge ? `<span class="ml-auto bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">${item.badge}</span>` : ''}
        </a>
      `
      )
      .join('');

    sidebar.innerHTML = `
      <div class="px-5 mb-6 flex items-center justify-between gap-3">
        <div class="sidebar-brand flex items-center gap-3 text-white">
          ${LOGO_SVG}
        </div>
        <button id="sidebar-collapse-btn" class="p-2 rounded-full border border-white/10 text-white/80 hover:bg-white/10 transition-colors" aria-label="Toggle sidebar">
          <span class="material-symbols-outlined">${collapsed ? 'chevron_right' : 'chevron_left'}</span>
        </button>
      </div>
      <div class="px-5 mb-4">
        <p class="font-label-md text-[10px] uppercase tracking-widest opacity-50 text-white">${config.label}</p>
      </div>
      <div class="flex-1 overflow-y-auto px-2 space-y-1 no-scrollbar">
        ${navItems}
      </div>
      <div class="px-4 pt-4 border-t border-outline-variant/10 space-y-2 mt-auto">
        <a href="#/user/settings" data-route="/user/settings" class="nav-item ${'/user/settings' === AppState.get('currentRoute') ? 'active' : ''}">
          <span class="material-symbols-outlined ${'/user/settings' === AppState.get('currentRoute') ? 'icon-fill' : ''}">settings</span>
          <span>Settings</span>
        </a>
        <button type="button" id="sidebar-signout" class="nav-item w-full text-left">
          <span class="material-symbols-outlined">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    `;

    // Attach click handlers
    sidebar.querySelectorAll('a[data-route]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        Router.navigate(route);
        AppState.closeSidebar();
      });
    });

    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        AppState.toggleSidebarCollapsed();
      });
    }

    const signOutBtn = document.getElementById('sidebar-signout');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
      });
    }
  }

  function renderTopbar() {
    const topbar = document.getElementById('topbar');
    if (!topbar) return;

    // Apply glass topbar
    topbar.classList.add('glass-topbar');

    const role = AppState.get('currentRole');
    const config = RoleSystem.getRoleConfig(role);
    const user = AppState.get('user');
    const unread = AppState.get('unreadCount');
    const currentRoute = AppState.get('currentRoute');
    const pageTitle = Router.routeTitles[currentRoute] || 'AGRI-NEST';

    topbar.innerHTML = `
      <div class="flex items-center gap-3">
        <button id="sidebar-toggle" class="md:hidden text-white/80 p-2 rounded-full hover:bg-white/10 transition-colors">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <!-- Logo inline on mobile -->
        <div class="md:hidden text-white">${LOGO_SVG}</div>
        <span class="font-headline-sm text-headline-sm font-bold text-white/95 hidden md:block">${pageTitle}</span>
      </div>
      
      <div class="flex-1 max-w-2xl mx-auto hidden md:block px-4">
        <div class="relative w-full">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/50">search</span>
          <input type="text" 
                 class="w-full bg-white/10 border border-white/20 rounded-full py-2.5 pl-12 pr-4 font-body-md text-white focus:ring-2 focus:ring-white/30 transition-shadow placeholder:text-white/50 text-sm"
                 placeholder="${config.searchPlaceholder}"
                 id="global-search"
                 aria-label="Search AGRI-NEST"
                 aria-controls="search-results"
                 oninput="Shell.handleSearch(this.value)">
          <div id="search-results" class="hidden absolute left-0 right-0 mt-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-elevated overflow-hidden z-50"></div>
        </div>
        <div class="mt-2 hidden md:flex items-center gap-2 text-white/70 text-sm">
          <span class="material-symbols-outlined text-base">badge</span>
          <span>${config.label}</span>
        </div>
      </div>
      
      <div class="topbar-actions flex items-center space-x-2 md:space-x-3">
        <button onclick="ThemeController.toggle()" class="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80" aria-label="Toggle theme">
          <span class="material-symbols-outlined" id="theme-icon">${AppState.get('theme') === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <button onclick="Router.navigate('/gis/maps')" class="px-3 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white/80 text-sm font-semibold" id="ramani-map-btn">
          <span class="material-symbols-outlined">map</span>
          <span class="hidden md:inline">Ramani</span>
        </button>
        <button onclick="Router.navigate('/foundation')" class="px-3 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white/80 text-sm font-semibold" id="foundation-btn">
          <span class="material-symbols-outlined">volunteer_activism</span>
          <span class="hidden md:inline">Foundation</span>
        </button>
        <button onclick="AppState.toggleLanguage()" class="px-3 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white/80 text-sm font-semibold" id="language-toggle">
          ${AppState.get('language') === 'sw' ? 'SW' : 'EN'}
        </button>
        
        <div class="relative">
          <button id="notif-btn" class="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 relative" aria-haspopup="true" aria-expanded="false" aria-label="Notifications">
            <span class="material-symbols-outlined">notifications</span>
            ${unread > 0 ? `<span class="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border border-white"></span>` : ''}
          </button>
          <div id="notif-dropdown" class="hidden absolute right-0 mt-2 w-80 glass-surface rounded-xl border-0 shadow-elevated z-50 overflow-hidden" role="menu" aria-label="Notification list">
            <div class="p-4 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 class="font-headline-sm text-headline-sm text-primary">Notifications</h3>
              <span class="font-label-md text-label-md text-secondary cursor-pointer hover:underline">Mark all read</span>
            </div>
            <div class="max-h-80 overflow-y-auto">
              ${AppState.get('notifications').map(n => `
                <div class="p-4 border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors cursor-pointer ${!n.read ? 'bg-tertiary-fixed/10' : ''}" onclick="AppState.markNotificationRead(${n.id}); Shell.renderTopbar();">
                  <p class="font-body-sm text-body-sm text-on-surface ${!n.read ? 'font-medium' : ''}">${n.text}</p>
                  <p class="font-label-md text-label-md text-on-surface-variant mt-1">${n.time}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="relative">
          <button id="profile-btn" class="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/10 transition-colors border border-white/20" aria-haspopup="true" aria-expanded="false" aria-label="User menu">
            <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover border-2 border-white/30">
            <span class="hidden md:block font-label-md text-label-md text-white/90">${user.name.split(' ')[0]}</span>
            <span class="material-symbols-outlined text-white/60 text-sm">expand_more</span>
          </button>
          <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-64 glass-surface rounded-xl border-0 shadow-elevated z-50 overflow-hidden" role="menu" aria-label="User menu">
            <div class="p-4 border-b border-outline-variant/10">
              <p class="font-label-lg text-label-lg text-on-surface font-bold">${user.name}</p>
              <p class="font-label-md text-label-md text-on-surface-variant">${config.label}</p>
              <div class="flex items-center gap-1 mt-2 text-tertiary-container">
                <span class="material-symbols-outlined text-[14px] icon-fill">star</span>
                <span class="font-label-md text-label-md font-bold">${user.trustScore}</span>
                <span class="font-label-md text-label-md">Trust Score</span>
              </div>
            </div>
            <div class="p-2">
              <a href="#${config.homeRoute}" data-route="${config.homeRoute}" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface font-body-sm text-body-sm">
                <span class="material-symbols-outlined text-on-surface-variant">home</span> Role Home
              </a>
              <a href="#/user/profile" data-route="/user/profile" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface font-body-sm text-body-sm">
                <span class="material-symbols-outlined text-on-surface-variant">person</span> My Profile
              </a>
              <a href="#/user/settings" data-route="/user/settings" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface font-body-sm text-body-sm">
                <span class="material-symbols-outlined text-on-surface-variant">settings</span> Settings
              </a>
              <button onclick="Shell.openRoleSwitcher()" class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface font-body-sm text-body-sm text-left">
                <span class="material-symbols-outlined text-on-surface-variant">switch_account</span> Switch Role
              </button>
            </div>
            <div class="p-2 border-t border-outline-variant/10">
              <button type="button" id="profile-signout" class="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors text-error font-body-sm text-body-sm text-left">
                <span class="material-symbols-outlined">logout</span> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach handlers
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', AppState.toggleSidebar);
    }

    const notifBtn = document.getElementById('notif-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('notif-dropdown');
        const isHidden = dropdown.classList.toggle('hidden');
        document.getElementById('profile-dropdown').classList.add('hidden');
        notifBtn.setAttribute('aria-expanded', String(!isHidden));
        document.getElementById('profile-btn')?.setAttribute('aria-expanded', 'false');
      });
    }

    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('profile-dropdown');
        const isHidden = dropdown.classList.toggle('hidden');
        document.getElementById('notif-dropdown').classList.add('hidden');
        profileBtn.setAttribute('aria-expanded', String(!isHidden));
        document.getElementById('notif-btn')?.setAttribute('aria-expanded', 'false');
      });
    }

    topbar.querySelectorAll('a[data-route]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate(link.getAttribute('data-route'));
      });
    });

    const profileSignOut = document.getElementById('profile-signout');
    if (profileSignOut) {
      profileSignOut.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
      });
    }

    // Theme icon subscription
    AppState.subscribe('theme', (theme) => {
      const icon = document.getElementById('theme-icon');
      if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    });
    // Language toggle subscription
    AppState.subscribe('language', (lang) => {
      const btn = document.getElementById('language-toggle');
      if (btn) btn.textContent = lang === 'sw' ? 'SW' : 'EN';
    });
  }

  function renderMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    if (!mobileNav) return;

    // Apply glass mobile nav
    mobileNav.classList.add('glass-mobile-nav');

    const role = AppState.get('currentRole');
    const config = RoleSystem.getRoleConfig(role);
    const currentRoute = AppState.get('currentRoute');

    const items = config.mobileNav
      .map((item) => {
        const isActive = item.route === currentRoute;
        if (item.center) {
          return `
            <a href="#${item.route}" data-route="${item.route}" class="mobile-nav-item relative">
              <div class="absolute -top-3 bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center shadow-natural">
                <span class="material-symbols-outlined ${isActive ? 'icon-fill' : ''}">${item.icon}</span>
              </div>
              <span class="text-[10px] mt-8 font-bold text-primary">${item.label}</span>
            </a>
          `;
        }
        return `
          <a href="#${item.route}" data-route="${item.route}" class="mobile-nav-item ${isActive ? 'active' : ''}">
            <span class="material-symbols-outlined ${isActive ? 'icon-fill' : ''}">${item.icon}</span>
            <span class="text-[10px] mt-1 font-medium">${item.label}</span>
          </a>
        `;
      })
      .join('');

    mobileNav.innerHTML = items;

    mobileNav.querySelectorAll('a[data-route]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        Router.navigate(link.getAttribute('data-route'));
      });
    });
  }

  function renderRoleSwitcher() {
    const modal = document.getElementById('role-switcher-modal');
    if (!modal) return;

    const allRoles = RoleSystem.getAllRoles();
    const currentRole = AppState.get('currentRole');

    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="role-switcher-title">
        <div class="role-switcher-panel bg-surface rounded-3xl p-6 max-w-xl w-full shadow-elevated border border-outline-variant/10">
          <div class="flex justify-between items-center mb-4">
            <h3 id="role-switcher-title" class="font-headline-sm text-headline-sm text-primary">Switch Role</h3>
            <button type="button" onclick="Shell.closeRoleSwitcher()" class="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant" aria-label="Close role switcher">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="space-y-2">
            ${allRoles
              .map(
                (r) => `
              <button type="button" class="w-full role-option flex items-center gap-3 p-4 rounded-2xl text-left ${r.key === currentRole ? 'bg-primary/10 border border-primary/20' : 'border border-outline-variant/20'} hover:bg-surface-container-low" onclick="Shell.switchRole('${r.key}')" aria-pressed="${r.key === currentRole}">
                <div class="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span class="material-symbols-outlined">switch_account</span>
                </div>
                <div class="flex-1">
                  <p class="font-label-lg text-label-lg text-on-surface font-bold">${r.label}</p>
                  <p class="font-label-md text-label-md text-on-surface-variant">${r.brand}</p>
                </div>
                ${r.key === currentRole ? '<span class="material-symbols-outlined text-secondary ml-auto">check_circle</span>' : ''}
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
    modal.setAttribute('aria-hidden', 'true');

  }

  function renderToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }

  function openRoleSwitcher() {
    renderRoleSwitcher();
    const modal = document.getElementById('role-switcher-modal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeRoleSwitcher() {
    const modal = document.getElementById('role-switcher-modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function switchRole(roleKey) {
    AppState.set('currentRole', roleKey);
    const config = RoleSystem.getRoleConfig(roleKey);
    Router.navigate(config.homeRoute);
    closeRoleSwitcher();
  }

  function updateActiveStates(route) {
    // Sidebar
    document.querySelectorAll('#sidebar .nav-item').forEach((item) => {
      const itemRoute = item.getAttribute('data-route');
      const isActive = itemRoute === route;
      item.classList.toggle('active', isActive);
      const icon = item.querySelector('.material-symbols-outlined');
      if (icon) icon.classList.toggle('icon-fill', isActive);
    });

    // Mobile nav
    document.querySelectorAll('#mobile-nav .mobile-nav-item').forEach((item) => {
      const itemRoute = item.getAttribute('data-route');
      item.classList.toggle('active', itemRoute === route);
      const icon = item.querySelector('.material-symbols-outlined');
      if (icon) icon.classList.toggle('icon-fill', itemRoute === route);
    });
  }

  function updatePageTitle(title) {
    document.title = title ? `${title} | AGRI-NEST` : 'AGRI-NEST';
    const titleEl = document.getElementById('topbar')?.querySelector('.font-headline-sm');
    if (titleEl) titleEl.textContent = title;
  }

  // Toast utilities
  function toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toastEl = document.createElement('div');
    toastEl.className = `toast toast-${type}`;

    const icons = {
      success: 'check_circle',
      error: 'error',
      info: 'info',
    };

    toastEl.innerHTML = `
      <span class="material-symbols-outlined ${type === 'success' ? 'text-tertiary' : type === 'error' ? 'text-error' : 'text-secondary'}">${icons[type]}</span>
      <span>${message}</span>
    `;

    container.appendChild(toastEl);

    setTimeout(() => {
      toastEl.style.animation = 'toastIn 300ms ease-out reverse forwards';
      setTimeout(() => toastEl.remove(), 300);
    }, 4000);
  }

  // Global search handler
  function handleSearch(query) {
    const input = document.getElementById('global-search');
    const results = document.getElementById('search-results');
    if (!results || !input) return;
    const q = String(query || '').trim().toLowerCase();
    if (q.length < 2) {
      results.classList.add('hidden');
      results.innerHTML = '';
      return;
    }

    const titles = Router.routeTitles;
    const matches = Object.entries(titles)
      .filter(([route, title]) => title.toLowerCase().includes(q) || route.toLowerCase().includes(q))
      .slice(0, 8);

    if (!matches.length) {
      results.innerHTML = `<div class="px-4 py-3 text-sm text-on-surface-variant">No pages match “${input.value}”. Try another term.</div>`;
      results.classList.remove('hidden');
      return;
    }

    results.innerHTML = matches
      .map(([route, title]) => `
        <button type="button" class="w-full text-left px-4 py-3 hover:bg-surface-container-high transition-colors text-on-surface" data-route="${route}">
          <span class="font-bold block">${title}</span>
          <span class="text-[11px] text-on-surface-variant">${route}</span>
        </button>
      `)
      .join('');
    results.classList.remove('hidden');

    results.querySelectorAll('button[data-route]').forEach((button) => {
      button.addEventListener('click', () => {
        const route = button.getAttribute('data-route');
        if (route) {
          Router.navigate(route);
          input.value = '';
          results.classList.add('hidden');
        }
      });
    });
  }

  // Login handler for auth pages
  function handleLogin(email, role, userOverride) {
    const user = userOverride || DB.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || DB.users.find((u) => u.role === role) || DB.users[0];
    const resolvedRole = user.role || role;
    AppState.set('user', user);
    AppState.set('currentRole', resolvedRole);
    localStorage.setItem('agri-nest-user', JSON.stringify(user));
    const config = RoleSystem.getRoleConfig(resolvedRole);
    Router.navigate(config.homeRoute);
    toast(`Welcome back, ${user.name}!`, 'success');
  }

  // Quick helper to switch to the Smallholder Farmer role and navigate to their dashboard
  function goToSmallholderDashboard() {
    const roleKey = 'farmer';
    AppState.set('currentRole', roleKey);
    const config = RoleSystem.getRoleConfig(roleKey);
    Router.navigate(config.homeRoute);
  }

  // Logout handler
  function handleLogout() {
    localStorage.removeItem('agri-nest-user');
    AppState.set('user', {
      name: 'Guest',
      avatar: 'https://ui-avatars.com/api/?name=Guest&background=2d6a4f&color=fff',
      trustScore: 0,
      location: 'Tanzania',
    });
    AppCore.applyLayout('/auth/login');
    Router.navigate('/auth/login');
    toast('Signed out successfully', 'info');
  }

  return {
    init,
    renderSidebar,
    renderTopbar,
    renderMobileNav,
    renderRoleSwitcher,
    openRoleSwitcher,
    closeRoleSwitcher,
    switchRole,
    goToSmallholderDashboard,
    updateActiveStates,
    updatePageTitle,
    toast,
    handleSearch,
    handleLogin,
    handleLogout,
  };
})();
