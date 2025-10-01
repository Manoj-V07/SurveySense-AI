const Survey = require('../models/Survey');
const User = require('../models/User'); // Needed to check enumerator status

// @desc    Create a new survey form
// @route   POST /api/v1/surveys
// @access  Private/Supervisor Only
exports.createSurvey = async (req, res) => {
    const { title, problemStatementID, questions } = req.body;
    const createdBy = req.user._id; 

    if (!title || !questions) {
        return res.status(400).json({ message: 'Missing required survey fields (title, questions).' });
    }

    try {
        const survey = await Survey.create({
            title,
            problemStatementID,
            questions,
            createdBy,
        });
        res.status(201).json(survey);
    } catch (error) {
        res.status(400).json({ message: 'Invalid survey data format.', details: error.message });
    }
};

// @desc    Get surveys relevant to the user (created by supervisor, assigned to enumerator)
// @route   GET /api/v1/surveys
// @access  Private
exports.getSurveys = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'supervisor') {
            // Supervisors see surveys they created
            query = { createdBy: req.user._id };
        } 
        // Note: For simplicity, enumerators will fetch their surveys through a dedicated assignment mechanism (Phase 4, Controller 2)

        const surveys = await Survey.find(query); 
        res.status(200).json(surveys);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch surveys' });
    }
};

// @desc    Get a single survey (used by Mobile App to download)
// @route   GET /api/v1/surveys/:id
// @access  Private
exports.getSurveyById = async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);

        if (survey) {
            // Ensure only the creator or an assigned enumerator can see it (simplified for now)
            res.status(200).json(survey);
        } else {
            res.status(404).json({ message: 'Survey not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a survey (only allowed by the creator)
// @route   PUT /api/v1/surveys/:id
// @access  Private/Supervisor Only
exports.updateSurvey = async (req, res) => {
    const { title, questions } = req.body;

    try {
        const survey = await Survey.findById(req.params.id);

        if (survey && survey.createdBy.toString() === req.user._id.toString()) {
            survey.title = title || survey.title;
            survey.questions = questions || survey.questions;
            
            const updatedSurvey = await survey.save();
            res.json(updatedSurvey);
        } else {
            res.status(404).json({ message: 'Survey not found or user not authorized' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid update data' });
    }
};

// Placeholder: For assignment logic (advanced feature, often done via a separate Assignment model)
exports.assignSurveyToEnumerator = async (req, res) => {
    const { enumeratorId } = req.body;
    
    // Check if the enumerator exists
    const enumerator = await User.findById(enumeratorId);
    if (!enumerator || enumerator.role !== 'enumerator') {
        return res.status(404).json({ message: 'Enumerator not found or role incorrect.' });
    }

    // Actual assignment logic (e.g., adding surveyId to enumerator's assignment array)
    // *** FOR NOW, THIS IS A MOCK RESPONSE ***
    res.json({ message: `Survey ${req.params.id} successfully assigned to ${enumerator.username}. (Assignment Model needed for full implementation)` });
};