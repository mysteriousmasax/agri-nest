/**
 * AGRI-NEST Floating AI Assistant Widget
 * Provides voice/text chat assistance, intent routing, and local learning.
 */

const AIWidget = (function () {
  const STORAGE_KEY = 'agri-nest-ai-widget-history';
  const LEARNING_KEY = 'agri-nest-ai-widget-learning';
  const MAX_HISTORY = 40;
  let history = [];
  let learningHistory = [];
  let recognition = null;
  let listening = false;

  function getRoot() {
    return document.getElementById('ai-assistant-widget-root');
  }

  function ensureRoot() {
    let root = getRoot();
    if (!root) {
      console.warn('AIWidget: missing #ai-assistant-widget-root, creating fallback mount point.');
      root = document.createElement('div');
      root.id = 'ai-assistant-widget-root';
      document.body.appendChild(root);
    }
    return root;
  }

  function createWidget() {
    const root = ensureRoot();
    if (!root) return;
    if (root.querySelector('.ai-widget-trigger')) return;

    root.innerHTML = `
      <button id="ai-widget-open" class="ai-widget-trigger" aria-label="Open AI Assistant">
        <span class="material-symbols-outlined" style="font-size:1.5rem;">smart_toy</span>
      </button>
      <section id="ai-widget-panel" class="ai-widget-panel" aria-live="polite" aria-label="AI assistant chat">
        <header>
          <div>
            <h2>AGRI-NEST AI Assistant</h2>
            <p>Ask anything about agriculture, prices or next steps.</p>
          </div>
          <button id="ai-widget-close" class="ai-widget-button" type="button" aria-label="Close AI Assistant">
            <span class="material-symbols-outlined">close</span>
          </button>
        </header>
        <div id="ai-widget-body" class="ai-widget-body">
          <div id="ai-widget-messages" class="ai-widget-messages" role="log" aria-live="polite"></div>
          <div id="ai-widget-suggestions" class="ai-widget-suggestions"></div>
          <div id="ai-widget-hint" class="ai-widget-hint">Try: "What is the market price in Dar es Salaam?" or "Show me Soko Marketplace."</div>
        </div>
        <div class="ai-widget-actions">
          <input id="ai-widget-input" class="ai-widget-input" type="text" placeholder="Type your question or tap the microphone" aria-label="AI assistant input" autocomplete="off" />
          <button id="ai-widget-voice" class="ai-widget-button" type="button" aria-label="Use voice input">
            <span class="material-symbols-outlined">keyboard_voice</span>
          </button>
          <button id="ai-widget-send" class="ai-widget-button" type="button">Send</button>
        </div>
      </section>
    `;

    document.getElementById('ai-widget-open')?.addEventListener('click', openWidget);
    document.getElementById('ai-widget-close')?.addEventListener('click', closeWidget);
    document.getElementById('ai-widget-send')?.addEventListener('click', handleSend);
    document.getElementById('ai-widget-input')?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    });
    document.getElementById('ai-widget-voice')?.addEventListener('click', toggleVoice);

    renderHistory();
    initSpeechRecognition();
  }

  function initSpeechRecognition() {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return;
    recognition = new Speech();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      if (transcript) {
        const input = document.getElementById('ai-widget-input');
        if (input) {
          input.value = transcript;
          sendQuery(transcript);
        }
      }
      listening = false;
      updateVoiceButton();
    };

    recognition.onend = () => {
      listening = false;
      updateVoiceButton();
    };

    recognition.onerror = () => {
      listening = false;
      updateVoiceButton();
      Shell.toast('Voice recognition not available in this browser.', 'error');
    };
  }

  function updateVoiceButton() {
    const button = document.getElementById('ai-widget-voice');
    if (!button) return;
    button.innerHTML = listening
      ? '<span class="material-symbols-outlined">mic</span>'
      : '<span class="material-symbols-outlined">keyboard_voice</span>';
    button.style.background = listening ? '#1ea45d' : '#0f5132';
  }

  function detectVoiceLanguage() {
    const lang = document.documentElement.lang || 'en';
    const swahiliWords = ['habari', 'soko', 'bei', 'kilimo', 'mazao', 'sabuni', 'mavuno', 'madini', 'mifugo', 'maji'];
    const input = document.getElementById('ai-widget-input');
    const text = (input?.value || '').toLowerCase();
    const hasSw = swahiliWords.some((word) => text.includes(word));
    if (hasSw || lang.startsWith('sw')) return 'sw-TZ';
    return 'en-US';
  }

  function toggleVoice() {
    if (!recognition) {
      Shell.toast('Voice input is not supported on this browser.', 'error');
      return;
    }
    if (listening) {
      recognition.stop();
      listening = false;
      updateVoiceButton();
      return;
    }
    try {
      recognition.lang = detectVoiceLanguage();
      recognition.start();
      listening = true;
      updateVoiceButton();
      Shell.toast(`Listening (${recognition.lang})...`, 'info');
    } catch (error) {
      listening = false;
      updateVoiceButton();
      console.error('[AIWidget] Voice start failed:', error);
      Shell.toast('Unable to start voice recognition.', 'error');
    }
  }

  function openWidget() {
    const panel = document.getElementById('ai-widget-panel');
    if (!panel) return;
    panel.classList.add('open');
    document.getElementById('ai-widget-open')?.setAttribute('aria-expanded', 'true');
    const input = document.getElementById('ai-widget-input');
    if (input) input.focus();
  }

  function closeWidget() {
    const panel = document.getElementById('ai-widget-panel');
    if (!panel) return;
    panel.classList.remove('open');
    document.getElementById('ai-widget-open')?.setAttribute('aria-expanded', 'false');
  }

  function handleSend() {
    const input = document.getElementById('ai-widget-input');
    const query = input?.value?.trim();
    if (!query) return;
    input.value = '';
    sendQuery(query);
  }

  function loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function saveHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
  }

  function loadLearningHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(LEARNING_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function saveLearningHistory() {
    localStorage.setItem(LEARNING_KEY, JSON.stringify(learningHistory.slice(0, MAX_HISTORY)));
  }

  function renderHistory() {
    history = loadHistory();
    const list = document.getElementById('ai-widget-messages');
    if (!list) return;
    const entries = history.slice(-18);
    list.innerHTML = entries.length
      ? entries.map((entry) => `
          <div class="ai-widget-message ${entry.role}">
            ${escapeHtml(entry.text)}
          </div>
        `).join('')
      : `
          <div class="ai-widget-message assistant">
            Hello! I am AGRI-NEST AI. Ask me about market prices, crops, logistics, or where to access modules.
          </div>
        `;
    list.scrollTop = list.scrollHeight;
  }

  function appendMessage(role, text) {
    const list = document.getElementById('ai-widget-messages');
    if (!list) return;
    const message = document.createElement('div');
    message.className = `ai-widget-message ${role}`;
    message.textContent = text;
    list.appendChild(message);
    list.scrollTop = list.scrollHeight;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderSuggestions(answer) {
    const suggestionContainer = document.getElementById('ai-widget-suggestions');
    if (!suggestionContainer) return;
    suggestionContainer.innerHTML = '';

    const items = [...(answer.suggestions || [])];
    if (answer.route && answer.routeLabel && !items.some((item) => item.route === answer.route)) {
      items.unshift({ label: answer.routeLabel, route: answer.route, primary: true });
    }

    if (!items.length) {
      suggestionContainer.innerHTML = '<div class="ai-widget-hint">Need help? Try asking about price, crop health, logistics, or finance.</div>';
      return;
    }

    items.slice(0, 4).forEach((item) => {
      const suggestion = document.createElement('button');
      suggestion.className = 'ai-widget-suggestion';
      suggestion.type = 'button';
      suggestion.textContent = item.label;
      suggestion.addEventListener('click', () => {
        if (item.route) {
          Router.navigate(item.route);
          closeWidget();
        } else if (item.query) {
          const input = document.getElementById('ai-widget-input');
          if (input) {
            input.value = item.query;
            input.focus();
          }
        }
      });
      suggestionContainer.appendChild(suggestion);
    });
  }

  function sendQuery(query) {
    if (!query) return;
    appendMessage('user', query);
    history.push({ id: Date.now(), role: 'user', text: query });
    history = history.slice(-MAX_HISTORY);
    saveHistory();

    const answer = generateAnswer(query);
    appendMessage('assistant', answer.text);
    history.push({ id: Date.now() + 1, role: 'assistant', text: answer.text });
    history = history.slice(-MAX_HISTORY);
    saveHistory();
    updateLearning(query, answer.text, answer.route);
    renderSuggestions(answer);

    if (answer.autoNavigate && answer.route) {
      Router.navigate(answer.route);
      closeWidget();
    }
  }

  function updateLearning(query, answer, route) {
    const stored = loadLearningHistory();
    const entry = {
      id: Date.now(),
      query,
      answer,
      route: route || null,
      createdAt: new Date().toISOString(),
    };
    learningHistory = [entry, ...stored].slice(0, MAX_HISTORY);
    saveLearningHistory();

    DB.aiAssistant = DB.aiAssistant || { recentQueries: [], capabilities: [] };
    DB.aiAssistant.recentQueries = learningHistory.slice(0, 12).map((item) => ({
      q: item.query,
      a: item.answer,
      icon: 'smart_toy',
    }));
    const learned = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 4)
      .slice(0, 12);
    DB.aiAssistant.capabilities = [...new Set([...(DB.aiAssistant.capabilities || []), ...learned, 'context routing', 'agriculture advice', 'market navigation'])].slice(0, 40);
    DB.aiAssistant.lastUpdated = new Date().toISOString();
    if (typeof DB.save === 'function') {
      DB.save();
    }

    window.setTimeout(runBackgroundLearning, 1000);
  }

  function runBackgroundLearning() {
    if (typeof AILearningEngine === 'undefined') return;
    const modules = AILearningEngine.getModuleStatus?.() || [];
    if (!modules.length) return;
    DB.aiAssistant = DB.aiAssistant || { capabilities: [], recentQueries: [] };
    DB.aiAssistant.capabilities = [...new Set([...(DB.aiAssistant.capabilities || []), 'self-learning', 'open source models', 'agri inference'])].slice(0, 48);
    DB.aiAssistant.lastBackgroundUpdate = new Date().toISOString();
    if (typeof DB.save === 'function') DB.save();
  }

  function generateAnswer(query) {
    const lower = query.trim().toLowerCase();
    const marketPriceDar = /market price.*dar es salaam|price.*dar es salaam|dar es salaam.*market price|dar.*market price/.test(lower);
    const directMarket = /market|soko|price|sell|buy/.test(lower);
    const diagnosis = /crop|disease|pest|blight|infection|weed|treat|spray/.test(lower);
    const finance = /loan|finance|credit|interest|disburse|lender/.test(lower);
    const gis = /map|ramani|gis|location|route|boundary|track/.test(lower);
    const community = /community|group|chat|news|events/.test(lower);
    const agriculture = /farm|field|soil|irrigation|fertilizer|seed|harvest|yield|crop|animal|livestock/.test(lower);
    const marketplaceRoute = '/marketplace/soko';

    if (marketPriceDar) {
      const listing = (DB.marketData?.Maize?.priceTZS || DB.sokoListings?.[0]?.price || 850);
      return {
        text: `In Dar es Salaam the current marketplace reference is around TZS ${listing}/kg for staple produce. I can open Soko Marketplace so you can see live listings for buyers and sellers.`,
        route: marketplaceRoute,
        routeLabel: 'Open Soko Marketplace',
        suggestions: [
          { label: 'Open Dar es Salaam listings', route: marketplaceRoute },
          { label: 'Ask about transport options', query: 'How can I transport produce to Dar es Salaam market?' },
        ],
      };
    }

    if (directMarket && lower.includes('dar') && lower.includes('price')) {
      return {
        text: 'The Soko Marketplace is your best destination for Dar es Salaam market price intelligence. I can take you there.',
        route: marketplaceRoute,
        routeLabel: 'Go to Soko Marketplace',
        suggestions: [
          { label: 'Check maize price trends', query: 'Show me maize price trends in Tanzania' },
          { label: 'Open Soko Marketplace', route: marketplaceRoute },
        ],
      };
    }

    if (diagnosis) {
      return {
        text: 'I found crop diagnosis tools and recommendations in the agronomy module. Open it to scan crop health, pests, and treatment advice.',
        route: '/ai/diagnosis',
        routeLabel: 'Open Crop Diagnosis',
        suggestions: [
          { label: 'Review pest control guidance', query: 'How do I treat armyworm on maize?' },
          { label: 'Open crop health tools', route: '/ai/diagnosis' },
        ],
      };
    }

    if (finance) {
      return {
        text: 'For finance and loan help, go to the finance hub to review credit offers, risk scores, and approvals.',
        route: '/finance/hub',
        routeLabel: 'Open Finance Hub',
        suggestions: [
          { label: 'Open Finance Hub', route: '/finance/hub' },
          { label: 'Ask about farm credit', query: 'How can I get an input loan for my farm?' },
        ],
      };
    }

    if (gis) {
      return {
        text: 'The GIS module can show you routes, field boundaries, and location-based analytics in Ramani.',
        route: '/gis/maps',
        routeLabel: 'Open Ramani GIS',
        suggestions: [
          { label: 'Open Ramani GIS', route: '/gis/maps' },
          { label: 'Ask about field boundaries', query: 'How do I map my field boundaries?' },
        ],
      };
    }

    if (community) {
      return {
        text: 'You can connect with the community hub and chat groups for local market information and shared farming tips.',
        route: '/community/hub',
        routeLabel: 'Open Community Hub',
        suggestions: [
          { label: 'Open Community Hub', route: '/community/hub' },
          { label: 'Ask about local market groups', query: 'Where can I join a farmer community group?' },
        ],
      };
    }

    if (agriculture) {
      const sample = DB.aiAssistant?.capabilities?.slice(0, 6) || ['market guidance', 'crop advice', 'logistics routing'];
      return {
        text: `I can help with agriculture questions on ${sample.join(', ')}. I also have a dedicated assistant page for deeper help.`,
        route: '/ai/assistant',
        routeLabel: 'Open AI Assistant',
        suggestions: [
          { label: 'Open the AI Assistant', route: '/ai/assistant' },
          { label: 'Ask about fertilizer', query: 'What fertilizer should I use for maize in Tanzania?' },
          { label: 'View Soko Marketplace', route: marketplaceRoute },
        ],
      };
    }

    return {
      text: 'I am the AGRI-NEST intelligence assistant. Ask about Tanzanian agriculture, market prices, farms, or where to find tools in the app.',
      route: '/ai/assistant',
      routeLabel: 'Open AI Assistant',
      suggestions: [
        { label: 'Open AI Assistant', route: '/ai/assistant' },
        { label: 'Check live market prices', route: marketplaceRoute },
        { label: 'Scan crop health', route: '/ai/diagnosis' },
      ],
    };
  }

  function init() {
    createWidget();
    runBackgroundLearning();
    if (!document.getElementById('ai-assistant-widget-root')) {
      console.error('AIWidget.init: failed to mount widget root. The widget will still attempt to render in a fallback container.');
    }
    document.addEventListener('click', (event) => {
      const panel = document.getElementById('ai-widget-panel');
      const trigger = document.getElementById('ai-widget-open');
      if (!panel || !trigger) return;
      if (panel.contains(event.target) || trigger.contains(event.target)) return;
      panel.classList.remove('open');
    });
  }

  return {
    init,
    open: openWidget,
    close: closeWidget,
  };
})();
