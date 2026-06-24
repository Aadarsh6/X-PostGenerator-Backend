import type { Request, Response, NextFunction } from 'express';

interface RequestData {
  ip: string;
  times: number[];
}

const requestCounts: Map<string, RequestData> = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 20;

setInterval(() => {
  const now = Date.now();
  for (const [ip, requests] of requestCounts.entries()) {
    const recentRequests = requests.times.filter(time => now - time < RATE_LIMIT_WINDOW);
    if (recentRequests.length === 0) {
      requestCounts.delete(ip);
    } else {
      requests.times = recentRequests;
    }
  }
}, RATE_LIMIT_WINDOW);

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!requestCounts.has(clientIp)) {
    requestCounts.set(clientIp, { ip: clientIp, times: [] });
  }
  
  const requestData = requestCounts.get(clientIp)!;
  const recentRequests = requestData.times.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait before making another request.',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
    });
  }
  
  recentRequests.push(now);
  requestData.times = recentRequests;
  requestCounts.set(clientIp, requestData);
  
  next();
}