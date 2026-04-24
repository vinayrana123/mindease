const express = require('express');
const { body } = require('express-validator');
const {
  createAppointment,
  cancelBooking,
  rescheduleBooking,
  getUserBookings
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { handleValidation } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('therapistId').notEmpty(),
    body('date').notEmpty(),
    body('time').notEmpty(),
    body('mode').isIn(['online', 'offline'])
  ],
  handleValidation,
  createAppointment
);
router.get('/', getUserBookings);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/reschedule', rescheduleBooking);

module.exports = router;
