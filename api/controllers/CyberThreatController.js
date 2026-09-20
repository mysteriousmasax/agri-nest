const express = require('express');
const router = express.Router();
const CyberThreatService = require('../services/CyberThreatService');

router.post('/scan', async (req, res) => {
  try {
    const response = await CyberThreatService.scanEvent(req.body);
    res.json(response);
  } catch (err) {
    console.error('CyberThreatController.scan', err);
    res.status(500).json({ error: 'scan_error' });
  }
});

router.post('/configure', async (req, res) => {
  try {
    const { enabled, superAdminToken } = req.body;
    const response = await CyberThreatService.configureDetection({ enabled, superAdminToken });
    res.json(response);
  } catch (err) {
    console.error('CyberThreatController.configure', err);
    res.status(500).json({ error: 'configure_error' });
  }
});

router.post('/status', async (req, res) => {
  try {
    const { superAdminToken } = req.body;
    const response = await CyberThreatService.getStatus({ superAdminToken });
    res.json(response);
  } catch (err) {
    console.error('CyberThreatController.status', err);
    res.status(500).json({ error: 'status_error' });
  }
});

module.exports = router;
