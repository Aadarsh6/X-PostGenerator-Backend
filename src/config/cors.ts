import cors from 'cors';

export const corsOptions: cors.CorsOptions = {
  origin: [
    'https://xcraft.aadarshm.me/',
    'https://x-post-generator-ruby.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

export function setupCORS(app: any) {
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
}