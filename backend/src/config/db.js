const mongoose = require('mongoose');

// The function we want to export
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // These options are often recommended for Mongoose 6+ to remove warnings
            // useNewUrlParser: true, 
            // useUnifiedTopology: true,
            // useCreateIndex: true, // Deprecated in recent versions
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure
        process.exit(1); 
    }
};

// EXPORT THE FUNCTION: This is the crucial step!
module.exports = connectDB;