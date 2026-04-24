const express = require('express');
const { getResources, createResource } = require('../controllers/resourceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getResources);
router.post('/', protect, adminOnly, createResource);

module.exports = router;
