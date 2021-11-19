import { Request, response, Response } from "express";

type asyncControllerFunction = (req: Request, res: Response) => Promise<any>;
type syncControllerFunction = (req: Request, res: Response) => Response;

export interface UserControllerI {
    login: asyncControllerFunction;
    register: asyncControllerFunction;
    checkUser: asyncControllerFunction;
    getVerify: syncControllerFunction;
    setVerify: asyncControllerFunction;
}