import { NextFunction, Request, Response } from "express";

type middlewareFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

export interface VerifyI {
    // codes: Map<number, string>;
    generateCode(req: Request, res: Response, next: NextFunction): void;
    checkCode(req: Request, res: Response, next: NextFunction): void;
    checkUser(req: Request, res: Response, next: NextFunction): void;
    recoverPassword(req: Request, res: Response, next: NextFunction): void;
    isFriend(req: Request, res: Response, next: NextFunction): void;
}
