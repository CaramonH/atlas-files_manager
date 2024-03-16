const express = require('express');

const router = express.Router();

// Require controllers
const AppController = require('../controllers/AppController');

// API Endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;