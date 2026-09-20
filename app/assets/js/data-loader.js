// assets/js/data-loader.js
// Load East African operational + research datasets; train all modules; wire ecosystem
(function () {
  if (!window.DB) {
    document.addEventListener('DBReady', initLoad);
    return;
  }
  initLoad();

  function initLoad() {
    Promise.all([
      fetch('assets/data/east_africa_datasets.json').then((r) => (r.ok ? r.json() : {})),
      fetch('assets/data/east_africa_research_datasets.json').then((r) => (r.ok ? r.json() : {})),
    ])
      .then(([operational, research]) => {
        mergeOperational(operational);
        DB.researchCatalog = research.catalog || [];
        DB.save();

        if (typeof EcosystemEngine !== 'undefined') {
          EcosystemEngine.init();
          EcosystemEngine.notifyDroughtFromResearch(research);
        }

        if (typeof AILearningEngine !== 'undefined') {
          const result = AILearningEngine.trainAllModules(research);
          console.log('[DataLoader] Full module training:', result.summary?.note);
        } else if (DB.trainAIFromEastAfricaDataset) {
          DB.trainAIFromEastAfricaDataset();
        }

        document.dispatchEvent(new CustomEvent('AgriNestDataReady', { detail: { operational, research } }));
        console.log('[DataLoader] Operational + research datasets loaded');
      })
      .catch((err) => console.error('[DataLoader] Error:', err));
  }

  function mergeOperational(data) {
    DB.streetMap = data.nationStreets || DB.streetMap || {};
    DB.marketData = { ...(DB.marketData || {}), ...(data.ekilimoMarket || {}) };
    DB.supplyChain = { ...(DB.supplyChain || {}), ...(data.supplyChain || {}) };
    DB.livestockSupply = data.livestockSupply || DB.livestockSupply || [];
    DB.marketTrends = { ...(DB.marketTrends || {}), ...(data.marketTrends || {}) };
    DB.impactMetrics = data.impactMetrics || DB.impactMetrics || {};

    DB.getStreetsByNation = (nation) => DB.streetMap[nation] || [];
    DB.getMarketInfo = (crop) => DB.marketData[crop] || null;
    DB.getSupplyChainForCrop = (crop) => DB.supplyChain[crop] || [];
    DB.getLivestockMarketInfo = (type) => (DB.livestockSupply || []).find((i) => i.type === type) || null;
    DB.getSupplyChainSummary = () => ({
      markets: Object.keys(DB.marketData || {}).length,
      cropChains: Object.keys(DB.supplyChain || {}).length,
      livestockRoutes: (DB.livestockSupply || []).length,
    });

    DB.addTrainingLog = function (entry) {
      DB.trainingLog = [entry, ...(DB.trainingLog || [])].slice(0, 30);
      DB.save();
    };

    DB.trainAIFromEastAfricaDataset = function () {
      const marketsCount = Object.keys(DB.marketData || {}).length;
      const cropsTrained = Object.keys(DB.supplyChain || {}).length;
      const livestockNodes = (DB.livestockSupply || []).length;
      DB.aiAssistant = DB.aiAssistant || { recentQueries: [], capabilities: [] };
      DB.aiAnalytics = DB.aiAnalytics || { yieldPrediction: {}, marketTrends: {}, supplyChainHealth: {} };
      DB.aiAssistant.capabilities = [...new Set([
        ...(DB.aiAssistant.capabilities || []),
        'Supply Chain Forecasting',
        'Livestock Market Intelligence',
        'East Africa Crop Analytics',
      ])];
      DB.aiAnalytics.marketTrends = { ...(DB.aiAnalytics.marketTrends || {}), ...(DB.marketTrends || {}) };
      DB.aiAnalytics.supplyChainHealth = {
        summary: `${cropsTrained} crop supply chains and ${livestockNodes} livestock routes.`,
        markets: marketsCount,
        livestockNodes,
      };
      const summary = {
        id: `train-${Date.now()}`,
        date: new Date().toISOString(),
        source: 'East Africa Operational Dataset',
        marketsCount,
        cropsTrained,
        livestockNodes,
        note: `Operational ingest: ${marketsCount} markets, ${cropsTrained} chains.`,
      };
      DB.addTrainingLog(summary);
      DB.save();
      return summary;
    };
  }
})();
