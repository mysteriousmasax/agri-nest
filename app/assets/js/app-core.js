/**
 * AGRI-NEST Application Core
 * Auth guards, shell layout modes, and route page hooks
 */

const AppCore = (function () {
  const PUBLIC_ROUTES = new Set(['/', '/foundation', '/auth/login', '/auth/register']);
  const MINIMAL_LAYOUT_ROUTES = new Set(['/auth/login', '/auth/register']);

  const ECOSYSTEM_DASHBOARD_ROUTES = [
    '/farmer/dashboard', '/marketplace/buyer-dashboard', '/finance/lender-dashboard',
    '/logistics/transporter-dashboard', '/expert/dashboard', '/government/dashboard',
    '/student/dashboard', '/processor/dashboard', '/admin/dashboard', '/marketplace/soko',
  ];

  const pageHooks = {
    '/farmer/dashboard': hydrateFarmerDashboard,
    '/marketplace/orders': hydrateOrders,
    '/finance/hub': hydrateFinanceHub,
    '/admin/dashboard': hydrateAdminDashboard,
    '/finance/approvals': () => injectEcosystemPanel(),
    '/expert/consultations': () => injectEcosystemPanel(),
    '/government/alerts': () => injectEcosystemPanel(),
    '/logistics/deliveries': () => injectEcosystemPanel(),
    '/processor/inbound': () => injectEcosystemPanel(),
    '/student/learning': hydrateStudentLearning,
  };

  function formatTZS(amount) {
    const n = Number(amount) || 0;
    if (n >= 1_000_000) return `TZS ${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `TZS ${Math.round(n / 1_000)}K`;
    return `TZS ${n.toLocaleString()}`;
  }

  function formatCompact(amount) {
    const n = Number(amount) || 0;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
    return String(n);
  }

  function isAuthenticated() {
    return !!localStorage.getItem('agri-nest-user');
  }

  function getSavedUser() {
    try {
      return JSON.parse(localStorage.getItem('agri-nest-user') || 'null');
    } catch {
      return null;
    }
  }

  function requiresAuth(path) {
    return !PUBLIC_ROUTES.has(path);
  }

  function applyLayout(path) {
    const minimal = MINIMAL_LAYOUT_ROUTES.has(path);
    const publicLanding = path === '/' || path === '/foundation';

    document.body.classList.toggle('layout-minimal', minimal);
    document.body.classList.toggle('layout-public', publicLanding && !isAuthenticated());
    document.body.classList.toggle('layout-app', !minimal && !publicLanding);

    const sidebar = document.getElementById('sidebar');
    const topbar = document.getElementById('topbar');
    const mobileNav = document.getElementById('mobile-nav');
    const mainWrap = document.querySelector('.main-layout');
    const content = document.getElementById('app-content');

    const hideChrome = minimal || (publicLanding && !isAuthenticated());

    [sidebar, topbar, mobileNav].forEach((el) => {
      if (!el) return;
      el.classList.toggle('shell-hidden', hideChrome);
    });
    if (mainWrap) {
      mainWrap.classList.toggle('main-layout--full', hideChrome);
    }
    if (content) {
      content.classList.toggle('app-content--fullscreen', hideChrome);
      content.classList.toggle('app-content--panel', !hideChrome);
    }
  }

  function resolveNavigation(path) {
    const target = path.startsWith('/') ? path : `/${path}`;

    if (requiresAuth(target) && !isAuthenticated()) {
      return { redirect: '/auth/login', reason: 'auth' };
    }

    if (MINIMAL_LAYOUT_ROUTES.has(target) && isAuthenticated()) {
      const user = getSavedUser();
      const role = user?.role || AppState.get('currentRole');
      const home = RoleSystem.getRoleConfig(role).homeRoute;
      return { redirect: home, reason: 'already-auth' };
    }

    return { allow: target };
  }

  function wrapPageContent(outlet) {
    if (!outlet || outlet.querySelector('.app-page')) return;
    const child = outlet.firstElementChild;
    if (!child) return;
    const wrap = document.createElement('div');
    wrap.className = 'app-page';
    while (outlet.firstChild) wrap.appendChild(outlet.firstChild);
    outlet.appendChild(wrap);
  }

  async function afterPageLoad(path, outlet) {
    applyLayout(path);
    wrapPageContent(outlet);
    if (ECOSYSTEM_DASHBOARD_ROUTES.includes(path)) {
      await injectEcosystemPanel();
    }
    const hook = pageHooks[path];
    if (hook) {
      try {
        await hook(outlet);
      } catch (err) {
        console.error('[AppCore] Page hook failed:', path, err);
      }
    }
    updateShellInboxBadge();
  }

  async function injectEcosystemPanel() {
    const page = document.querySelector('#app-content .app-page') || document.getElementById('app-content');
    if (!page || page.querySelector('#ecosystem-cross-role-panel')) return;

    const role = AppState.get('currentRole');
    const feed = typeof EcosystemEngine !== 'undefined'
      ? EcosystemEngine.getEcosystemFeed(role)
      : { inbox: [], global: [] };

    const panel = document.createElement('section');
    panel.id = 'ecosystem-cross-role-panel';
    panel.className = 'mb-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-4';
    panel.innerHTML = `
      <div class="flex flex-wrap justify-between items-center gap-2 mb-3">
        <h3 class="font-headline-sm text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary">hub</span>
          Cross-Role Network
        </h3>
        <span class="text-xs text-on-surface-variant">${(DB.researchCatalog || []).length} research sources active</span>
      </div>
      <div class="space-y-2 max-h-40 overflow-y-auto custom-scrollbar" id="ecosystem-inbox-items"></div>
    `;
    page.insertBefore(panel, page.firstChild);

    const items = feed.inbox?.filter((m) => !m.read).slice(0, 5) || feed.inbox?.slice(0, 5) || [];
    const list = panel.querySelector('#ecosystem-inbox-items');
    if (list) {
      list.innerHTML = items.length
        ? items.map((m) => `
          <button type="button" class="w-full text-left p-2 rounded-lg hover:bg-surface-container-low flex gap-2 text-sm"
            onclick="EcosystemEngine.markInboxRead(${m.id}); Router.navigate('${m.actionRoute}')">
            <span class="material-symbols-outlined text-secondary shrink-0">mark_email_unread</span>
            <span><strong>${m.fromName}</strong> (${m.fromRole}) — ${m.message}</span>
          </button>`).join('')
        : '<p class="text-sm text-on-surface-variant">No pending cross-role messages. Activity from other users will appear here.</p>';
    }
  }

  function updateShellInboxBadge() {
    const role = AppState.get('currentRole');
    const unread = (DB.crossRoleInbox || []).filter((m) => m.toRole === role && !m.read).length;
    const notifBtn = document.getElementById('notif-btn');
    if (notifBtn && unread > 0) {
      let badge = notifBtn.querySelector('.ecosystem-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'ecosystem-badge absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1';
        notifBtn.appendChild(badge);
      }
      badge.textContent = unread > 9 ? '9+' : unread;
    }
  }

  async function hydrateStudentLearning() {
    const catalog = DB.studentDashboard?.datasetModules || DB.researchCatalog || [];
    const el = document.getElementById('student-dataset-modules');
    if (!el || !catalog.length) return;
    el.innerHTML = catalog.slice(0, 9).map((m) => `
      <a href="${m.url}" target="_blank" rel="noopener" class="card p-3 block hover:border-primary/30">
        <p class="font-bold text-sm text-primary">${m.title || m.name}</p>
        <p class="text-xs text-on-surface-variant">${m.provider}</p>
      </a>`).join('');
  }

  async function hydrateFarmerDashboard() {
    const data = await API.getFarmerDashboard();
    const user = AppState.get('user');
    const fields = (await API.getDigitalFarm())?.fields || [];

    const w = data?.weather || {};
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el && val != null) el.textContent = val;
    };

    set('wcard-temp', w.temp ?? 24);
    set('wcard-desc', w.condition ?? 'Partly Cloudy');
    set('wcard-hum', `${w.humidity ?? 62}%`);
    set('wcard-wind', w.wind ?? '14km/h');
    set('wcard-agro', w.rainfall
      ? `🌧️ ${w.rainfall} — monitor field drainage today`
      : '🌾 Good planting window — soil moisture optimal for maize and beans');

    if (user?.location) {
      const loc = document.querySelector('#wcard-date')?.parentElement;
      if (loc) loc.innerHTML = `📍 ${user.location} · <span id="wcard-date">Today</span>`;
    }

    const stats = data?.stats || {};
    const grid = document.getElementById('dash-stats');
    if (grid) {
      const vals = grid.querySelectorAll('.dash-stat-val');
      if (vals[0]) vals[0].textContent = stats.activeFields ?? fields.length;
      if (vals[2]) vals[2].textContent = String(DB.sokoListings?.filter((l) => l.seller === user?.name).length || 4);
      if (vals[3]) vals[3].textContent = formatCompact(stats.monthlyRevenue ?? 2450000);
      if (vals[4]) vals[4].textContent = stats.livestockCount ?? 12;
      if (vals[5]) vals[5].textContent = formatCompact(500000);
    }

    const sub = document.getElementById('dash-sub');
    if (sub && fields[0]) {
      sub.innerHTML = `Your farms are thriving. <strong>${fields[0].crop}</strong> in ${fields[0].name} is at <strong>${fields[0].health}%</strong> health.`;
    }

    const trustEl = document.getElementById('stat-trust');
    if (trustEl && user?.trustScore) trustEl.textContent = user.trustScore;
  }

  async function hydrateOrders() {
    const orders = await API.getOrders();
    const list = document.getElementById('orders-list');
    if (!list || !orders?.length) return;
    list.innerHTML = orders
      .slice(0, 12)
      .map(
        (o) => `
      <div class="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p class="font-label-lg font-bold text-primary">${o.item}</p>
          <p class="text-sm text-on-surface-variant">${o.seller} · ${o.date}</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-primary">${formatTZS(o.total)}</p>
          <span class="badge badge-${o.status === 'delivered' ? 'success' : 'warning'}">${o.status}</span>
        </div>
      </div>`
      )
      .join('');
  }

  async function hydrateFinanceHub() {
    const hub = await API.getFinanceHub();
    const bal = document.getElementById('wallet-balance');
    if (bal && hub?.balance != null) bal.textContent = formatTZS(hub.balance);
  }

  async function hydrateAdminDashboard() {
    const dash = await API.getAdminDashboard();
    const usersEl = document.getElementById('admin-total-users');
    if (usersEl && dash?.stats?.totalUsers) usersEl.textContent = dash.stats.totalUsers.toLocaleString();
  }

  function init() {
    AppState.subscribe('currentRoute', applyLayout);
    document.addEventListener('AgriNestDataReady', () => updateShellInboxBadge());
    if (typeof EcosystemEngine !== 'undefined') EcosystemEngine.init();
  }

  return {
    init,
    resolveNavigation,
    afterPageLoad,
    applyLayout,
    formatTZS,
    formatCompact,
    isAuthenticated,
    getSavedUser,
    PUBLIC_ROUTES,
  };
})();
