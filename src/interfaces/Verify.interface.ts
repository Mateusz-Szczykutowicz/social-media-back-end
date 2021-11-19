import { NextFunction, Request, Response } from "express";

type middlewareFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

export interface VerifyI {
    generateCode(req: Request, res: Response, next: NextFunction): void;
}
