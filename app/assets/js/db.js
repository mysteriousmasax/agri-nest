/**
 * AGRI-NEST Database Seed Layer
 * Realistic Tanzanian agricultural data for all 10 roles
 * All amounts in TZS, locations in Tanzania, crops/livestock native to East Africa
 */

const DB = (function () {
  // Read existing database state from localStorage if available
  const stored = JSON.parse(localStorage.getItem('agri-nest-db') || 'null');

  // ==========================================
  //  USERS
  // ==========================================
  const users = (stored && stored.users) || [
    { id: 1, email: 'neema@agrines.tz', name: 'Neema Mwangi', role: 'farmer', avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&h=100&fit=crop&crop=face', trustScore: 845, location: 'Iringa, Tanzania', verified: true, joinedAt: '2024-03-15' },
    { id: 2, email: 'juma@agrines.tz', name: 'Juma Hassan', role: 'farmer', avatar: 'https://ui-avatars.com/api/?name=Juma+Hassan&background=3d2b1f&color=fff', trustScore: 920, location: 'Morogoro, Tanzania', verified: true, joinedAt: '2024-01-10' },
    { id: 3, email: 'admin@agrines.tz', name: 'Amina Khamis', role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Amina+Khamis&background=1e3330&color=fff', trustScore: 999, location: 'Dar es Salaam, Tanzania', verified: true, joinedAt: '2023-06-01' },
    { id: 4, email: 'grace@agrines.tz', name: 'Grace Mwamba', role: 'buyer', avatar: 'https://ui-avatars.com/api/?name=Grace+Mwamba&background=a03f29&color=fff', trustScore: 780, location: 'Dar es Salaam, Tanzania', verified: true, joinedAt: '2024-02-20' },
    { id: 5, email: 'joseph@agrines.tz', name: 'Joseph Malima', role: 'transporter', avatar: 'https://ui-avatars.com/api/?name=Joseph+Malima&background=354b48&color=fff', trustScore: 710, location: 'Dodoma, Tanzania', verified: true, joinedAt: '2024-04-05' },
    { id: 6, email: 'crdb@agrines.tz', name: 'CRDB Agri-Finance', role: 'lender', avatar: 'https://ui-avatars.com/api/?name=CRDB+Bank&background=3d2b1f&color=fff', trustScore: 990, location: 'Dar es Salaam, Tanzania', verified: true, joinedAt: '2023-08-12' },
    { id: 7, email: 'silk@agrines.tz', name: 'Silk Road Processors', role: 'processor', avatar: 'https://ui-avatars.com/api/?name=Silk+Road&background=1e3330&color=fff', trustScore: 860, location: 'Arusha, Tanzania', verified: true, joinedAt: '2024-01-18' },
    { id: 8, email: 'ministry@agrines.tz', name: 'Ministry of Agriculture', role: 'government', avatar: 'https://ui-avatars.com/api/?name=Min+Agri&background=26170c&color=fff', trustScore: 999, location: 'Dodoma, Tanzania', verified: true, joinedAt: '2023-01-01' },
    { id: 9, email: 'mgata@agrines.tz', name: 'Dr. Richard Mgata', role: 'expert', avatar: 'https://ui-avatars.com/api/?name=Dr+Mgata&background=3d2b1f&color=fff', trustScore: 950, location: 'Morogoro, Tanzania', verified: true, joinedAt: '2024-02-01' },
    { id: 10, email: 'zawadi@sua.tz', name: 'Zawadi Joseph', role: 'student', avatar: 'https://ui-avatars.com/api/?name=Zawadi+Joseph&background=a03f29&color=fff', trustScore: 650, location: 'Morogoro, Tanzania', verified: true, joinedAt: '2024-09-01' },
    { id: 11, email: 'fatma@agrines.tz', name: 'Fatma Abdallah', role: 'user', avatar: 'https://ui-avatars.com/api/?name=Fatma+Abdallah&background=354b48&color=fff', trustScore: 720, location: 'Zanzibar, Tanzania', verified: true, joinedAt: '2024-05-12' },
    { id: 12, email: 'peter@agrines.tz', name: 'Peter Mlowe', role: 'farmer', avatar: 'https://ui-avatars.com/api/?name=Peter+Mlowe&background=3d2b1f&color=fff', trustScore: 680, location: 'Mbeya, Tanzania', verified: true, joinedAt: '2024-06-20' },
    { id: 13, email: 'ashaf@agrines.tz', name: 'Ashura Hamis', role: 'buyer', avatar: 'https://ui-avatars.com/api/?name=Ashura+Hamis&background=a03f29&color=fff', trustScore: 830, location: 'Mwanza, Tanzania', verified: true, joinedAt: '2024-03-15' },
    { id: 14, email: 'nmb@agrines.tz', name: 'NMB Microfinance', role: 'lender', avatar: 'https://ui-avatars.com/api/?name=NMB+Bank&background=1e3330&color=fff', trustScore: 980, location: 'Dar es Salaam, Tanzania', verified: true, joinedAt: '2023-09-01' },
    { id: 15, email: 'tanzania@agrines.tz', name: 'Tanzania Transport Co.', role: 'transporter', avatar: 'https://ui-avatars.com/api/?name=TTC&background=354b48&color=fff', trustScore: 750, location: 'Dar es Salaam, Tanzania', verified: true, joinedAt: '2024-01-25' },
  ];

  // ==========================================
  //  EAST AFRICA SELECTION DATA
  // ==========================================
  const locationHierarchy = (stored && stored.locationHierarchy) || {
    countries: ['Tanzania', 'Kenya', 'Uganda'],
    regions: {
      Tanzania: ['Iringa', 'Dar es Salaam', 'Morogoro', 'Mbeya', 'Dodoma', 'Arusha', 'Mwanza', 'Mtwara'],
      Kenya: ['Nairobi', 'Kiambu', 'Kisumu', 'Nakuru', 'Machakos', 'Eldoret', 'Mombasa'],
      Uganda: ['Kampala', 'Jinja', 'Gulu', 'Mbarara', 'Entebbe'],
    },
    cities: {
      Iringa: ['Iringa', 'Mbeya'],
      'Dar es Salaam': ['Dar es Salaam', 'Temeke'],
      Morogoro: ['Morogoro', 'Kilosa'],
      Mbeya: ['Mbeya', 'Songea'],
      Dodoma: ['Dodoma', 'Mpwapwa'],
      Arusha: ['Arusha', 'Meru'],
      Mwanza: ['Mwanza', 'Muleba'],
      Nairobi: ['Nairobi'],
      Kiambu: ['Kiambu'],
      Kisumu: ['Kisumu'],
      Nakuru: ['Nakuru'],
      Machakos: ['Machakos'],
      Eldoret: ['Eldoret'],
      Mombasa: ['Mombasa'],
      Kampala: ['Kampala'],
      Jinja: ['Jinja'],
      Gulu: ['Gulu'],
      Mbarara: ['Mbarara'],
      Entebbe: ['Entebbe'],
    },
    districts: {
      Iringa: ['Talawanda', 'Kilolo', 'Mufindi'],
      Mbeya: ['Mbeya Urban', 'Mbeya Rural'],
      'Dar es Salaam': ['Ilala', 'Kinondoni', 'Temeke'],
      Morogoro: ['Kilosa', 'Morogoro Urban'],
      Dodoma: ['Dodoma Urban', 'Chamwino'],
      Arusha: ['Arusha Urban', 'Karatu'],
      Mwanza: ['Mwanza Urban', 'Ilemela'],
      Nairobi: ['Westlands', 'Kasarani', 'Langata'],
      Kisumu: ['Kisumu Central', 'Nyando'],
      Kampala: ['Central', 'Nakawa'],
    },
    wards: {
      Talawanda: ['Kapiri', 'Lupembe'],
      Kilolo: ['Mlafu', 'Ilolo'],
      Ilala: ['Kivukoni', 'Upanga'],
      Kinondoni: ['Msasani', 'Kijitonyama'],
      Temeke: ['Changombe', 'Kibada'],
      Nairobi: ['Parklands', 'Karen'],
      Kampala: ['Nakasero', 'Makindye'],
    },
    streets: {
      Tanzania: ['Mwalimu Nyerere Rd', 'Mlimani St', 'Samora St', 'Kilimanjaro Ave'],
      Kenya: ['Uhuru Highway', 'Mombasa Road', 'Kenyatta Avenue', 'Moi Avenue'],
      Uganda: ['Kampala Road', 'Jinja Street', 'Entebbe Ave', 'Luwum St'],
    },
  };

  const cropGroups = (stored && stored.cropGroups) || {
    Cereals: ['Maize', 'Rice', 'Sorghum', 'Millet', 'Wheat'],
    Pulses: ['Beans', 'Cowpeas', 'Chickpeas', 'Lentils', 'Groundnuts'],
    Roots: ['Cassava', 'Sweet Potato', 'Irish Potato', 'Yams'],
    CashCrops: ['Coffee', 'Tea', 'Cotton', 'Tobacco', 'Sugarcane'],
    Horticulture: ['Tomatoes', 'Onions', 'Bananas', 'Avocados', 'Mangoes'],
  };

  const livestockGroups = (stored && stored.livestockGroups) || {
    Dairy: ['Dairy Cattle', 'Goats', 'Sheep'],
    Poultry: ['Broilers', 'Layers', 'Ducks', 'Turkeys'],
    Beef: ['Boran Cattle', 'Zebu Cattle', 'Angus'],
    Smallstock: ['Goats', 'Sheep', 'Pigs'],
    Aquaculture: ['Tilapia', 'Catfish'],
  };

  // ==========================================
  //  FARMER DATA
  // ==========================================
  const farmerDashboard = (stored && stored.farmerDashboard) || {
    greeting: 'Habari, Neema',
    weather: { temp: 24, condition: 'Partly Cloudy', humidity: 68, wind: '12 km/h NE', rainfall: '2.3mm today', forecast: [{ day: 'Tue', icon: 'cloud', high: 25, low: 16 }, { day: 'Wed', icon: 'rainy', high: 22, low: 15 }, { day: 'Thu', icon: 'wb_sunny', high: 28, low: 17 }, { day: 'Fri', icon: 'wb_sunny', high: 29, low: 18 }, { day: 'Sat', icon: 'cloud', high: 24, low: 16 }] },
    stats: { totalCrops: 12, activeFields: 5, livestockCount: 47, monthlyRevenue: 2450000, pendingLoans: 1, tasksToday: 3 },
    quickActions: [
      { icon: 'add_circle', label: 'Log Activity', route: '/farmer/digital-farm' },
      { icon: 'psychology', label: 'Crop Scan', route: '/ai/diagnosis' },
      { icon: 'shopping_cart', label: 'Sell Produce', route: '/marketplace/soko' },
      { icon: 'payments', label: 'Apply Loan', route: '/finance/loans' },
    ],
    recentActivities: [
      { icon: 'agriculture', text: 'Maize Field 3 — Irrigation completed', time: '2 hrs ago', color: 'text-tertiary' },
      { icon: 'pest_control', text: 'Spray reminder: Bean field aphid treatment', time: '4 hrs ago', color: 'text-secondary' },
      { icon: 'payments', text: 'Loan installment TZS 150,000 due Friday', time: '1 day ago', color: 'text-error' },
      { icon: 'shopping_cart', text: 'Sold 200kg beans @ TZS 1,800/kg', time: '2 days ago', color: 'text-tertiary' },
    ],
  };

  const digitalFarm = (stored && stored.digitalFarm) || {
    fields: [
      { id: 1, name: 'Kilimo Cha Mahindi (Maize)', area: '3.5 hectares', status: 'Growing', crop: 'Maize', stage: 'Tasseling', health: 92, planted: '2025-02-10', harvest: 'Jun 2025', color: 'bg-tertiary-fixed' },
      { id: 2, name: 'Maharage (Beans)', area: '1.2 hectares', status: 'Flowering', crop: 'Beans', stage: 'Flowering', health: 78, planted: '2025-03-01', harvest: 'Jun 2025', color: 'bg-secondary-fixed' },
      { id: 3, name: 'Pamba (Cotton)', area: '2.0 hectares', status: 'Vegetative', crop: 'Cotton', stage: 'Vegetative', health: 88, planted: '2025-01-15', harvest: 'Aug 2025', color: 'bg-primary-fixed' },
      { id: 4, name: 'Muwa (Rice Paddy)', area: '1.8 hectares', status: 'Irrigated', crop: 'Rice', stage: 'Tillering', health: 95, planted: '2025-02-20', harvest: 'Jul 2025', color: 'bg-surface-variant' },
      { id: 5, name: 'Karanga (Groundnuts)', area: '0.8 hectares', status: 'Pegging', crop: 'Groundnuts', stage: 'Pegging', health: 82, planted: '2025-03-10', harvest: 'Jul 2025', color: 'bg-secondary-container' },
    ],
    totalArea: '9.3 hectares',
    soilHealth: { ph: 6.2, nitrogen: 'Medium', phosphorus: 'Low', potassium: 'High', organic: '3.8%' },
  };

  const crops = (stored && stored.crops) || [
    { id: 1, name: 'Maize (Mahindi)', variety: 'Katumani Composite', area: '3.5 ha', stage: 'Tasseling', health: 92, expectedYield: '8.4 tons', marketPrice: 'TZS 850/kg' },
    { id: 2, name: 'Beans (Maharage)', variety: 'Lyamungu 90', area: '1.2 ha', stage: 'Flowering', health: 78, expectedYield: '1.8 tons', marketPrice: 'TZS 1,800/kg' },
    { id: 3, name: 'Cotton (Pamba)', variety: 'UKA 59', area: '2.0 ha', stage: 'Vegetative', health: 88, expectedYield: '2.5 tons', marketPrice: 'TZS 1,200/kg' },
    { id: 4, name: 'Rice (Muwa)', variety: 'SARO 5', area: '1.8 ha', stage: 'Tillering', health: 95, expectedYield: '5.4 tons', marketPrice: 'TZS 1,500/kg' },
    { id: 5, name: 'Groundnuts (Karanga)', variety: 'Nachingwea', area: '0.8 ha', stage: 'Pegging', health: 82, expectedYield: '1.2 tons', marketPrice: 'TZS 2,200/kg' },
  ];

  const sprayDiary = (stored && stored.sprayDiary) || [
    { id: 1, date: '2025-05-18', field: 'Maharage (Beans)', chemical: 'Lambda-Cyhalothrin', rate: '20ml/15L', operator: 'Neema Mwangi', reason: 'Aphid control', phi: 14, status: 'completed' },
    { id: 2, date: '2025-05-15', field: 'Kilimo Cha Mahindi', chemical: 'Mancozeb', rate: '30g/15L', operator: 'Juma Hassan', reason: 'Leaf blight prevention', phi: 7, status: 'completed' },
    { id: 3, date: '2025-05-20', field: 'Maharage (Beans)', chemical: 'Imidacloprid', rate: '15ml/15L', operator: 'Neema Mwangi', reason: 'Whitefly treatment', phi: 21, status: 'scheduled' },
  ];

  const livestock = (stored && stored.livestock) || [
    { id: 1, name: 'Bosco', type: 'Cattle', breed: 'Boran', age: '4 years', weight: '420 kg', health: 'Healthy', location: 'North Pasture' },
    { id: 2, name: 'Kijana', type: 'Cattle', breed: 'Tanzania Shorthorn Zebu', age: '2 years', weight: '280 kg', health: 'Vaccinated', location: 'South Pasture' },
    { id: 3, name: 'Malkia', type: 'Goat', breed: 'Small East African', age: '1.5 years', weight: '35 kg', health: 'Healthy', location: 'Hill Pen' },
    { id: 4, name: 'Kuku Group A', type: 'Poultry', breed: 'Kuroiler', age: '12 weeks', count: 45, health: 'Vaccinated', location: 'Coop A' },
    { id: 5, name: 'Kuku Group B', type: 'Poultry', breed: 'Sasso', age: '8 weeks', count: 30, health: 'Healthy', location: 'Coop B' },
  ];

  // ==========================================
  //  MARKETPLACE DATA
  // ==========================================
  const sokoListings = (stored && stored.sokoListings) || [
    { id: 1, name: 'Grade A Eggs (Tray 30)', category: 'Eggs', price: 550, unit: 'tray', quantity: 150, seller: 'Kiambu Organic Farm', location: 'Kiambu', rating: 8.45, verified: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBweiaDe4ifmQBO_rarsu9smqOiE-nBtmnRiE3wA1wtwxv12mcRL_gkkrdAG2gs_xrpsJ7rKwyxfCE3ivlE-5W_9D0Fxmn9XStdkFiajPZy5EsTjplWexcteDIjA4mu5Wj61sFrXwsZsfLM704s1-83RMSXVoucRhn4i_8M_3dJgIESENb_79Jb4YTR1K0QsFULwAcmSu9x9f55RctAZzvd-HafEJvGUu4o0j8iRGbH0iMwpeY-ZfJfxaBNsyFeLncuqnwaQF-cFCU' },
    { id: 2, name: 'Whole Kienyeji Chicken', category: 'Whole Chicken', price: 1200, unit: 'pc', quantity: 80, seller: 'Murang\'a Highlands Farm', location: 'Murang\'a', rating: 9.12, verified: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbYWXoMq79AOBmf93QORjAsRXyqjuLt0BX2nbA6NZugMTjOxINnNLzzn6oVOxqR--nGK3NrW_d0TKcfuZC67P_SBqWVYgHBpASJ9P41FzeEVXy8xkRscNIIXOCVNd-95o1z2HnmztgrdGKxHvWNU-mNb1OpPAdeXBw1HxWxMtujIEjU-QoFOfjfxoR6k8nM_nNWjJ1UoZNLFCw_fiUsRVMGGl7oto55B8NMt8j4ExXUNRRvCsE9qEI14U_6NxGrrpStX2n0s2dMGw' },
    { id: 3, name: 'Frozen Broiler Parts (1kg)', category: 'Parts', price: 850, unit: 'kg', quantity: 200, seller: 'Limuru Poultry Hub', location: 'Limuru', rating: 7.80, verified: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALiY8G3MBYBDP_3MWZn9NaOiHFMjqt5wxonYyyhXo-nQv-lTIlCXJJ4bezL4tspDahoLO_uCKh5lIT7seWgndfbQKzRUBcTlsNcQnX07W4oz-1J7M1CI636OtqGfQeWeQqSJ24f8-ZgRxi3rWh5A5zmyu5ZHCzyrTEJIr0LrWoiM9_y38j2GRiAeTK6K9cZ0ZBiLOCTruEGbJ-N-qc0eq1QOZdQJnrgDmEsZh29JPoAs8Q7YIsWQTufvFkVuaCNDJgkBbx6Fx2n4A' },
    { id: 4, name: 'Organic Free-Range Eggs (Tray 30)', category: 'Eggs', price: 650, unit: 'tray', quantity: 100, seller: 'Murang\'a Highlands Farm', location: 'Murang\'a', rating: 8.80, verified: true, image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&h=200&fit=crop' },
    { id: 5, name: 'Broiler Whole Chicken (1.5kg)', category: 'Whole Chicken', price: 950, unit: 'pc', quantity: 120, seller: 'Limuru Poultry Hub', location: 'Limuru', rating: 8.10, verified: true, image: 'https://images.unsplash.com/photo-1587593817642-8b940de57f98?w=300&h=200&fit=crop' },
    { id: 6, name: 'Chicken Breasts (Boneless 1kg)', category: 'Parts', price: 1100, unit: 'kg', quantity: 60, seller: 'Limuru Poultry Hub', location: 'Limuru', rating: 8.40, verified: false, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop' },
    { id: 7, name: 'Commercial Egg Crate (10 Trays)', category: 'Bulk Orders', price: 5000, unit: 'crate', quantity: 20, seller: 'Kiambu Organic Farm', location: 'Kiambu', rating: 9.30, verified: true, image: 'https://images.unsplash.com/photo-1598965402049-74e44524c96a?w=300&h=200&fit=crop' },
    { id: 8, name: 'Bulk Broiler Chicken (Box of 10)', category: 'Bulk Orders', price: 9000, unit: 'box', quantity: 15, seller: 'Limuru Poultry Hub', location: 'Limuru', rating: 8.90, verified: true, image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=300&h=200&fit=crop' },
  ];

  const buyerDashboard = (stored && stored.buyerDashboard) || {
    stats: { activeOrders: 2, totalSpent: 1750, savedItems: 4, priceAlerts: 2 },
    recentOrders: [
      { id: 101, item: 'Grade A Eggs (Tray 30)', qty: '1 tray', total: 'KES 550', status: 'In Transit', date: '2025-05-17' },
      { id: 102, item: 'Whole Kienyeji Chicken', qty: '1 pc', total: 'KES 1,200', status: 'Delivered', date: '2025-05-14' },
    ],
  };

  const orders = (stored && stored.orders) || [
    { id: 101, item: 'Grade A Eggs (Tray 30)', seller: 'Kiambu Organic Farm', qty: '1 tray', total: 550, status: 'in-transit', date: '2025-05-17', eta: '2025-05-21' },
    { id: 102, item: 'Whole Kienyeji Chicken', seller: 'Murang\'a Highlands Farm', qty: '1 pc', total: 1200, status: 'delivered', date: '2025-05-14', eta: '2025-05-16' },
  ];

  // ==========================================
  //  FINANCE DATA
  // ==========================================
  const financeHub = (stored && stored.financeHub) || {
    balance: 8500,
    currency: 'KES',
    accounts: { mobile: 3500, bank: 5000 },
    recentTransactions: [
      { id: 1, type: 'debit', desc: 'Grade A Eggs (Tray 30) purchase', amount: -550, date: '2025-05-17' },
      { id: 2, type: 'debit', desc: 'Whole Kienyeji Chicken purchase', amount: -1200, date: '2025-05-14' },
    ],
  };

  const loans = (stored && stored.loans) || [
    { id: 'LN-1001', amount: 2000000, purpose: 'Maize inputs & irrigation', status: 'active', interestRate: 12.5, term: 12, paidBack: 600000, monthlyPayment: 187500, appliedDate: '2025-01-15', lender: 'CRDB Agri-Finance' },
    { id: 'LN-1002', amount: 500000, purpose: 'Spray equipment', status: 'completed', interestRate: 10, term: 6, paidBack: 500000, monthlyPayment: 91667, appliedDate: '2024-08-01', lender: 'NMB Microfinance' },
    { id: 'LN-1003', amount: 3500000, purpose: 'Greenhouse construction', status: 'pending', interestRate: 14, term: 24, paidBack: 0, monthlyPayment: 170417, appliedDate: '2025-05-18', lender: 'CRDB Agri-Finance' },
  ];

  const approvalQueue = (stored && stored.approvalQueue) || [
    { id: 'LN-1003', farmer: 'Neema Mwangi', amount: 3500000, purpose: 'Greenhouse construction', risk: 'Low', collateral: 'Farm Land Title', creditScore: 845, submitted: '2025-05-18' },
    { id: 'LN-1004', farmer: 'Peter Mlowe', amount: 1500000, purpose: 'Rice paddy expansion', risk: 'Medium', collateral: 'Harvest Guarantee', creditScore: 680, submitted: '2025-05-19' },
    { id: 'LN-1005', farmer: 'Juma Hassan', amount: 800000, purpose: 'Poultry equipment', risk: 'Low', collateral: 'Livestock (15 cattle)', creditScore: 920, submitted: '2025-05-19' },
  ];

  const lenderDashboard = (stored && stored.lenderDashboard) || {
    totalPortfolio: 45000000,
    activeLoans: 28,
    pendingApplications: 3,
    defaultRate: '2.1%',
    monthlyDisbursement: 8500000,
    portfolioByCrop: { maize: 35, rice: 25, beans: 20, cotton: 12, other: 8 },
    recentDisbursements: [
      { id: 'LN-0998', farmer: 'Ashura Hamis', amount: 1200000, date: '2025-05-15' },
      { id: 'LN-0999', farmer: 'Juma Hassan', amount: 800000, date: '2025-05-12' },
    ],
  };

  // ==========================================
  //  LOGISTICS DATA
  // ==========================================
  const transporterDashboard = (stored && stored.transporterDashboard) || {
    stats: { activeLoads: 2, completedToday: 1, earnings: 350000, rating: 4.7 },
    activeDeliveries: [
      { id: 'TR-201', from: 'Iringa Market', to: 'Dar es Salaam', cargo: 'Maize — 2 tons', status: 'In Transit', eta: '3 hrs', vehicle: 'T123 ABC' },
      { id: 'TR-202', from: 'Morogoro Farm', to: 'Arusha', cargo: 'Beans — 500kg', status: 'Loading', eta: '5 hrs', vehicle: 'T456 DEF' },
    ],
  };

  const deliveries = (stored && stored.deliveries) || [
    { id: 'TR-201', from: 'Iringa', to: 'Dar es Salaam', cargo: 'Maize 2t', status: 'in-transit', eta: '3 hrs', client: 'Grace Mwamba', fee: 180000 },
    { id: 'TR-202', from: 'Morogoro', to: 'Arusha', cargo: 'Beans 500kg', status: 'loading', eta: '5 hrs', client: 'Silk Road Processors', fee: 95000 },
    { id: 'TR-203', from: 'Mbeya', to: 'Dodoma', cargo: 'Rice 1.5t', status: 'delivered', eta: '—', client: 'Ministry Store', fee: 120000 },
  ];

  const fleet = (stored && stored.fleet) || [
    { id: 'T123 ABC', type: 'Isuzu NPR', capacity: '3 tons', status: 'On Route', driver: 'Joseph Malima', fuel: '67%', lastService: '2025-04-10' },
    { id: 'T456 DEF', type: 'Mitsubishi Canter', capacity: '2 tons', status: 'Available', driver: 'Ramadhani Juma', fuel: '92%', lastService: '2025-05-01' },
    { id: 'T789 GHI', type: 'Toyota Dyna', capacity: '1.5 tons', status: 'Maintenance', driver: '—', fuel: '45%', lastService: '2025-05-18' },
  ];

  // ==========================================
  //  AI DATA
  // ==========================================
  const aiAssistant = (stored && stored.aiAssistant) || {
    recentQueries: [
      { q: 'Why are my maize leaves turning yellow?', a: 'Yellow leaves in maize during tasseling can indicate nitrogen deficiency. Apply urea (46% N) at 50kg/ha as side dressing.', icon: 'agriculture' },
      { q: 'Best planting time for beans in Iringa?', a: 'In Iringa, plant beans (Lyamungu 90) between February-March for the long rains, or September-October for short rains.', icon: 'schedule' },
    ],
    capabilities: ['Crop Diagnosis', 'Weather Prediction', 'Soil Analysis', 'Pest Identification', 'Market Prices', 'Irrigation Scheduling'],
  };

  const cropDiagnosis = (stored && stored.cropDiagnosis) || {
    disease: 'Northern Leaf Blight',
    confidence: 94,
    severity: 'Moderate',
    treatment: 'Apply Mancozeb at 30g/15L spray. Remove affected leaves. Ensure proper plant spacing for air circulation.',
    prevention: 'Use resistant varieties like Katumani. Rotate with legumes. Avoid overhead irrigation.',
  };

  // e-Kilimo & East African Agriculture AI dataset for self-learning / dynamic lookup
  const cropDiagnoses = (stored && stored.cropDiagnoses) || [
    {
      crop: 'Maize',
      disease: 'Maize Lethal Necrosis Disease (MLND)',
      confidence: 96,
      severity: 'Severe',
      treatment: 'Immediately uproot and burn infected crops. Keep the field weed-free to control vector transmission.',
      prevention: 'Plant MLND-tolerant varieties (e.g. TAN 250, Katumani). Practice crop rotation with non-cereal crops (beans, sweet potatoes) for at least 2 seasons.',
      info: 'A major viral disease affecting maize crops in East Africa, first reported in Kenya and now widely active in the Lake and Northern zones of Tanzania.'
    },
    {
      crop: 'Maize',
      disease: 'Northern Leaf Blight (Koga la Majani)',
      confidence: 94,
      severity: 'Moderate',
      treatment: 'Apply Mancozeb at 30g/15L spray. Remove affected lower leaves. Ensure proper plant spacing for air circulation.',
      prevention: 'Rotate with legumes. Avoid overhead irrigation. Plant certified seeds from Tanseed or ASA.',
      info: 'Fungal leaf disease caused by Exserohilum turcicum, prevalent under high humidity and moderate temperatures in the Southern Highlands of Tanzania.'
    },
    {
      crop: 'Coffee',
      disease: 'Coffee Berry Disease (CBD - Koga la Kahawa)',
      confidence: 98,
      severity: 'Severe',
      treatment: 'Spray copper-based fungicides (e.g. Copper Oxychloride) during early flowering and crop cycles.',
      prevention: 'Prune coffee bushes to allow sunlight penetration and air movement. Plant CBD-resistant varieties like Ruiru 11 or Batian.',
      info: 'Caused by Colletotrichum kahawae, this disease attacks green coffee berries, turning them black and causing major crop losses in Arusha and Kilimanjaro.'
    },
    {
      crop: 'Cassava',
      disease: 'Cassava Mosaic Disease (CMD - Ugonjwa wa Mbatata)',
      confidence: 95,
      severity: 'Severe',
      treatment: 'No chemical cure exists. Immediately destroy infected cassava bushes to prevent whitefly transmission.',
      prevention: 'Always select disease-free cuttings from certified sources like TARI. Use CMD-resistant varieties (e.g., Mkombozi, Kiroba).',
      info: 'A devastating viral disease spread by whiteflies (Bemisia tabaci) and through vegetative propagation, threatening food security along the Tanzanian coast.'
    },
    {
      crop: 'Rice',
      disease: 'Rice Blast (Kutu ya Mpunga)',
      confidence: 91,
      severity: 'Moderate',
      treatment: 'Apply systemic fungicides such as Tricyclazole. Avoid excessive nitrogen fertilizer applications which promote lush susceptible growth.',
      prevention: 'Plant resistant varieties (e.g. SARO 5). Use balanced fertilization and maintain a consistent water level in fields.',
      info: 'A highly destructive fungal disease caused by Pyricularia oryzae, attacking leaves, nodes, and panicles in the swampy fields of Morogoro and Shinyanga.'
    },
    {
      crop: 'Beans',
      disease: 'Bean Rust (Kutu ya Maharage)',
      confidence: 93,
      severity: 'Moderate',
      treatment: 'Apply preventative sulfur-based or chlorothalonil fungicides. Remove crop debris after harvesting.',
      prevention: 'Sow resistant bean varieties (e.g. Lyamungu 90). Implement crop rotation with maize or sorghum.',
      info: 'Fungal infection caused by Uromyces appendiculatus, resulting in rust-colored pustules on leaf surfaces under warm, humid conditions in Mbeya.'
    },
    {
      crop: 'Banana',
      disease: 'Banana Xanthomonas Wilt (BXW)',
      confidence: 97,
      severity: 'Extreme',
      treatment: 'Enforce strict quarantine. Cut the infected pseudostem at ground level and bury the debris. Sterilize tools with fire or chlorine.',
      prevention: 'Remove male buds immediately after the last hands open using a forked stick. Use clean planting suckers or tissue culture plants.',
      info: 'A bacterial wilt caused by Xanthomonas vasicola pv. musacearum, spreading rapidly via insects and cutting tools, devastating plantations in Kagera and Uganda.'
    }
  ];

  const aiAnalytics = (stored && stored.aiAnalytics) || {
    yieldPrediction: { maize: '8.4 t/ha (+12% vs last season)', beans: '1.8 t/ha (-5% due to aphids)', rice: '5.4 t/ha (+8% irrigation gains)' },
    marketTrends: { maize: { trend: 'up', change: '+8%', price: 'TZS 850/kg' }, beans: { trend: 'up', change: '+15%', price: 'TZS 1,800/kg' }, rice: { trend: 'stable', change: '+2%', price: 'TZS 1,500/kg' } },
  };

  // ==========================================
  //  GIS DATA
  // ==========================================
  const gisData = (stored && stored.gisData) || {
    regions: [
      {
        name: 'Iringa',
        farmers: 3200,
        crops: ['Maize', 'Beans', 'Tomatoes'],
        rainfall: '850mm/yr',
        soil: 'Loam',
        districts: ['Iringa Urban', 'Iringa Rural', 'Kilolo', 'Mufindi', 'Wanging\'ombe'],
        markets: ['Kihesa Market', 'Mlandege Soko', 'Ipogolo Agri-Hub', 'Gangilonga Street', 'Mashujaa Square']
      },
      {
        name: 'Morogoro',
        farmers: 4100,
        crops: ['Rice', 'Sugarcane', 'Maize'],
        rainfall: '1200mm/yr',
        soil: 'Clay Loam',
        districts: ['Morogoro Urban', 'Kilosa', 'Mvomero', 'Ulanga', 'Gairo'],
        markets: ['Sabasaba Market', 'Msamvu Terminal Hub', 'Kihonda Agro-depot', 'Sabuni Road', 'SUA Main Gate']
      },
      {
        name: 'Mbeya',
        farmers: 2800,
        crops: ['Coffee', 'Pyrethrum', 'Beans'],
        rainfall: '1000mm/yr',
        soil: 'Volcanic Loam',
        districts: ['Mbeya City', 'Mbarali', 'Chunya', 'Rungwe', 'Kyela'],
        markets: ['Mwanjelwa Market', 'Soweto Market', 'Uyole Junction', 'Sisimba Street', 'Mbalizi Central Soko']
      },
      {
        name: 'Dodoma',
        farmers: 1900,
        crops: ['Sorghum', 'Sunflower', 'Groundnuts'],
        rainfall: '600mm/yr',
        soil: 'Sandy Loam',
        districts: ['Dodoma Municipal', 'Bahi', 'Chamwino', 'Mpwapwa', 'Kondoa'],
        markets: ['Majengo Central Market', 'Kikuyu Street', 'Chamwino Gov Center', 'Makole Road', 'Mtumba Agri-complex']
      },
      {
        name: 'Arusha',
        farmers: 3500,
        crops: ['Coffee', 'Wheat', 'Horticulture'],
        rainfall: '900mm/yr',
        soil: 'Volcanic',
        districts: ['Arusha City', 'Meru', 'Karatu', 'Monduli', 'Ngorongoro'],
        markets: ['Kilombero Market', 'Njiro Commercial Block', 'Sakina Soko', 'Usa River Junction', 'Sanawari Road']
      },
      {
        name: 'Dar es Salaam',
        farmers: 1200,
        crops: ['Cassava', 'Vegetables', 'Coconut'],
        rainfall: '1100mm/yr',
        soil: 'Sandy',
        districts: ['Ilala', 'Kinondoni', 'Temeke', 'Kigamboni', 'Ubungo'],
        markets: ['Kariakoo Market (East Africa\'s Largest)', 'Tandika Soko', 'Mbezi Luis Terminal', 'Mwenge Handcraft Market', 'Kigamboni Ferry Street']
      }
    ],
    countries: [
      { name: 'Tanzania', code: 'TZ', capital: 'Dodoma', majorMarkets: ['Kariakoo', 'Mwanjelwa', 'Sabasaba', 'Kihesa'] },
      { name: 'Kenya', code: 'KE', capital: 'Nairobi', majorMarkets: ['Wakulima Market', 'Marikiti', 'Gikomba', 'Kongowea'] },
      { name: 'Uganda', code: 'UG', capital: 'Kampala', majorMarkets: ['Nakasero Market', 'Owino Market', 'Kalerwe', 'Wandegeya'] },
      { name: 'Rwanda', code: 'RW', capital: 'Kigali', majorMarkets: ['Kimironko Market', 'Nyabugogo', 'Nyamirambo'] },
      { name: 'Burundi', code: 'BI', capital: 'Gitega', majorMarkets: ['Siyoni Market', 'Bujumbura Central'] }
    ],
    bounds: { north: -0.5, south: -11.5, east: 40.5, west: 29.0 },
  };

  // ==========================================
  //  COMMUNITY DATA
  // ==========================================
  const communityHub = (stored && stored.communityHub) || {
    stats: { members: 50234, groups: 128, discussions: 4521, events: 24 },
    trendingTopics: [
      { title: 'Best drought-resistant maize varieties for 2025', replies: 89, category: 'Crops' },
      { title: 'Iringa farmers cooperative meeting — June 5', replies: 34, category: 'Events' },
      { title: 'New TZS 5B government subsidy program', replies: 156, category: 'Policy' },
    ],
  };

  const groups = (stored && stored.groups) || [
    { id: 1, name: 'Iringa Maize Growers', members: 245, type: 'Cooperative', description: 'Collective marketing and input procurement for maize farmers in Iringa region', funds: 12500000, verified: true },
    { id: 2, name: 'Women in Agriculture TZ', members: 180, type: 'Support Group', description: 'Empowering women farmers across Tanzania with training and micro-loans', funds: 4500000, verified: true },
    { id: 3, name: 'Morogoro Rice Association', members: 320, type: 'Industry Body', description: 'Quality standards and market access for rice producers', funds: 28000000, verified: true },
    { id: 4, name: 'Youth AgriTech Hub', members: 95, type: 'Innovation', description: 'Young agripreneurs leveraging technology for sustainable farming', funds: 1200000, verified: false },
    { id: 5, name: 'Tanzania Organic Network', members: 156, type: 'Certification', description: 'Organic certification support and market linkages', funds: 8000000, verified: true },
  ];

  const chatMessages = (stored && stored.chatMessages) || {
    'default': [
      { id: 1, sender: 'Neema Mwangi', text: 'Habari za asubuhi! Has anyone tried the new drought-resistant seed variety?', time: '08:15', avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=40&h=40&fit=crop&crop=face' },
      { id: 2, sender: 'Juma Hassan', text: 'Mambo Neema! Yes, I planted TAN 250 last season. Good yield even with low rain.', time: '08:22', avatar: 'https://ui-avatars.com/api/?name=JH&background=3d2b1f&color=fff&size=40' },
      { id: 3, sender: 'Grace Mwamba', text: 'We are buying at TZS 850/kg for Grade A maize. DM me for details.', time: '09:01', avatar: 'https://ui-avatars.com/api/?name=GM&background=a03f29&color=fff&size=40' },
    ],
  };

  // ==========================================
  //  ADMIN DATA
  // ==========================================
  const adminDashboard = (stored && stored.adminDashboard) || {
    platformStats: { totalUsers: 50234, activeFarmers: 28450, totalTransactions: 'TZS 2.4B', uptime: '99.97%' },
    systemHealth: { apiLatency: '45ms', dbSize: '2.3 GB', storageUsed: '67%', activeConnections: 1240 },
    recentAlerts: [
      { type: 'warning', text: 'Unusual login pattern detected from Mwanza region', time: '10 min ago' },
      { type: 'info', text: 'AI model v3.2 deployed successfully', time: '1 hr ago' },
      { type: 'error', text: 'Payment gateway timeout — 3 failed transactions', time: '2 hrs ago' },
    ],
  };

  // ==========================================
  //  EXPERT DATA
  // ==========================================
  const expertDashboard = (stored && stored.expertDashboard) || {
    stats: { consultations: 142, rating: 4.9, earnings: 850000, pendingBookings: 5 },
    upcomingAppointments: [
      { id: 1, farmer: 'Peter Mlowe', topic: 'Cotton pest management', date: '2025-05-21', time: '10:00 AM', fee: 50000 },
      { id: 2, farmer: 'Fatma Abdallah', topic: 'Soil pH correction', date: '2025-05-21', time: '2:00 PM', fee: 50000 },
    ],
  };

  const bookings = (stored && stored.bookings) || [
    { id: 1, farmer: 'Peter Mlowe', topic: 'Cotton pest management', date: '2025-05-21', time: '10:00 AM', status: 'confirmed', fee: 50000, mode: 'Video Call' },
    { id: 2, farmer: 'Fatma Abdallah', topic: 'Soil pH correction', date: '2025-05-21', time: '2:00 PM', status: 'pending', fee: 50000, mode: 'In-Person' },
    { id: 3, farmer: 'Neema Mwangi', topic: 'Crop rotation planning', date: '2025-05-22', time: '11:00 AM', status: 'confirmed', fee: 50000, mode: 'Chat' },
  ];

  // ==========================================
  //  GOVERNMENT DATA
  // ==========================================
  const governmentDashboard = (stored && stored.governmentDashboard) || {
    nationalStats: { gdpContribution: '26.4%', employment: '65%', foodSecurity: '78%', exports: 'TZS 1.2T' },
    activePolicies: [
      { name: 'Agricultural Sector Development Programme Phase II', status: 'Active', budget: 'TZS 450B', regions: 'All' },
      { name: 'Tanzania Irrigation Development Plan', status: 'Active', budget: 'TZS 120B', regions: '14 regions' },
      { name: 'National Agricultural Policy 2025', status: 'Draft', budget: 'Pending', regions: 'All' },
    ],
    alerts: [
      { severity: 'high', region: 'Dodoma', message: 'Drought conditions persist — emergency water distribution activated', date: '2025-05-18' },
      { severity: 'medium', region: 'Mwanza', message: 'Fall armyworm outbreak reported — quarantine measures in effect', date: '2025-05-17' },
    ],
  };

  // ==========================================
  //  STUDENT DATA
  // ==========================================
  const studentDashboard = (stored && stored.studentDashboard) || {
    enrolledCourses: 3,
    completedModules: 12,
    certificates: 1,
    gpa: 3.7,
    courses: [
      { id: 1, name: 'Sustainable Agriculture Practices', progress: 75, instructor: 'Dr. Mgata', grade: 'A-' },
      { id: 2, name: 'Digital Farming & IoT', progress: 45, instructor: 'Prof. Mlay', grade: 'In Progress' },
      { id: 3, name: 'Agri-Business Management', progress: 90, instructor: 'Dr. Kessy', grade: 'A' },
    ],
  };

  // ==========================================
  //  PROCESSOR DATA
  // ==========================================
  const processorDashboard = (stored && stored.processorDashboard) || {
    stats: { throughput: '24 tons/day', qualityRate: '96.8%', activeBatches: 8, pendingProcurement: 12 },
    incomingShipments: [
      { id: 'PS-301', from: 'Iringa Farmers Coop', commodity: 'Maize', qty: '5 tons', eta: '2025-05-21', status: 'In Transit' },
      { id: 'PS-302', from: 'Mbeya Rice Association', commodity: 'Rice Paddy', qty: '3 tons', eta: '2025-05-22', status: 'Scheduled' },
    ],
  };

  // ==========================================
  //  NOTIFICATIONS
  // ==========================================
  const notifications = (stored && stored.notifications) || [
    { id: 1, text: 'Maize price increased 8% in Iringa region', time: '10 min ago', read: false, type: 'market', icon: 'trending_up' },
    { id: 2, text: 'Spray diary reminder: Bean field treatment due tomorrow', time: '1 hr ago', read: false, type: 'task', icon: 'event_note' },
    { id: 3, text: 'New message from Grace Mwamba about maize purchase', time: '2 hrs ago', read: true, type: 'social', icon: 'chat' },
    { id: 4, text: 'Loan installment TZS 187,500 due in 5 days', time: '3 hrs ago', read: false, type: 'finance', icon: 'payments' },
    { id: 5, text: 'Iringa Maize Growers meeting this Saturday', time: '5 hrs ago', read: true, type: 'community', icon: 'groups' },
    { id: 6, text: 'Weather alert: Heavy rain expected Thursday', time: '6 hrs ago', read: false, type: 'weather', icon: 'rainy' },
    { id: 7, text: 'Jicho AI: New crop diagnosis available', time: '1 day ago', read: true, type: 'ai', icon: 'psychology' },
  ];

  // ==========================================
  //  SETTINGS
  // ==========================================
  const settings = (stored && stored.settings) || {
    language: 'en',
    currency: 'TZS',
    notifications: { push: true, email: true, sms: false, price: true, weather: true, community: true },
    privacy: { profileVisible: true, locationShared: false, analyticsOptIn: true },
    display: { compactMode: false, fontSize: 'medium', animationsEnabled: true },
    connectivity: { offlineMode: false, dataSaver: false, autoSync: true },
  };

  const jichoHistory = (stored && stored.jichoHistory) || [];
  const researchCatalog = (stored && stored.researchCatalog) || [];
  const moduleLearning = (stored && stored.moduleLearning) || null;
  const crossRoleInbox = (stored && stored.crossRoleInbox) || [];
  const interRoleLinks = (stored && stored.interRoleLinks) || {};
  const trainingLog = (stored && stored.trainingLog) || [];
  const streetMap = (stored && stored.streetMap) || {};
  const marketData = (stored && stored.marketData) || {};
  const supplyChain = (stored && stored.supplyChain) || {};
  const livestockSupply = (stored && stored.livestockSupply) || [];
  const marketTrends = (stored && stored.marketTrends) || {};
  const impactMetrics = (stored && stored.impactMetrics) || {};

  function save() {
    try {
      localStorage.setItem('agri-nest-db', JSON.stringify({
        users, farmerDashboard, digitalFarm, crops, sprayDiary, livestock,
        sokoListings, buyerDashboard, orders,
        financeHub, loans, approvalQueue, lenderDashboard,
        transporterDashboard, deliveries, fleet,
        aiAssistant, cropDiagnosis, cropDiagnoses, aiAnalytics,
        gisData,
        communityHub, groups, chatMessages,
        adminDashboard,
        expertDashboard, bookings,
        governmentDashboard,
        studentDashboard,
        processorDashboard,
        notifications,
        settings,
        jichoHistory,
        globalActivityFeed,
        researchCatalog,
        moduleLearning,
        crossRoleInbox,
        interRoleLinks,
        trainingLog,
        streetMap,
        marketData,
        supplyChain,
        livestockSupply,
        marketTrends,
        impactMetrics,
      }));
    } catch (e) {
      console.error('Failed to sync DB with localStorage:', e);
    }
  }

  // ==========================================
  //  GLOBAL REALTIME ACTIVITY FEED
  //  Shared across all roles; admin reads this
  // ==========================================
  const globalActivityFeed = (stored && stored.globalActivityFeed) || [
    { id: 1, type: 'field_add', userId: 1, userName: 'Neema Mwangi', role: 'farmer', message: 'Added new field: Kilimo Cha Mahindi (3.5 ha) in Iringa', timestamp: new Date(Date.now() - 3600000).toISOString(), icon: 'grass', color: 'text-primary' },
    { id: 2, type: 'spray_log', userId: 1, userName: 'Neema Mwangi', role: 'farmer', message: 'Logged spray: Lambda-Cyhalothrin on Maharage (Beans)', timestamp: new Date(Date.now() - 7200000).toISOString(), icon: 'science', color: 'text-secondary' },
    { id: 3, type: 'jicho_scan', userId: 2, userName: 'Juma Hassan', role: 'farmer', message: 'Jicho AI scan: Maize — Northern Leaf Blight detected (87% confidence)', timestamp: new Date(Date.now() - 10800000).toISOString(), icon: 'biotech', color: 'text-error' },
    { id: 4, type: 'loan_apply', userId: 1, userName: 'Neema Mwangi', role: 'farmer', message: 'Loan application submitted: TZS 2,500,000 for Seasonal Inputs', timestamp: new Date(Date.now() - 86400000).toISOString(), icon: 'payments', color: 'text-tertiary' },
    { id: 5, type: 'gps_track', userId: 12, userName: 'Peter Mlowe', role: 'farmer', message: 'GPS field boundary drawn: Pamba (Cotton) — 2.0 ha digitized', timestamp: new Date(Date.now() - 172800000).toISOString(), icon: 'location_on', color: 'text-primary' },
  ];

  // Activity feed subscribers (in-memory, cleared on reload)
  const _activitySubscribers = [];

  function addActivity(activity) {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...activity
    };
    globalActivityFeed.unshift(entry);
    // Trim to last 200 activities
    if (globalActivityFeed.length > 200) globalActivityFeed.splice(200);
    // Notify subscribers
    _activitySubscribers.forEach(cb => { try { cb(entry); } catch(e) {} });
    save();
    return entry;
  }

  function subscribeActivity(cb) {
    _activitySubscribers.push(cb);
    return () => {
      const idx = _activitySubscribers.indexOf(cb);
      if (idx !== -1) _activitySubscribers.splice(idx, 1);
    };
  }

  return {
    users, farmerDashboard, digitalFarm, crops, sprayDiary, livestock,
    sokoListings, buyerDashboard, orders,
    financeHub, loans, approvalQueue, lenderDashboard,
    transporterDashboard, deliveries, fleet,
    aiAssistant, cropDiagnosis, cropDiagnoses, aiAnalytics,
    gisData,
    communityHub, groups, chatMessages,
    adminDashboard,
    expertDashboard, bookings,
    governmentDashboard,
    studentDashboard,
    processorDashboard,
    notifications,
    settings,
    jichoHistory,
    globalActivityFeed,
    researchCatalog,
    moduleLearning,
    crossRoleInbox,
    interRoleLinks,
    trainingLog,
    streetMap,
    marketData,
    supplyChain,
    livestockSupply,
    marketTrends,
    impactMetrics,
    addActivity,
    subscribeActivity,
    save,
  };
})();
