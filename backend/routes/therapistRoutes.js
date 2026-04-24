const express = require('express');
const { getTherapists, getTherapistById, addTherapist, updateTherapist } = require('../controllers/therapistController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getTherapists);
router.get('/:id', getTherapistById);
router.post('/', protect, adminOnly, addTherapist);
router.put('/:id', protect, adminOnly, updateTherapist);

module.exports = router;
