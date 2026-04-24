const express = require('express');
const { body } = require('express-validator');
const { createNote, getNotes, deleteNote, searchNotes } = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');
const { handleValidation } = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', [body('title').notEmpty(), body('content').notEmpty()], handleValidation, createNote);
router.get('/', getNotes);
router.get('/search', searchNotes);
router.delete('/:id', deleteNote);

module.exports = router;
