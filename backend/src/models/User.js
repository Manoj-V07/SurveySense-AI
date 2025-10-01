const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: ['supervisor', 'enumerator'], // Strict roles for authorization
        default: 'enumerator',
    },
    govId: {
        type: String,
        // unique: true, // You may want this if the ID is strictly unique
        trim: true,
        required: function() { return this.role === 'enumerator'; } // Required only for enumerators
    },
}, { timestamps: true });

// Mongoose Pre-Save Hook: Hash the password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Custom Method: Compare entered password with stored hash
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);