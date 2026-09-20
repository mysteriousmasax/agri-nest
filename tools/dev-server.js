/**
 * AGRI-NEST local dev server
 * Serves www/ with CORS and relaxed security headers for embedded/restricted browsers.
 */
const path = require('path');
const express = require('express');

const PORT = Number(process.env.PORT) || 8080;
const ROOT = path.resolve(__dirname, '..', 'www');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.static(ROOT, {
  extensions: ['html'],
  setHeaders(res, filePath) {
    if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
  },
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

function startServer(port) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`AGRI-NEST dev server: http://127.0.0.1:${port}`);
    console.log(`LAN: http://localhost:${port}`);
    console.log('Open in Chrome/Edge at the URL above (not file://).');
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && port < PORT + 5) {
      console.warn(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server failed:', err.message);
      process.exit(1);
    }
  });
}

startServer(PORT);
