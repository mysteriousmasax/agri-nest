/**
 * AGRI-NEST Mock API Layer
 * Simulates a full backend with realistic Tanzanian agricultural data
 * Supports all 10 roles with CRUD operations, auth, search, and real-time features
 */

const API = (function () {
  // Simulated network delay
  const DELAY = 150;

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms || DELAY));
  }

  // ==========================================
  //  AUTH ENDPOINTS
  // ==========================================
  async function login(email, password, role) {
    await delay(500);
    const user = DB.users.find((u) => u.email === email && u.role === role);
    if (!user) {
      // Auto-create user for demo purposes
      const newUser = {
        id: DB.users.length + 1,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=3d2b1f&color=fff&size=128`,
        trustScore: Math.floor(Math.random() * 400) + 600,
        location: 'Iringa, Tanzania',
        verified: true,
        joinedAt: new Date().toISOString(),
      };
      DB.users.push(newUser);
      DB.save();
      return { success: true, user: newUser, token: 'mock-jwt-' + Date.now() };
    }
    return { success: true, user, token: 'mock-jwt-' + Date.now() };
  }

  async function register(data) {
    await delay(700);
    const newUser = {
      id: DB.users.length + 1,
      email: data.email,
      name: data.name || 'New User',
      role: data.role || 'farmer',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=3d2b1f&color=fff&size=128`,
      trustScore: 500,
      location: data.location || 'Dar es Salaam, Tanzania',
      verified: false,
      joinedAt: new Date().toISOString(),
    };
    DB.users.push(newUser);
    DB.save();
    return { success: true, user: newUser, token: 'mock-jwt-' + Date.now() };
  }

  // ==========================================
  //  FARMER ENDPOINTS
  // ==========================================
  async function getFarmerDashboard() {
    await delay();
    return DB.farmerDashboard;
  }

  async function getDigitalFarm() {
    await delay();
    return DB.digitalFarm;
  }

  async function getCrops() {
    await delay();
    return DB.crops;
  }

  async function getSprayDiary() {
    await delay();
    return DB.sprayDiary;
  }

  async function addSprayEntry(entry) {
    await delay(300);
    const newEntry = { id: DB.sprayDiary.length + 1, ...entry, date: entry.date || new Date().toISOString().split('T')[0] };
    DB.sprayDiary.unshift(newEntry);
    return { success: true, entry: newEntry };
  }

  async function getLivestock() {
    await delay();
    return DB.livestock;
  }

  // ==========================================
  //  MARKETPLACE ENDPOINTS
  // ==========================================
  async function getSokoListings(filters) {
    await delay();
    let results = [...DB.sokoListings];
    if (filters?.category) results = results.filter((l) => l.category === filters.category);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((l) => l.name.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q));
    }
    if (filters?.sort === 'price-low') results.sort((a, b) => a.price - b.price);
    if (filters?.sort === 'price-high') results.sort((a, b) => b.price - a.price);
    return { listings: results, total: results.length };
  }

  async function getBuyerDashboard() {
    await delay();
    return DB.buyerDashboard;
  }

  async function getOrders() {
    await delay();
    return DB.orders;
  }

  async function createOrder(listingId, quantity) {
    await delay(400);
    const listing = DB.sokoListings.find((l) => l.id === listingId);
    if (!listing) return { success: false, error: 'Listing not found' };
    const order = {
      id: DB.orders.length + 100,
      listingId,
      item: listing.name,
      quantity,
      total: listing.price * quantity,
      status: 'pending',
      seller: listing.seller,
      date: new Date().toISOString().split('T')[0],
    };
    DB.orders.unshift(order);
    return { success: true, order };
  }

  // ==========================================
  //  FINANCE ENDPOINTS
  // ==========================================
  async function getFinanceHub() {
    await delay();
    return DB.financeHub;
  }

  async function getLoans() {
    await delay();
    return DB.loans;
  }

  async function applyForLoan(data) {
    await delay(600);
    const loan = {
      id: 'LN-' + (DB.loans.length + 1000),
      amount: data.amount,
      purpose: data.purpose,
      status: 'pending',
      interestRate: 12.5,
      term: data.term || 12,
      appliedDate: new Date().toISOString().split('T')[0],
      collateral: data.collateral || 'Farm Produce',
    };
    DB.loans.unshift(loan);
    return { success: true, loan };
  }

  async function getLenderDashboard() {
    await delay();
    return DB.lenderDashboard;
  }

  async function getApprovalQueue() {
    await delay();
    return DB.approvalQueue;
  }

  async function approveLoan(loanId, decision) {
    await delay(400);
    const loan = DB.loans.find((l) => l.id === loanId);
    if (loan) loan.status = decision;
    return { success: true };
  }

  // ==========================================
  //  LOGISTICS ENDPOINTS
  // ==========================================
  async function getTransporterDashboard() {
    await delay();
    return DB.transporterDashboard;
  }

  async function getDeliveries() {
    await delay();
    return DB.deliveries;
  }

  async function getFleet() {
    await delay();
    return DB.fleet;
  }

  // ==========================================
  //  AI ENDPOINTS
  // ==========================================
  async function getAIAssistant() {
    await delay();
    return DB.aiAssistant;
  }

  async function diagnoseCrop(imageData, cropHint) {
    await delay(1500); // Simulate AI processing
    // Use cropDiagnoses array for realistic results
    let pool = DB.cropDiagnoses;
    if (cropHint) {
      const filtered = pool.filter(d => d.crop.toLowerCase().includes(cropHint.toLowerCase()));
      if (filtered.length > 0) pool = filtered;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async function getAIAnalytics() {
    await delay();
    return DB.aiAnalytics;
  }

  async function trainAIDataset() {
    await delay(1200);
    try {
      const researchRes = await fetch('assets/data/east_africa_research_datasets.json');
      const research = researchRes.ok ? await researchRes.json() : {};
      if (typeof AILearningEngine !== 'undefined') {
        const { summary, moduleStates, moduleLearning } = AILearningEngine.trainAllModules(research);
        return {
          success: true,
          summary,
          moduleStates,
          moduleLearning,
          trainingLog: DB.trainingLog || [],
          aiAssistant: DB.aiAssistant,
          aiAnalytics: DB.aiAnalytics,
          researchCatalog: DB.researchCatalog,
        };
      }
      if (DB.trainAIFromEastAfricaDataset) {
        const summary = DB.trainAIFromEastAfricaDataset();
        return { success: true, summary, trainingLog: DB.trainingLog || [], aiAssistant: DB.aiAssistant, aiAnalytics: DB.aiAnalytics };
      }
    } catch (e) {
      console.error(e);
    }
    return { success: false, error: 'Dataset training is unavailable.' };
  }

  async function getModuleLearning() {
    await delay();
    return DB.moduleLearning || { modules: AILearningEngine?.MODULES || [] };
  }

  async function getResearchCatalog() {
    await delay();
    return { catalog: DB.researchCatalog || [], insights: DB.moduleInsights || {} };
  }

  async function getEcosystemFeed(role) {
    await delay(100);
    const r = role || AppState.get('currentRole');
    if (typeof EcosystemEngine !== 'undefined') {
      return EcosystemEngine.getEcosystemFeed(r);
    }
    return { inbox: [], global: DB.globalActivityFeed || [], linked: {} };
  }

  async function getCrossRoleInbox(role) {
    await delay();
    const r = role || AppState.get('currentRole');
    return typeof EcosystemEngine !== 'undefined' ? EcosystemEngine.getInboxForRole(r) : [];
  }

  // ==========================================
  //  GIS ENDPOINTS
  // ==========================================
  async function getGISData() {
    await delay();
    return DB.gisData;
  }

  // ==========================================
  //  COMMUNITY ENDPOINTS
  // ==========================================
  async function getCommunityHub() {
    await delay();
    return DB.communityHub;
  }

  async function getGroups() {
    await delay();
    return DB.groups;
  }

  async function getChatMessages(groupId) {
    await delay(200);
    return DB.chatMessages[groupId] || DB.chatMessages['default'];
  }

  async function sendMessage(groupId, text) {
    await delay(100);
    const msg = {
      id: Date.now(),
      sender: AppState.get('user').name,
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      avatar: AppState.get('user').avatar,
    };
    if (!DB.chatMessages[groupId]) DB.chatMessages[groupId] = [];
    DB.chatMessages[groupId].push(msg);
    return { success: true, message: msg };
  }

  // ==========================================
  //  ADMIN ENDPOINTS
  // ==========================================
  async function getAdminDashboard() {
    await delay();
    return DB.adminDashboard;
  }

  async function getUsers(filters) {
    await delay();
    let results = [...DB.users];
    if (filters?.role) results = results.filter((u) => u.role === filters.role);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return { users: results, total: results.length };
  }

  // ==========================================
  //  EXPERT ENDPOINTS
  // ==========================================
  async function getExpertDashboard() {
    await delay();
    return DB.expertDashboard;
  }

  async function getBookings() {
    await delay();
    return DB.bookings;
  }

  async function createBooking(data) {
    await delay(400);
    const booking = {
      id: DB.bookings.length + 1,
      ...data,
      status: 'pending',
      date: data.date || new Date().toISOString().split('T')[0],
    };
    DB.bookings.push(booking);
    return { success: true, booking };
  }

  // ==========================================
  //  GOVERNMENT ENDPOINTS
  // ==========================================
  async function getGovernmentDashboard() {
    await delay();
    return DB.governmentDashboard;
  }

  // ==========================================
  //  STUDENT ENDPOINTS
  // ==========================================
  async function getStudentDashboard() {
    await delay();
    return DB.studentDashboard;
  }

  async function getCourses() {
    await delay();
    return DB.courses;
  }

  // ==========================================
  //  PROCESSOR ENDPOINTS
  // ==========================================
  async function getProcessorDashboard() {
    await delay();
    return DB.processorDashboard;
  }

  // ==========================================
  //  NOTIFICATIONS
  // ==========================================
  async function getNotifications() {
    await delay(100);
    return DB.notifications;
  }

  async function markNotificationRead(id) {
    await delay(50);
    const n = DB.notifications.find((n) => n.id === id);
    if (n) n.read = true;
    return { success: true };
  }

  // ==========================================
  //  SEARCH (Global)
  // ==========================================
  async function search(query) {
    await delay(300);
    const q = query.toLowerCase();
    const results = {
      crops: DB.crops.filter((c) => c.name?.toLowerCase().includes(q)),
      listings: DB.sokoListings.filter((l) => l.name?.toLowerCase().includes(q)),
      users: DB.users.filter((u) => u.name?.toLowerCase().includes(q)),
      groups: DB.groups.filter((g) => g.name?.toLowerCase().includes(q)),
    };
    return results;
  }

  // ==========================================
  //  USER PROFILE
  // ==========================================
  async function getProfile() {
    await delay();
    return AppState.get('user');
  }

  async function updateProfile(data) {
    await delay(300);
    const user = AppState.get('user');
    Object.assign(user, data);
    AppState.set('user', user);
    return { success: true, user };
  }

  // ==========================================
  //  SETTINGS
  // ==========================================
  async function getSettings() {
    await delay(100);
    return DB.settings;
  }

  async function updateSettings(data) {
    await delay(200);
    Object.assign(DB.settings, data);
    localStorage.setItem('agri-nest-settings', JSON.stringify(DB.settings));
    return { success: true, settings: DB.settings };
  }

  return {
    login,
    register,
    getFarmerDashboard,
    getDigitalFarm,
    getCrops,
    getSprayDiary,
    addSprayEntry,
    getLivestock,
    getSokoListings,
    getBuyerDashboard,
    getOrders,
    createOrder,
    getFinanceHub,
    getLoans,
    applyForLoan,
    getLenderDashboard,
    getApprovalQueue,
    approveLoan,
    getTransporterDashboard,
    getDeliveries,
    getFleet,
    getAIAssistant,
    diagnoseCrop,
    getAIAnalytics,
    trainAIDataset,
    getModuleLearning,
    getResearchCatalog,
    getEcosystemFeed,
    getCrossRoleInbox,
    getGISData,
    getCommunityHub,
    getGroups,
    getChatMessages,
    sendMessage,
    getAdminDashboard,
    getUsers,
    getExpertDashboard,
    getBookings,
    createBooking,
    getGovernmentDashboard,
    getStudentDashboard,
    getCourses,
    getProcessorDashboard,
    getNotifications,
    markNotificationRead,
    search,
    getProfile,
    updateProfile,
    getSettings,
    updateSettings,
  };
})();
