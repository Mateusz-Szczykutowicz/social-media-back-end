import { NextFunction, Request, Response } from "express";
import UserSchema from "../database/Schemas/UserSchema";
import { VerifyI } from "../interfaces/Verify.interface";

class Verify implements VerifyI {
    async generateCode(req: Request, res: Response, next: NextFunction) {
        if (!req.body.email) {
            return res
                .status(400)
                .json({ message: "Email is empty", status: 400 });
        }
        const { email } = req.body;
        const users = await UserSchema.find({ email });
        console.log("user :>> ", users);
        next();
    }
}

export default new Verify();
