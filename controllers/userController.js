const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token (expires in 30 minutes)
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '2m' });
};

// Register
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: 'Email already registered' });

        const user = await User.create({ name, email, password, role }); // Password will be auto-hashed by model
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { name: user.name, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user._id, user.role);
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { name: user.name, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Profile
exports.getProfile = (req, res) => {
    res.json(req.user);
};

