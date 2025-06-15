const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });

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
        if (!user || !(await bcrypt.compare(password, user.password))) {
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

// Protected Profile Route
exports.getProfile = (req, res) => {
    res.json(req.user);
};
