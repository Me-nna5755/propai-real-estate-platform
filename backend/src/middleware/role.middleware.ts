
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

export const authorize = (...allowedRoles: string[]) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const user = req.user as JwtPayload;
         console.log("USER:", user);
        if (!user || !user.role) {
            return res.status(403).json({
                success: false,
                message: "Insufficient permissions"
            });
        }

        if (!allowedRoles.includes(user.role as string)) {
            return res.status(403).json({
                success: false,
                message: "Insufficient permissions"
            });
        }

        next();
    };
};