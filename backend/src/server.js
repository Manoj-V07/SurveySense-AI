// --- Imports (TOP of file) ---
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const cors = require('cors'); 
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // <-- NEW IMPORT

// Load environment variables 
dotenv.config({ path: '../.env' }); 

// Connect to Database
connectDB(); 

const app = express();

// --- Core Middleware ---
app.use(express.json()); 
app.use(cors()); 

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const responseRoutes = require('./routes/responseRoutes');

// --- Define Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/surveys', surveyRoutes); 
app.use('/api/v1/responses', responseRoutes); 

// Simple Status Check 
app.get('/api/v1/status', (req, res) => res.send('Server is running...'));


// --- ERROR HANDLERS (MUST be last) ---
app.use(notFound);      // Catches all unmatched routes (404)
app.use(errorHandler);  // General error processing (handles Mongoose validation, 500s)


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));