import { NextFunction, Request, Response } from 'express';
// @ts-ignore
import { fromNodeHeaders } from "better-auth/node";
import jwt from "jsonwebtoken";
import { auth } from "../auth.js";
import userModel from "../models/user.model.js";

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any; // Replace 'any' with IUser interface if possible, but keep simple for now
        }
    }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // 1. Try Better Auth Session First (Session-based, common for social login)
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (session) {
            // Find the mongoose user to maintain compatibility with existing controllers
            const user = await userModel.findById(session.user.id);
            if (user) {
                req.user = user;
                return next();
            }
        }

        // 2. Try JWT Token (Old system, useful for API keys or legacy login)
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (token) {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            const user = await userModel.findById(decoded.id);

            if (user) {
                req.user = user;
                return next();
            }
        }

        res.status(401).json({ message: "Unauthorized user" });

    } catch (err: any) {
        console.error("Auth Middleware Error:", err.message);
        res.status(401).json({ message: "Unauthorized user" });
    }
};

export default authMiddleware;
