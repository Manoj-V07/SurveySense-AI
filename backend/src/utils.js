// =======================================================
// UTILITY FUNCTIONS (Reusable helper logic)
// =======================================================

/**
 * Calculates the total duration of the survey collection.
 * @param {object} paradata - Contains timestamps and duration info from mobile app.
 * @returns {number} The total time in seconds.
 */
exports.calculateSurveyTime = (paradata) => {
    // For now, return the time provided by the mobile app (or a placeholder)
    return paradata.timeTaken || 0;
};


/**
 * Runs complex, server-side data quality checks (e.g., cross-field validation, range checking)
 * This is where the secondary AI-driven validation logic would reside.
 * @param {array} answers - The array of submitted answers.
 * @returns {boolean} True if data is acceptable, false if it should be flagged.
 */
exports.runServerSideValidation = (answers) => {
    // Placeholder logic: checks if answers array is empty
    if (answers && answers.length > 0) {
        return true; 
    }
    return false;
};


/**
 * Placeholder for the AI-driven auto-coding feature (Future scope)
 * This would map open-ended text responses to official MoSPI codes (NCO, NIC).
 * @param {string} text - Open-ended response text (e.g., profession description).
 * @returns {string} The matched classification code.
 */
exports.autoCodeResponse = (text) => {
    // Placeholder implementation
    if (text.toLowerCase().includes('farmer')) {
        return 'NCO-2021-AGRI';
    }
    return 'UNCATEGORIZED';
};