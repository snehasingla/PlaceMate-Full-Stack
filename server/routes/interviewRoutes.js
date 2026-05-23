const express = require('express');
const router = express.Router();
const {
  generateQuestions,
  evaluateAnswers,
  getMySessions,
  getSessionById
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateQuestions);
router.post('/evaluate', protect, evaluateAnswers);
router.get('/my-sessions', protect, getMySessions);
router.get('/:id', protect, getSessionById);

module.exports = router;
