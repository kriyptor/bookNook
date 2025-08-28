const express = require('express');
const router = express.Router();
const { authenticate } = require('../Middleware/auth-middleware');
const { createUser, loginUser, getUserProfile, updateUserProfile} = require('../Controllers/auth-controller');

// POST /api/auth/register - Register a new user
router.post('/register', createUser);

// POST /api/auth/login - Login user
router.post('/login', loginUser);

router.get('/user', authenticate, getUserProfile);

router.post('/user', authenticate, updateUserProfile);

module.exports = router;
