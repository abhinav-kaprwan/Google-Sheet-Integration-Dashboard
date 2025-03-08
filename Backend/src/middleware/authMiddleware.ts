import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';


export const authMiddleware = (req:Request, res:Response, next:NextFunction):void=>{
    try {
        const token = req.cookies.token;
        if(!token){
             res.status(401).json({message:"Unauthorized"});
             return;
            }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        (req as any).user = { id: decoded.userId };
        next();
    } catch (error) {
        console.error('Token verification error:', error); // Debug log
        res.status(403).json({ message: "Invalid or expired token" });
        return;
    }
}

