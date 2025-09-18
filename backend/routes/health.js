const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.isAuthenticated);

router.get('/', healthController.getHealthTracker);
router.post('/entry', healthController.postHealthEntry);
router.get('/history', healthController.getHealthHistory);

module.exports = router;