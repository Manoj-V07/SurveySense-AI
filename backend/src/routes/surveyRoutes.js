const express = require('express');
const { protect, roleProtect } = require('../middleware/authMiddleware');
const { 
    createSurvey, 
    getSurveys, 
    getSurveyById, 
    updateSurvey,
    assignSurveyToEnumerator 
} = require('../controllers/surveyController');

const router = express.Router();

// Publicly available routes (optional for assignment info)
// router.get('/', getPublicSurveys); 

// Private Routes - ALL require Authentication
// POST: Create a new survey - Supervisor Only
router.post('/', protect, roleProtect(['supervisor']), createSurvey); 
// GET: Fetch all surveys created by the supervisor - Supervisor/Enumerator
router.get('/', protect, getSurveys); 
// GET: Fetch a single survey details (used by Mobile App) - Private
router.get('/:id', protect, getSurveyById);
// PUT: Update survey details - Supervisor Only
router.put('/:id', protect, roleProtect(['supervisor']), updateSurvey);
// POST: Assign a survey to an enumerator (for simplicity, only Supervisor can assign)
router.post('/:id/assign', protect, roleProtect(['supervisor']), assignSurveyToEnumerator);


module.exports = router;