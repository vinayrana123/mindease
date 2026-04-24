const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { handleValidation } = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  handleValidation,
  register
);
router.post('/login', [body('email').isEmail(), body('password').notEmpty()], handleValidation, login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put(
  '/change-password',
  protect,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 })],
  handleValidation,
  changePassword
);

module.exports = router;
