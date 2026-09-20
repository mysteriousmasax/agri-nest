const express = require('express');
const router = express.Router();
const FarmService = require('../services/FarmService');

router.post('/', async (req, res) => {
  try {
    const farm = await FarmService.createFarm(req.body);
    res.status(201).json(farm);
  } catch (err) {
    console.error('FarmsController.create', err);
    res.status(500).json({ error: 'db_error' });
  }
});

router.get('/:farmId', async (req, res) => {
  try {
    const farm = await FarmService.getFarmById(req.params.farmId);
    if (!farm) return res.status(404).json({ error: 'not_found' });
    res.json(farm);
  } catch (err) {
    console.error('FarmsController.get', err);
    res.status(500).json({ error: 'db_error' });
  }
});

module.exports = router;
