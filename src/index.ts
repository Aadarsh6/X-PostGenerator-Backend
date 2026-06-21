import express from 'express';
import 'dotenv/config';
import { setupCORS } from './config/cors.js';
import { env } from './config/env.js';
import apiRoutes from './routes/api.js';
import { requestLogger } from './middlewar/logger.js';
import { rateLimitMiddleware } from './middlewar/rateLimit.js';
import authRoutes from './Auth/auth.route.js';

const app = express();
const PORT = env.PORT;

setupCORS(app);

app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);
app.use(rateLimitMiddleware);

app.use('/api', apiRoutes);
app.use('/auth', authRoutes)

app.use('*', (req: any, res: any) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/generate-post',
      'POST /auth/signup',
      'POST /auth/login'
    ]
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 X Post Generator running on port ${PORT}`);
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log('🔑 Key loaded:', env.GEMINI_API_KEY ? `${env.GEMINI_API_KEY.slice(0,6)}...` : 'MISSING');
  console.log(`📡 API: http://localhost:${PORT}/api/generate-post`);
  console.log(`🤖 Model: gemini-flash-latest`);
  console.log(`🛡️ Rate limiting: 5 requests/minute`);
});

export default app;