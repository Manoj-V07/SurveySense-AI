const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT and attach user data to request
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from header (Format: Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token using the secret from .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Fetch user (excluding password) and attach user object to the request
            req.user = await User.findById(decoded.id).select('-password');
            
            // Proceed to the next middleware or controller
            next();

        } catch (error) {
            console.error(error);
            // If token is invalid or expired
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        // If no token is provided in the headers
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check user role (e.g., allow only 'supervisor')
// Usage: router.post('/', protect, roleProtect(['supervisor']), createSurvey);
exports.roleProtect = (roles) => (req, res, next) => {
    // Check if the user is authenticated (req.user exists) and if their role is in the allowed list
    if (req.user && roles.includes(req.user.role)) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: Insufficient user role' });
    }
};