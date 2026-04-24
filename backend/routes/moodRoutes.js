const express = require('express');
const { body } = require('express-validator');
const {
  addMoodEntry,
  getMoodEntries,
  getWeeklyStats,
  getMonthlyStats
} = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');
const { handleValidation } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('mood').notEmpty(),
    body('stressLevel').isInt({ min: 1, max: 10 }),
    body('anxietyLevel').isInt({ min: 1, max: 10 }),
    body('sleepHours').isFloat({ min: 0, max: 24 })
  ],
  handleValidation,
  addMoodEntry
);
router.get('/', getMoodEntries);
router.get('/weekly-stats', getWeeklyStats);
router.get('/monthly-stats', getMonthlyStats);

module.exports = router;
