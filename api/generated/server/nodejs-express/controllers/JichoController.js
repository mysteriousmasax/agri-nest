const express = require('express');
const router = express.Router();
const JichoService = require('../services/JichoService');

router.post('/scan', async (req, res) => {
  try {
    const result = await JichoService.diagnose(req.body);
    res.json(result);
  } catch (err) {
    console.error('JichoController.scan', err);
    res.status(500).json({ error: 'jicho_error' });
  }
});

module.exports = router;
