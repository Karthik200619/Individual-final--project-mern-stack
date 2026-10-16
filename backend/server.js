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

// Preserve the deployed frontend, preview deployments, and local development origins.
// CLIENT_ORIGIN can add comma-separated exact origins in the hosting environment.
const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  'https://individual-final-project-mern-stack.vercel.app',
  'https://individual-final--project-mern-stack.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...configuredOrigins,
]);

const isCampusKartVercelPreview = (origin) =>
  /^https:\/\/individual-final--?project-mern-stack(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin);

app.disable('x-powered-by');

// CORS must run before routers so OPTIONS preflight requests are handled.
app.use(cors({
  origin(origin, callback) {
    // Allow non-browser clients and health checks without an Origin header.
    if (!origin || allowedOrigins.has(origin) || isCampusKartVercelPreview(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Lightweight health endpoint for hosting checks.
app.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Keep existing API prefixes unchanged.
app.use('/user-api', UserApi);
app.use('/admin-api', AdminApi);
app.use('/common-api', CommonApi);

// Not-found handler must come after all API routes.
app.use((req, res) => {
  return res.status(404).json({ message: `${req.originalUrl} is invalid path` });
});

// Central error handler; do not expose stack traces or internal server details.
app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: 'error occurred', error: err.message });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = keyValue ? Object.keys(keyValue)[0] : undefined;
    const value = field ? keyValue[field] : undefined;
    return res.status(409).json({
      message: 'error occurred',
      error: field ? `${field} "${value}" already exists` : 'Duplicate value',
    });
  }

  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ message: 'error occurred', error: err.message });
  }

  console.error('API error:', err);
  return res.status(500).json({ message: 'error occurred', error: 'Server side error' });
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
