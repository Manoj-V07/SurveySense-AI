const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
};

// @desc    Handles Initial Supervisor Setup OR Enumerator Self-Registration
// @route   POST /api/v1/auth/register
// @access  Public (Logic handles security based on existing user count)
exports.registerUser = async (req, res) => {
    // Note: 'role' and 'govId' are expected in the body
    const { username, password, role, govId } = req.body; 
    
    // 1. Check if the user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Initial Supervisor Setup (One-time use)
    const supervisorExists = await User.findOne({ role: 'supervisor' });
    if (!supervisorExists && role === 'supervisor') {
        // Only the very first person can claim the supervisor role
        const user = await User.create({ username, password, role: 'supervisor' });
        return res.status(201).json({
            _id: user._id, username: user.username, role: user.role,
            token: generateToken(user._id, user.role),
            message: 'Initial Supervisor setup complete.'
        });
    }

    // 3. Enumerator Self-Registration (Only available if a Supervisor already exists)
    if (role === 'enumerator') {
        if (!govId) {
            return res.status(400).json({ message: 'Government ID (GovId) is required for self-registration.' });
        }
        
        try {
            // Role is set to 'enumerator'. GovId is saved for verification.
            const user = await User.create({ username, password, role: 'enumerator', govId }); 
            return res.status(201).json({
                _id: user._id, username: user.username, role: user.role,
                message: 'Registration successful. Account pending government verification.'
            });
        } catch (error) {
            // Catches Mongoose validation errors
            return res.status(400).json({ message: 'Invalid registration data.', details: error.message });
        }
    }
    
    // 4. Default Fail Safe
    // Prevents unauthorized attempts to register as 'supervisor' after the first one.
    return res.status(403).json({ 
        message: 'Access denied. The Supervisor account is already set up. Only Enumerator self-registration is allowed.' 
    });
};


// @desc    Authenticate user & get token (Login logic)
// @route   POST /api/v1/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        // Generate and return token
        const token = generateToken(user._id, user.role);
        res.json({ 
            _id: user._id, 
            username: user.username, 
            role: user.role, 
            token 
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};