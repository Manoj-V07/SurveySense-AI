// Custom Error Handler for routes that don't exist (404 Not Found)
exports.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the next error-handling middleware
};

// General Error Handler
exports.errorHandler = (err, req, res, next) => {
    // Determine the status code: Use the existing status or default to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    let errorMessage = err.message;
    let errorDetails = {};

    // --- Mongoose Specific Error Handling ---

    // 1. Mongoose Validation Error (400 Bad Request)
    if (err.name === 'ValidationError') {
        res.status(400);
        errorMessage = 'Validation Failed';
        
        // Extract all validation errors for a detailed response
        errorDetails = Object.keys(err.errors).reduce((acc, key) => {
            acc[key] = err.errors[key].message;
            return acc;
        }, {});
    }

    // 2. MongoDB Duplicate Key Error (11000) (400 Bad Request)
    if (err.code === 11000) {
        res.status(400);
        errorMessage = 'Duplicate Field Value Entered';
        // Extract the field that caused the duplication
        const field = Object.keys(err.keyValue).join(', ');
        errorDetails = { field: `${field} must be unique.` };
    }
    
    // ----------------------------------------

    res.json({
        message: errorMessage,
        details: errorDetails,
        // Only provide stack trace in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};