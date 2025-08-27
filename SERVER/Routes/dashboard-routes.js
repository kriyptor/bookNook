const express = require('express');
const router = express.Router();
const { authenticate } = require('../Middleware/auth-middleware');
const { getDashboardStats } = require('../Controllers/dashboard-controller');

// GET /api/dashboard - Get dashboard stats
router.get('/', authenticate, getDashboardStats);


module.exports = router;