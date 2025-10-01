const express = require('express');
const { protect, roleProtect } = require('../middleware/authMiddleware');
const { submitResponse, getResponsesBySurveyId, flagResponse } = require('../controllers/responseController');

const router = express.Router();

// POST: Submit a new response (sync from Mobile App) - Enumerator/Private
router.post('/', protect, submitResponse);

// GET: Fetch all responses for a specific survey - Supervisor Only
router.get('/:surveyId', protect, roleProtect(['supervisor']), getResponsesBySurveyId);

// PUT: Manually flag a response (Data Quality check by Supervisor) - Supervisor Only
router.put('/:id/flag', protect, roleProtect(['supervisor']), flagResponse);

module.exports = router;