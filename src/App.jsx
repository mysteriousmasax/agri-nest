import { useState } from 'react';

const suggestions = [
  'What is the market price in Dar es Salaam?',
  'Show me maize farms near Arusha',
  'How do I store tomatoes safely?',
];

const initialMessages = [
  {
    sender: 'assistant',
    text: 'Hello, I am your AGRI-NEST advisor. Tap the AI button if you need quick farm, weather, or market guidance.',
  },
];

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('AI model ready. Use the floating button for quick help.');

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter both email and password.');
      return;
    }

    const normalizedEmail = email.trim();
    const displayName = normalizedEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'AGRI-NEST User';
    setUser({ email: normalizedEmail, name: displayName });
    setLoginError('');
    setAssistantOpen(false);
  };

  const handleToggleRegister = () => {
    setIsRegistering((current) => !current);
    setLoginError('');
  };

  const handleSend = async () => {
    const userText = query.trim();
    if (!userText) return;

    setMessages((current) => [...current, { sender: 'user', text: userText }]);
    setQuery('');
    setLoading(true);
    setStatus('Sending your question to the Agri-NEST AI assistant...');

    if (!window.Electron?.aiQuery) {
      setMessages((current) => [
        ...current,
        {
          sender: 'assistant',
          text: 'AI integration is not available in this build. Please restart the desktop app and make sure the Electron bridge is enabled.',
        },
      ]);
      setLoading(false);
      setStatus('AI not available. Check the desktop app configuration.');
      return;
    }

    try {
      const response = await window.Electron.aiQuery(userText);
      if (response.error) {
        throw new Error(response.error);
      }

      setMessages((current) => [...current, { sender: 'assistant', text: response.answer }]);
      setStatus('Answered by Agri-NEST AI. Ask another question or choose a suggestion.');
    } catch (error) {
      const message = error?.message || 'AI request failed';
      setMessages((current) => [...current, { sender: 'assistant', text: `AI error: ${message}` }]);
      setStatus('AI request failed. Check the startup log or HF_API_KEY configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setEmail('');
    setPassword('');
    setStatus('AI model ready. Use the floating button for quick help.');
    setAssistantOpen(false);
  };

  if (!user) {
    return (
      <div className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">AGRI-NEST Desktop</p>
            <h1>{isRegistering ? 'Create your account' : 'Sign in to continue'}</h1>
          </div>
          <div className="topbar-actions">
            <button className="pill pill-secondary" type="button" onClick={handleToggleRegister}>
              {isRegistering ? 'Already have an account?' : 'New user? Register'}
            </button>
          </div>
        </header>

        <main className="main-grid">
          <section className="panel glass-primary">
            <h2>{isRegistering ? 'Register for AGRI-NEST' : 'Welcome back'}</h2>
            <p>
              {isRegistering
                ? 'Register now to access your dashboard, weather alerts and market support.'
                : 'Log in to access the AGRI-NEST desktop experience and your agri-services.'}
            </p>
            <form className="chat-panel" onSubmit={handleAuthSubmit}>
              <div className="chat-controls auth-controls">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <button type="submit">{isRegistering ? 'Register' : 'Sign in'}</button>
              </div>
              {loginError && <div className="auth-error">{loginError}</div>}
            </form>
          </section>

          <section className="panel glass-secondary">
            <h2>{isRegistering ? 'Why register?' : 'Why sign in?'}</h2>
            <p>Your account unlocks market insights, weather alerts, logistics support, and personalized agribusiness guidance.</p>
            <div className="feature-list">
              <div>• Secure access for farm managers</div>
              <div>• Personalized agri recommendations</div>
              <div>• Sync with local data and weather feeds</div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AGRI-NEST Desktop</p>
          <h1>Welcome back, {user.name}</h1>
          <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.75)', maxWidth: '640px' }}>
            Your dashboard is ready. Open the floating AI helper whenever you need quick field guidance.
          </p>
        </div>
        <div className="topbar-actions">
          <button className="pill">EN</button>
          <button className="pill pill-secondary" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <main className="main-grid dashboard-grid">
        <section className="panel glass-primary dashboard-card">
          <h2>Market insights</h2>
          <p>Latest prices for crops in key Tanzanian markets, tailored to your supply chain.</p>
          <div className="feature-list">
            <div>• Maize: 1,050 TZS / kg in Dar es Salaam</div>
            <div>• Tomatoes: 1,780 TZS / kg in Arusha</div>
            <div>• Beans: 1,450 TZS / kg in Mwanza</div>
          </div>
        </section>

        <section className="panel glass-secondary dashboard-card">
          <h2>Weather alerts</h2>
          <p>Stay updated on rainfall, dry spells, and field conditions for your region.</p>
          <div className="feature-list">
            <div>• Coastal forecast: scattered showers today</div>
            <div>• Northern highlands: cooler nights, 14°C</div>
            <div>• Dry-zone alert: plan irrigation for maize fields</div>
          </div>
        </section>

        <section className="panel glass-primary dashboard-card">
          <h2>Action items</h2>
          <p>Quick tasks that help you keep the farm running smoothly.</p>
          <div className="feature-list">
            <div>• Check fertilizer delivery for next week</div>
            <div>• Review pest scouting reports</div>
            <div>• Confirm storage readiness for harvest</div>
          </div>
        </section>
      </main>

      {assistantOpen && (
        <div className="assistant-drawer">
          <div className="assistant-drawer-header">
            <div>
              <h3>AGRI-NEST AI helper</h3>
              <p>Ask quick questions without leaving the dashboard.</p>
            </div>
            <button className="pill pill-secondary" type="button" onClick={() => setAssistantOpen(false)}>
              Close
            </button>
          </div>
          <div className="chat-history">
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-controls">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question, e.g. price in Dar es Salaam"
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              {loading ? 'Thinking...' : 'Send'}
            </button>
          </div>
          <div className="suggestions">
            {suggestions.map((text) => (
              <button type="button" key={text} onClick={() => setQuery(text)}>
                {text}
              </button>
            ))}
          </div>
        </div>
      )}

      <button className="assistant-fab" type="button" onClick={() => setAssistantOpen((current) => !current)}>
        {assistantOpen ? 'Close AI' : 'Ask AI'}
      </button>
    </div>
  );
}

export default App;
