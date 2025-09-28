// --- Start of server.js ---
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Assuming you have a DB connection file

// Load environment variables (from .env)
dotenv.config();

// Connect to Database
connectDB(); 

const app = express();

// --- Core Middleware ---
// Allows us to accept JSON data in the request body
app.use(express.json()); 
// CORS will be needed for frontend access
// Note: You may need to install 'cors' package and configure it further
// app.use(cors()); 

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes');

// --- Define Routes ---
app.use('/api/v1/auth', authRoutes);

// Simple Status Check (Kept from Week 1)
app.get('/api/v1/status', (req, res) => res.send('Server is running...'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));