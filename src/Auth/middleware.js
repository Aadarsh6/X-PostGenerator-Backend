import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "User not authorized" });
    }
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verify.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token, please log in again",
            ...(env.NODE_ENV === 'development' && { error })
        });
    }
};
//# sourceMappingURL=middleware.js.map