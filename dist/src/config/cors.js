import cors from 'cors';
export const corsOptions = {
    origin: [
        'https://xcraft.aadarshm.me/',
        'https://x-post-generator-ruby.vercel.app',
        "http://localhost:5175/dashboard",
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5175'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
export function setupCORS(app) {
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
}
//# sourceMappingURL=cors.js.map