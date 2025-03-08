import { Request,Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    user: {
        id: string;
    }
}

export type AuthHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => Promise<void> | void;