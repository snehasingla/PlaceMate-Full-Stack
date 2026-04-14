const express = require('express');
const router = express.Router();
const { analyzeResume } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/resume-review', protect, analyzeResume);

module.exports = router;
