// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 day cookie
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES: AUTHENTICATION ---

// Sign Up
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User or email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Log them in immediately
        req.session.userId = newUser._id;
        req.session.username = newUser.username;
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Set session
        req.session.userId = user._id;
        req.session.username = user.username;
        
        res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'Logged out' });
});

// Check Auth Status (Used by dashboard.js)
app.get('/api/check-auth', (req, res) => {
    if (req.session.userId) {
        res.status(200).json({ authenticated: true, username: req.session.username });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

// --- API ROUTES: GEMINI AI ---

app.post('/api/plan', async (req, res) => {
    // Security check: Must be logged in to use the AI API
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    try {
        const { monthlyIncome, currentSavings, riskTolerance, financialGoal } = req.body;

        // Construct the prompt for Gemini
        const prompt = `
        Act as an expert quantitative financial advisor. 
        A client has provided the following metrics:
        - Monthly Income: $${monthlyIncome}
        - Current Liquid Savings: $${currentSavings}
        - Risk Tolerance Profile: ${riskTolerance}
        - Primary Financial Goal: "${financialGoal}"
        
        Please provide a structured, strategic financial plan. 
        Format the response clearly with headings. 
        Include:
        1. A brief analysis of their current situation.
        2. Suggested monthly budget allocation (rule of thumb).
        3. An asset allocation strategy suited to their risk tolerance.
        4. Concrete steps to achieve their specific goal.
        Keep it concise, professional, and directly applicable.
        `;

        // Call the Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.status(200).json({ plan: responseText });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'Failed to generate financial plan. Check API Key.' });
    }
});

// Fallback to index.html for any unknown routes (Bypasses the Express 5 router regex)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});