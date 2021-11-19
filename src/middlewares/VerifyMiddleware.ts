import { NextFunction, Request, Response } from "express";
import UserSchema from "../database/Schemas/UserSchema";
import { VerifyI } from "../interfaces/Verify.interface";

const render = (min: number, max: number): number => {
    if (min > max) {
        min = max - 1;
    }
    const code: number = Math.floor(Math.random() * (max - min) + min);
    return code;
};

class Verify implements VerifyI {
    private static codes: Map<number, string> = new Map();

    private static deleteCode(time: number, code: number) {
        setTimeout(() => {
            Verify.codes.delete(code);
        }, time * 1000 * 60);
    }

    public async generateCode(req: Request, res: Response, next: NextFunction) {
        const { id } = req.body;
        const code: number = render(100000, 999999);
        Verify.codes.set(code, id);
        Verify.deleteCode(5, code);
        req.body.secure = {};
        req.body.secure.code = code;
        next();
    }

    public async checkCode(req: Request, res: Response, next: NextFunction) {
        if (!req.body.code) {
            return res
                .status(400)
                .json({ message: "Code is empty", status: 400 });
        }
        const code = req.body.code * 1;
        const id = Verify.codes.get(code);
        if (!id) {
            return res
                .status(409)
                .json({ message: "Code is not correct", status: 409 });
        }
        req.body.secure = {};
        req.body.secure.id = id;
        next();
    }

    public async checkUser(req: Request, res: Response, next: NextFunction) {
        const { token } = req.headers;
        const user = await UserSchema.findOne({ token }, "verify");
        if (!user.get("verify")) {
            return res
                .status(403)
                .json({ message: "Verify account", status: 403 });
        }
        next();
    }
}

export default new Verify();
