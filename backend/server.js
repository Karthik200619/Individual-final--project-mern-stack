import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { UserApi } from './APIs/UserApi.js';
import { AdminApi } from './APIs/AdminApi.js';
import { CommonApi } from './APIs/CommonApi.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'https://individual-final-project-mern-stack.vercel.app')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    // Allow non-browser clients (curl, health checks) without an Origin header.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/user-api', UserApi);
app.use('/admin-api', AdminApi);
app.use('/common-api', CommonApi);

// Keep the not-found handler after all routes.
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.originalUrl });
});

// Central error handler. Avoid returning stack traces or internal details to clients.
app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid request', error: err.message });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  if (errCode === 11000) {
    const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue ?? {};
    const field = Object.keys(keyValue)[0];
    return res.status(409).json({
      message: 'A record with this value already exists',
      ...(field ? { field } : {}),
    });
  }

  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ message: err.message || 'Request failed' });
  }

  // Log server-side details for debugging, but do not expose them in API responses.
  console.error('Unhandled API error:', err);
  return res.status(500).json({ message: 'Internal server error' });
});

async function start() {
  if (!process.env.DB_URL) {
    throw new Error('Missing required environment variable: DB_URL');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }

  await mongoose.connect(process.env.DB_URL);
  console.log('Connected to MongoDB');

  app.listen(port, () => {
    console.log(`CampusKart API listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start CampusKart API:', err.message);
  process.exitCode = 1;
});

export default app;
