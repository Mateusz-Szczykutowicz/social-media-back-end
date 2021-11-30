import { NextFunction, Request, Response } from "express";
import FriendSchema from "../database/Schemas/FriendSchema";
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

    public async recoverPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (!req.body.login) {
            return res
                .status(400)
                .json({ message: "Login field is empty", status: 400 });
        }
        const { login } = req.body;
        const user = await UserSchema.findOne({ login }, "id");
        req.body.secure = {};
        req.body.secure.id = user.get("id");
        return next();
    }

    public async generateCode(req: Request, res: Response, next: NextFunction) {
        const id = req.body.secure.id;
        const code: number = render(100000, 999999);
        Verify.codes.set(code, id);
        Verify.deleteCode(15, code);
        req.body.secure.code = code;
        return next();
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
        return next();
    }

    public async checkUser(req: Request, res: Response, next: NextFunction) {
        const id = req.body.secure.id;
        const user = await UserSchema.findOne({ id }, "verify");
        if (!user) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }
        if (!user.get("verify")) {
            return res
                .status(403)
                .json({ message: "Verify account", status: 403 });
        }
        return next();
    }

    public async isFriend(req: Request, res: Response, next: NextFunction) {
        const id = req.body.secure.id;
        const { login } = req.params;
        const friend = await UserSchema.findOne({ login });
        if (!friend) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const friendRequest = await FriendSchema.findOne({
            user: id,
            friendId: friend.get("id"),
        });
        if (!friendRequest) {
            req.body.secure.isFriend = false;
            return next();
        }
        if (friendRequest.get("mutualFriend")) {
            req.body.secure.isFriend = true;
        } else {
            req.body.secure.isFriend = false;
        }
        return next();
    }
}

export default new Verify();
