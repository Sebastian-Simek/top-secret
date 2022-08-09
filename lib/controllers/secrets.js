const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router()
  .get('/', authenticate, async (req, res) => {
    const secrets = await Secret.getAll();
    res.json(secrets);
  });
