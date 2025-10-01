const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true,
    },
    enumeratorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    answers: [{ // Array to store transcribed/validated answers
        questionId: mongoose.Schema.Types.ObjectId,
        value: { type: String, required: true }, 
        questionText: String, // For easy review on the dashboard
    }],
    paradata: { // Metadata for quality assurance
        gpsCoordinates: {
            latitude: Number,
            longitude: Number,
        },
        timeTaken: Number, // Total time in seconds
        deviceInfo: String,
        isFlagged: { type: Boolean, default: false } // AI Quality Flag
    },
    status: {
        type: String,
        enum: ['pending_sync', 'synced', 'flagged'],
        default: 'pending_sync', // Used by mobile app (Member 3) for offline tracking
    }
}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema);