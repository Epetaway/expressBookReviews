// Session helper for UI authentication
const express = require('express');
const router = express.Router();

// Store active sessions (in memory for demo - use database in production)
let activeSessions = new Map();

// Helper function to create session ID
function generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Login endpoint that sets browser cookies
router.post('/ui-login', (req, res) => {
    const { username, password } = req.body;
    
    // Validate credentials (you can reuse the authenticatedUser function)
    const users = require('./auth_users.js').users;
    const validUser = users.find(user => user.username === username && user.password === password);
    
    if (validUser) {
        const sessionId = generateSessionId();
        
        // Store session
        activeSessions.set(sessionId, {
            username: username,
            loginTime: new Date()
        });
        
        // Set cookie
        res.cookie('bookReviewSession', sessionId, { 
            maxAge: 3600000, // 1 hour
            httpOnly: false // Allow JS access for demo
        });
        
        res.json({
            success: true,
            message: 'Login successful',
            username: username,
            sessionId: sessionId
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// Check session endpoint
router.get('/check-session', (req, res) => {
    const sessionId = req.cookies.bookReviewSession;
    
    if (sessionId && activeSessions.has(sessionId)) {
        const session = activeSessions.get(sessionId);
        res.json({
            loggedIn: true,
            username: session.username
        });
    } else {
        res.json({
            loggedIn: false
        });
    }
});

// Logout endpoint
router.post('/ui-logout', (req, res) => {
    const sessionId = req.cookies.bookReviewSession;
    
    if (sessionId) {
        activeSessions.delete(sessionId);
        res.clearCookie('bookReviewSession');
    }
    
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Middleware to check UI authentication
function requireUIAuth(req, res, next) {
    const sessionId = req.cookies.bookReviewSession;
    
    if (sessionId && activeSessions.has(sessionId)) {
        req.uiUser = activeSessions.get(sessionId);
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'Please login first'
        });
    }
}

module.exports = { router, requireUIAuth, activeSessions };