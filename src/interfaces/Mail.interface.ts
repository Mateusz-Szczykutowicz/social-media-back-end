import { NextFunction, Request, Response } from "express";

export default interface MailI {
    sendRecoverPasswordMail(
        req: Request,
        res: Response,
        next: NextFunction
    ): void;

    sendVerifyMail(req: Request, res: Response, next: NextFunction): void;
}
