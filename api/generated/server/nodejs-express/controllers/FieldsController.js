const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  // In a production stub, this would create a field record for an existing farm.
  res.status(201).json({ status: 'ok', field: req.body });
});

module.exports = router;
