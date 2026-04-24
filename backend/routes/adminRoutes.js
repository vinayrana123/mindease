const express = require('express');
const { getUsers, getBookings, getAnalytics } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', getUsers);
router.get('/bookings', getBookings);
router.get('/analytics', getAnalytics);

module.exports = router;
