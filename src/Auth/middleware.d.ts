import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/index.js";
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=middleware.d.ts.map