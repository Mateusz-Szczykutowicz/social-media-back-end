import sha256 from "sha256";
import config from "../config";
import UserSchema from "../database/Schemas/UserSchema";
import { AuthI } from "../interfaces/auth.interface";

const Auth: AuthI = {
    tokens: new Map(),
    generateToken: async (req, res, next) => {
        if (!req.body.login || !req.body.password) {
            return res
                .status(400)
                .json({ message: "Body is empty", status: 400 });
        }
        const { login, password } = req.body;
        const passwordWithSalt = sha256(
            `#${password}!${config.secure.password_salt}`
        );
        const user = await UserSchema.findOne(
            { login, password: passwordWithSalt },
            "id"
        );
        if (!user) {
            return res
                .status(406)
                .json({ message: "Login or password is wrong", status: 406 });
        }
        const id = user.get("id");
        const token = sha256(
            `$!${Math.random()}+${id}-!${config.secure.token_salt}`
        );
        Auth.tokens.set(token, id);
        req.body.token = token;
        Auth.clearToken(token, 30);
        next();
    },
    checkToken: (req, res, next) => {
        if (!req.headers.token) {
            return res
                .status(400)
                .json({ message: "Token is not exist", status: 400 });
        }
        const token = req.headers.token || "";
        if (!Auth.tokens.get(token)) {
            return res
                .status(401)
                .json({ message: "You must log in", status: 401 });
        }
        req.body.id = Auth.tokens.get(token);
        next();
    },
    clearToken: (token, time) => {
        setTimeout(() => {
            Auth.tokens.delete(token);
        }, time * 1000 * 60);
    },
    logout: (req, res, next) => {
        if (!req.headers.token) {
            return res
                .status(400)
                .json({ message: "Token is not exist", status: 400 });
        }
        const token = req.headers.token || "";
        if (!Auth.tokens.get(token)) {
            return res
                .status(400)
                .json({ message: "You no longer log in", status: 400 });
        }
        Auth.tokens.delete(token);
        return res
            .status(200)
            .json({ message: "Success log out", status: 200 });
    },
};

export default Auth;
