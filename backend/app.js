'use strict';

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// API Routes
app.use('/api', routes);

// 404 handler for API routes
app.use('/api', notFoundHandler);

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
