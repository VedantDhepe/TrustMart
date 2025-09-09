// app.js

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());



const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://trustmart.onrender.com' // Production frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ====================
// Database Connection
// ====================
const pool = require('./db'); // your db.js exports the pool

// ====================
// Passport Configuration
// ====================
// This file sets up passport-local strategy and serialization logic
require('./config/passport');

// ====================
// Session Middleware
// ====================
// Required for persistent login sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Use true with HTTPS in production!
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ==================== 
// Routers Import 
// ====================
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// ====================
// Mount Routers
// ====================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ====================
// Basic Test Route
// ====================
app.get('/', (req, res) => {
  res.send("API is running!");
});



// ====================
// 404 Not Found Handler — place this AFTER all your routes!
// ====================
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});




// ====================
// Error Handling Middleware
// ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// ====================
// Start Server
// ====================
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port", port);
});
