/**
 * AGRI-NEST Cross-Role Ecosystem Engine
 * Links farmers, buyers, lenders, transporters, experts, government, students, processors
 */

const EcosystemEngine = (function () {
  /** activity type -> roles that should receive inbox + notification */
  const STAKEHOLDER_MAP = {
    field_add: ['expert', 'government', 'lender'],
    spray_log: ['expert', 'government'],
    jicho_scan: ['expert', 'admin', 'government'],
    listing_create: ['buyer', 'processor', 'transporter'],
    order_create: ['farmer', 'transporter', 'lender'],
    order_complete: ['farmer', 'buyer', 'finance'],
    loan_apply: ['lender', 'admin', 'government'],
    loan_approve: ['farmer', 'lender'],
    delivery_assign: ['farmer', 'buyer', 'transporter'],
    expert_booking: ['farmer', 'expert'],
    consultation_complete: ['farmer', 'student'],
    ai_full_train: ['admin', 'expert', 'student'],
    drought_alert: ['farmer', 'government', 'transporter', 'lender'],
    research_ingest: ['admin', 'student', 'expert', 'government'],
    message_send: ['user'],
    gps_track: ['government', 'lender'],
  };

  const ROLE_USER_INDEX = {
    farmer: [1, 2, 12],
    buyer: [4, 13],
    lender: [6, 14],
    transporter: [5, 15],
    expert: [9],
    government: [8],
    student: [10],
    processor: [7],
    admin: [3],
    user: [11],
  };

  function init() {
    if (!DB || DB._ecosystemPatched) return;
    const originalAdd = DB.addActivity.bind(DB);
    DB.addActivity = function (activity) {
      const entry = originalAdd(activity);
      propagateToStakeholders(entry);
      return entry;
    };
    DB._ecosystemPatched = true;
    seedCrossRoleInbox();
    seedInterRoleLinks();
    console.log('[Ecosystem] Cross-role engine active');
  }

  function seedCrossRoleInbox() {
    DB.crossRoleInbox = DB.crossRoleInbox || [];
    if (DB.crossRoleInbox.length > 0) return;

    const samples = [
      { id: 1, toRole: 'buyer', fromUserId: 1, fromName: 'Neema Mwangi', fromRole: 'farmer', type: 'listing_create', message: 'New maize listing: 500kg @ TZS 850/kg — Iringa', actionRoute: '/marketplace/soko', read: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, toRole: 'lender', fromUserId: 1, fromName: 'Neema Mwangi', fromRole: 'farmer', type: 'loan_apply', message: 'Loan application TZS 2,500,000 — Seasonal Inputs', actionRoute: '/finance/approvals', read: false, timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: 3, toRole: 'expert', fromUserId: 2, fromName: 'Juma Hassan', fromRole: 'farmer', type: 'jicho_scan', message: 'Jicho scan: Maize Northern Leaf Blight — needs review', actionRoute: '/expert/consultations', read: false, timestamp: new Date(Date.now() - 10800000).toISOString() },
      { id: 4, toRole: 'transporter', fromUserId: 4, fromName: 'Grace Mwamba', fromRole: 'buyer', type: 'order_create', message: 'Escrow order #1042 — 200kg beans to Dar es Salaam', actionRoute: '/logistics/deliveries', read: false, timestamp: new Date(Date.now() - 14400000).toISOString() },
      { id: 5, toRole: 'processor', fromUserId: 1, fromName: 'Neema Mwangi', fromRole: 'farmer', type: 'listing_create', message: 'Sunflower batch available — 2 tonnes Mbeya', actionRoute: '/processor/inbound', read: false, timestamp: new Date(Date.now() - 18000000).toISOString() },
      { id: 6, toRole: 'government', fromUserId: 3, fromName: 'Amina Khamis', fromRole: 'admin', type: 'research_ingest', message: 'JRC drought layer ingested — sorghum -18% Ethiopia', actionRoute: '/government/alerts', read: false, timestamp: new Date(Date.now() - 21600000).toISOString() },
      { id: 7, toRole: 'student', fromUserId: 9, fromName: 'Dr. Richard Mgata', fromRole: 'expert', type: 'consultation_complete', message: 'Case study published: Bean rust IPM — Morogoro', actionRoute: '/student/learning', read: true, timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 8, toRole: 'farmer', fromUserId: 6, fromName: 'CRDB Agri-Finance', fromRole: 'lender', type: 'loan_approve', message: 'Your input loan TZS 500,000 has been approved', actionRoute: '/finance/hub', read: false, timestamp: new Date(Date.now() - 43200000).toISOString() },
    ];
    DB.crossRoleInbox = samples;
    DB.save();
  }

  function seedInterRoleLinks() {
    DB.interRoleLinks = DB.interRoleLinks || {
      farmerToBuyer: DB.sokoListings?.slice(0, 5).map((l) => ({ listingId: l.id, farmer: l.seller, buyerInterest: DB.buyerDashboard?.stats?.activeOrders || 0 })),
      farmerToLender: DB.loans?.slice(0, 3).map((l) => ({ loanId: l.id, farmer: l.applicant, status: l.status })),
      buyerToTransporter: DB.orders?.slice(0, 3).map((o) => ({ orderId: o.id, item: o.item, status: o.status })),
      expertToFarmer: DB.bookings?.slice(0, 3) || [],
      processorToFarmer: DB.sokoListings?.filter((l) => ['Maize', 'Sunflower', 'Coffee'].includes(l.category)).slice(0, 4),
    };
  }

  function propagateToStakeholders(activity) {
    const roles = STAKEHOLDER_MAP[activity.type] || [];
    if (!roles.length) return;

    DB.crossRoleInbox = DB.crossRoleInbox || [];
    const fromRole = activity.role || 'farmer';
    const fromName = activity.userName || 'System';

    roles.forEach((toRole) => {
      if (toRole === fromRole) return;
      DB.crossRoleInbox.unshift({
        id: Date.now() + Math.random(),
        toRole,
        fromUserId: activity.userId,
        fromName,
        fromRole,
        type: activity.type,
        message: activity.message,
        actionRoute: routeForType(activity.type),
        read: false,
        timestamp: activity.timestamp || new Date().toISOString(),
      });
    });

    if (DB.crossRoleInbox.length > 300) DB.crossRoleInbox.splice(300);
    pushAppNotification(activity, roles);
    DB.save();
  }

  function routeForType(type) {
    const map = {
      listing_create: '/marketplace/soko',
      order_create: '/logistics/deliveries',
      order_complete: '/marketplace/orders',
      loan_apply: '/finance/approvals',
      loan_approve: '/finance/hub',
      jicho_scan: '/expert/consultations',
      expert_booking: '/expert/bookings',
      delivery_assign: '/logistics/track',
      drought_alert: '/government/alerts',
      research_ingest: '/admin/ai-training',
      ai_full_train: '/admin/ai-training',
      field_add: '/gis/maps',
    };
    return map[type] || '/user/notifications';
  }

  function pushAppNotification(activity, targetRoles) {
    const notifs = AppState.get('notifications') || [];
    const role = AppState.get('currentRole');
    if (targetRoles.includes(role)) {
      notifs.unshift({
        id: Date.now(),
        text: `[${activity.fromRole || activity.role || 'system'}] ${activity.message}`.slice(0, 120),
        time: 'Just now',
        read: false,
        route: routeForType(activity.type),
      });
      AppState.set('notifications', notifs.slice(0, 30));
      AppState.set('unreadCount', notifs.filter((n) => !n.read).length);
    }
  }

  function broadcastSystemEvent(type, payload) {
    DB.addActivity({
      type,
      userId: 0,
      userName: 'AGRI-NEST Intelligence',
      role: 'admin',
      message: payload.message,
      icon: 'hub',
      color: 'text-secondary',
    });
  }

  function getInboxForRole(role) {
    return (DB.crossRoleInbox || []).filter((m) => m.toRole === role).slice(0, 50);
  }

  function getEcosystemFeed(role, limit = 30) {
    const inbox = getInboxForRole(role);
    const global = (DB.globalActivityFeed || []).slice(0, limit);
    const linked = getLinkedEntitiesForRole(role);
    return { inbox, global, linked, researchCount: (DB.researchCatalog || []).length };
  }

  function getLinkedEntitiesForRole(role) {
    const links = DB.interRoleLinks || {};
    switch (role) {
      case 'buyer':
        return { listings: DB.sokoListings?.slice(0, 8), orders: DB.orders?.slice(0, 5) };
      case 'lender':
        return { loans: DB.loans, queue: DB.approvalQueue };
      case 'transporter':
        return { deliveries: DB.deliveries, drought: DB.transporterDashboard?.droughtAlerts };
      case 'farmer':
        return { orders: DB.orders?.filter((o) => o.seller?.includes?.(AppState.get('user')?.name?.split(' ')[0]) || true).slice(0, 5), bookings: DB.bookings };
      case 'expert':
        return { bookings: DB.bookings, jicho: DB.jichoHistory?.slice(0, 5) };
      case 'processor':
        return { inbound: links.processorToFarmer, supply: DB.supplyChain };
      case 'government':
        return { drought: DB.governmentDashboard?.droughtStatus, production: DB.governmentDashboard?.productionSnapshot };
      case 'student':
        return { modules: DB.studentDashboard?.datasetModules };
      case 'admin':
        return { users: DB.users?.length, modules: DB.moduleLearning?.modules, feed: DB.globalActivityFeed?.slice(0, 10) };
      default:
        return links;
    }
  }

  function markInboxRead(id) {
    const item = (DB.crossRoleInbox || []).find((m) => m.id === id);
    if (item) {
      item.read = true;
      DB.save();
    }
  }

  function notifyOrderFlow(order, listing) {
    DB.addActivity({
      type: 'order_create',
      userId: AppState.get('user')?.id,
      userName: AppState.get('user')?.name,
      role: AppState.get('currentRole'),
      message: `Order placed: ${order.item} — ${AppCore?.formatTZS?.(order.total) || order.total}`,
      icon: 'shopping_cart',
      color: 'text-secondary',
    });
  }

  function notifyListing(listing) {
    DB.addActivity({
      type: 'listing_create',
      userId: AppState.get('user')?.id,
      userName: AppState.get('user')?.name,
      role: 'farmer',
      message: `New listing: ${listing.name} — ${listing.quantity || ''} ${listing.unit || ''} @ TZS ${listing.price}/${listing.unit || 'kg'}`,
      icon: 'storefront',
      color: 'text-primary',
    });
  }

  function notifyDroughtFromResearch(research) {
    const d = research?.jrcDrought;
    if (!d) return;
    DB.addActivity({
      type: 'drought_alert',
      userId: 0,
      userName: 'JRC / FAOSTAT',
      role: 'government',
      message: `Drought alert (${d.alertLevel}): sorghum impacts up to ${Math.abs(d.impacts?.[0]?.changePct || 18)}% in ${d.impacts?.[0]?.country}`,
      icon: 'warning',
      color: 'text-error',
    });
  }

  return {
    init,
    getInboxForRole,
    getEcosystemFeed,
    getLinkedEntitiesForRole,
    markInboxRead,
    broadcastSystemEvent,
    notifyOrderFlow,
    notifyListing,
    notifyDroughtFromResearch,
    STAKEHOLDER_MAP,
  };
})();
