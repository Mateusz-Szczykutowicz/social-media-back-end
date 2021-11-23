import { Request, Response } from "express";

type asyncControllerFunction = (req: Request, res: Response) => Promise<any>;
type syncControllerFunction = (req: Request, res: Response) => Response;

export interface UserControllerI {
    login: asyncControllerFunction;
    register: asyncControllerFunction;
    getUserInfo: asyncControllerFunction;
    getVerify: syncControllerFunction;
    setVerify: asyncControllerFunction;
    changePassword: asyncControllerFunction;
    changeEmail: asyncControllerFunction;
    recoverPassword: asyncControllerFunction;
    changePasswordWithCode: asyncControllerFunction;
}
