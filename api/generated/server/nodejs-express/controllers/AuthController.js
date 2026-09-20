const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');

router.post('/register', async (req, res) => {
  const { phone, name } = req.body;
  try {
    const user = await UserService.createUser(phone, name);
    res.status(201).json(user);
  } catch (err) {
    console.error('AuthController.register', err);
    res.status(500).json({ error: 'db_error' });
  }
});

router.post('/login', async (req, res) => {
  const { phone } = req.body;
  res.json({ token: 'token_' + (phone || 'anon') });
});

module.exports = router;
