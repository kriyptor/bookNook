const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../Controllers/auth-controller');

// POST /api/auth/register - Register a new user
router.post('/register', createUser);

// POST /api/auth/login - Login user
router.post('/login', loginUser);

module.exports = router;
