const http = require('http');
const { URL } = require('url');

const port = process.env.PORT || 3000;

function jsonResponse(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body);
}

function collectRequestData(req, callback) {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try { callback(null, JSON.parse(body || '{}')); }
    catch (err) { callback(err); }
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'POST' && url.pathname === '/jicho/scan') {
    collectRequestData(req, (err, data) => {
      if (err) return jsonResponse(res, 400, { error: 'invalid_json' });
      // Simple mock: echo back a random diagnosis
      const diagnoses = ['Yellow Rust', 'Leaf Blight', 'Healthy', 'Bean Rust'];
      const choice = diagnoses[Math.floor(Math.random() * diagnoses.length)];
      const confidence = Math.round((0.5 + Math.random() * 0.5) * 100) / 100;
      return jsonResponse(res, 200, { diagnosis: choice, confidence });
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/users') {
    collectRequestData(req, (err, data) => {
      if (err) return jsonResponse(res, 400, { error: 'invalid_json' });
      const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 10);
      return jsonResponse(res, 201, { user_id: id, phone: data.phone || null, name: data.name || null });
    });
    return;
  }

  // default
  jsonResponse(res, 404, { error: 'not_found' });
});

server.listen(port, () => console.log(`AGRI-NEST mock API listening on http://localhost:${port}`));
