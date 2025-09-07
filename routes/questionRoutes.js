const express = require('express');
const {
  togglePinQuestion,
  updateQuestionNote,
  addQuestionToSession,
} = require('../controllers/questionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/question/add
// @desc    Add questions to a session
router.post('/add', protect, addQuestionToSession);

// @route   POST /api/question/:id/pin
// @desc    Toggle pin for a question
router.post('/:id/pin', protect, togglePinQuestion);

// @route   POST /api/question/:id/note
// @desc    Update note for a question
router.post('/:id/note', protect, updateQuestionNote);

module.exports = router;
