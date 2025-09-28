const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    problemStatementID: { // PS03
        type: String,
        required: true,
    },
    questions: [{ // Array to hold the question structure and adaptive logic
        questionText: String,
        questionType: { type: String, enum: ['text', 'number', 'select', 'voice'] },
        options: [String],
        // Conditional logic: e.g., show this question only if answer to Q1 is 'Yes'
        dependsOn: { 
            questionId: mongoose.Schema.Types.ObjectId,
            expectedValue: String,
        },
    }],
    createdBy: { // Reference to the Supervisor who created the survey
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Survey', SurveySchema);