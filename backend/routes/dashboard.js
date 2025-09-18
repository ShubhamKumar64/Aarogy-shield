const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect dashboard routes
router.use(authMiddleware.isAuthenticated);

router.get('/', dashboardController.getDashboard);

module.exports = router;