const Response = require('../models/Response');

// @desc    Submit a new response (data sync from mobile app)
// @route   POST /api/v1/responses
// @access  Private
exports.submitResponse = async (req, res) => {
    const { surveyId, answers, paradata } = req.body;
    
    // The enumerator ID comes from the authenticated user token
    const enumeratorId = req.user._id;

    if (!surveyId || !answers || !paradata) {
        return res.status(400).json({ message: 'Missing required response fields.' });
    }

    try {
        // Here is where the server-side AI validation would run (Future Scope for better quality)
        // const isDataValid = await runServerSideValidation(answers);

        const response = await Response.create({
            surveyId,
            enumeratorId,
            answers,
            paradata: {
                ...paradata,
                // Simple quality flag example: If survey completed too quickly
                isFlagged: paradata.timeTaken < 300 // Flag if less than 5 minutes (300s)
            },
            status: 'synced' // Mark as synced once received
        });

        res.status(201).json(response);

    } catch (error) {
        res.status(400).json({ message: 'Invalid response data format.', details: error.message });
    }
};

// @desc    Get responses for a specific survey (for supervisor dashboard)
// @route   GET /api/v1/responses/:surveyId
// @access  Private/Supervisor Only
exports.getResponsesBySurveyId = async (req, res) => {
    try {
        const responses = await Response.find({ surveyId: req.params.surveyId })
            .populate('enumeratorId', 'username'); // Show who collected the data
        
        res.status(200).json(responses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch responses' });
    }
};

// @desc    Manually flag a response for review
// @route   PUT /api/v1/responses/:id/flag
// @access  Private/Supervisor Only
exports.flagResponse = async (req, res) => {
    try {
        const response = await Response.findById(req.params.id);
        
        if (response) {
            response.paradata.isFlagged = true;
            response.status = 'flagged';
            await response.save();
            res.json({ message: 'Response flagged for review.', response });
        } else {
            res.status(404).json({ message: 'Response not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};