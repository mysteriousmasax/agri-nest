const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Simple webhook receiver for simulated gateway callbacks
router.post('/delivery', async (req, res) => {
  try {
    const payload = req.body;
    const storePath = path.join(__dirname, '..', 'data', 'local-gateway-callbacks.json');
    let store = { callbacks: [] };
    try { store = JSON.parse(fs.readFileSync(storePath, 'utf8')); } catch (e) {}
    store.callbacks.unshift({ payload, receivedAt: new Date().toISOString() });
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    console.error('LocalGatewayController.delivery', err);
    res.status(500).json({ error: 'delivery_callback_error' });
  }
});

module.exports = router;
