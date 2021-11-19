import { NextFunction, Request, Response } from "express";

type middlewareFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;
type clearToken = (token: string, time: number) => void;

export interface AuthI {
    tokens: Map<string | string[], string>;
    generateToken: middlewareFunction;
    checkToken: middlewareFunction;
    clearToken: clearToken;
    logout: middlewareFunction;
}
