'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Faire confiance au proxy Apache/Passenger d'O2Switch pour les IPs réelles
// (nécessaire pour express-rate-limit)
if (isProd) {
  app.set('trust proxy', 1);
}

// Sécurité HTTP headers
app.use(helmet());

// Compression gzip des réponses
app.use(compression());

// CORS configuration
const allowedOrigins = isProd
  ? [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL?.replace('https://', 'https://www.'),
    ].filter(Boolean)
  : [
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

// Fichiers statiques — avatars uploadés accessibles publiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
