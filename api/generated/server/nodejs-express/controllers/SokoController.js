const express = require('express');
const router = express.Router();
const ListingService = require('../services/ListingService');

router.post('/listings', async (req, res) => {
  try {
    const listing = await ListingService.createListing(req.body);
    res.status(201).json(listing);
  } catch (err) {
    console.error('SokoController.createListing', err);
    res.status(500).json({ error: 'db_error' });
  }
});

router.get('/listings', async (req, res) => {
  try {
    const items = await ListingService.listings();
    res.json({ items });
  } catch (err) {
    console.error('SokoController.listings', err);
    res.status(500).json({ error: 'db_error' });
  }
});

module.exports = router;
