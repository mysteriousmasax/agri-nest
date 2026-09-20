/**
 * AGRI-NEST Global State Management
 * Lightweight reactive state with localStorage persistence
 */

const AppState = (function () {
  const subscribers = {};

  const state = {
    currentRole: localStorage.getItem('agri-nest-role') || 'farmer',
    user: JSON.parse(localStorage.getItem('agri-nest-user') || 'null') || {
      name: 'Neema Mwangi',
      avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&h=100&fit=crop&crop=face',
      trustScore: 845,
      location: 'Iringa, Tanzania',
      bankAccounts: [
        { bankName: 'CRDB Bank', last4: '4291' },
        { bankName: 'NBC Bank', last4: '8830' }
      ]
    },
    notifications: [
      { id: 1, text: 'Maize price increased 8% in Iringa', time: '10 min ago', read: false },
      { id: 2, text: 'Spray diary reminder: Field 2', time: '1 hr ago', read: false },
      { id: 3, text: 'New message from Grace Mwamba', time: '2 hrs ago', read: true },
    ],
    theme: localStorage.getItem('agri-nest-theme') || 'light',
    language: localStorage.getItem('agri-nest-language') || (navigator.language?.startsWith('sw') ? 'sw' : 'en'),
    sidebarOpen: false,
    sidebarCollapsed: localStorage.getItem('agri-nest-sidebar-collapsed') === 'true',
    currentRoute: '',
    unreadCount: 2,
  };

  if (state.sidebarCollapsed) {
    document.body.classList.add('sidebar-collapsed');
  }

  function get(key) {
    return state[key];
  }

  function set(key, value) {
    const oldValue = state[key];
    state[key] = value;

    // Persist to localStorage
    if (key === 'currentRole' || key === 'theme' || key === 'language') {
      localStorage.setItem(`agri-nest-${key}`, value);
    }
    if (key === 'user') {
      try {
        localStorage.setItem('agri-nest-user', JSON.stringify(value));
      } catch (e) {
        console.warn('Failed to persist user to localStorage', e);
      }
    }

    // Notify subscribers
    if (subscribers[key]) {
      subscribers[key].forEach((cb) => cb(value, oldValue));
    }
  }

  function subscribe(key, callback) {
    if (!subscribers[key]) subscribers[key] = [];
    subscribers[key].push(callback);

    // Return unsubscribe function
    return () => {
      subscribers[key] = subscribers[key].filter((cb) => cb !== callback);
    };
  }

  function isRole(role) {
    return state.currentRole === role;
  }

  function hasAnyRole(roles) {
    return roles.includes(state.currentRole);
  }

  function toggleTheme() {
    const next = state.theme === 'light' ? 'dark' : 'light';
    set('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  function initTheme() {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }

  function setLanguage(lang) {
    const normalized = ['en', 'sw'].includes(lang) ? lang : 'en';
    set('language', normalized);
    localStorage.setItem('agri-nest-language', normalized);
    document.documentElement.setAttribute('lang', normalized);
  }

  function toggleLanguage() {
    const next = state.language === 'sw' ? 'en' : 'sw';
    setLanguage(next);
  }

  function initLanguage() {
    document.documentElement.setAttribute('lang', state.language);
  }

  function toggleSidebar() {
    set('sidebarOpen', !state.sidebarOpen);
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    if (sidebar && backdrop) {
      const open = state.sidebarOpen;
      sidebar.classList.toggle('-translate-x-full', !open);
      backdrop.classList.toggle('hidden', !open);
    }
  }

  function closeSidebar() {
    set('sidebarOpen', false);
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
  }

  function setSidebarCollapsed(collapsed) {
    set('sidebarCollapsed', collapsed);
    localStorage.setItem('agri-nest-sidebar-collapsed', collapsed ? 'true' : 'false');
    document.body.classList.toggle('sidebar-collapsed', collapsed);
  }

  function toggleSidebarCollapsed() {
    setSidebarCollapsed(!state.sidebarCollapsed);
  }

  function markNotificationRead(id) {
    const notifs = state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    set('notifications', notifs);
    set('unreadCount', notifs.filter((n) => !n.read).length);
  }

  return {
    get,
    set,
    subscribe,
    isRole,
    hasAnyRole,
    toggleTheme,
    initTheme,
    setLanguage,
    toggleLanguage,
    initLanguage,
    toggleSidebar,
    closeSidebar,
    toggleSidebarCollapsed,
    setSidebarCollapsed,
    markNotificationRead,
    _raw: state,
  };
})();
