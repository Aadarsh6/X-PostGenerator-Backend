import cors from 'cors';

const allowedOrigins = [
  'https://xcraft.aadarshm.me',
  'https://x-post-generator-ruby.vercel.app',
  'http://localhost:5173',
];

export const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
};

export function setupCORS(app: any) {
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
}