const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    surveyId: { // Link to the survey form
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true,
    },
    enumeratorId: { // Link to the enumerator who collected the data
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    answers: [{ // Array of submitted answers
        questionId: mongoose.Schema.Types.ObjectId,
        value: String, // Can store transcribed voice text, numbers, or selected options
    }],
    paradata: { // Metadata captured by the mobile app (crucial for data quality)
        gpsCoordinates: {
            latitude: Number,
            longitude: Number,
        },
        timeTaken: Number, // Total time in seconds
        deviceInfo: String,
    },
    status: {
        type: String,
        enum: ['pending_sync', 'synced', 'flagged'],
        default: 'pending_sync', // Used by mobile app (Member 3) for offline tracking
    }
}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema);