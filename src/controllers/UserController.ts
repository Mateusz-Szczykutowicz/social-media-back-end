import { Request, Response } from "express";
import UserSchema from "../database/Schemas/UserSchema";
import sha256 from "sha256";
import config from "../config";
import { UserControllerI } from "../interfaces/User.interface";

const UserController: UserControllerI = {
    checkUser: async (req, res) => {
        const { id } = req.body;
        const user = await UserSchema.findOne({ id });
        return res.status(200).json({
            message: "user router - user controller",
            status: 200,
            user,
        });
    },
    login: async (req, res) => {
        const { token } = req.body;
        return res.status(200).json({ message: "Success", status: 200, token });
    },
    register: async (req, res) => {
        if (!req.body.login || !req.body.password || !req.body.email) {
            return res.status(400).json({ message: "Wrong data", status: 400 });
        }
        const { login, password, email } = req.body;
        const existUser = await UserSchema.findOne({ login });
        if (existUser) {
            return res.status(409).json({ message: "User exist", status: 409 });
        }
        const passwordWithSalt = sha256(
            `#${password}!${config.secure.password_salt}`
        );
        const user = new UserSchema();
        user.set("login", login);
        user.set("password", passwordWithSalt);
        user.set("email", email);
        const id = sha256(
            `${login}${password}${user.get("_id")}!${Math.random()}`
        );
        user.set("id", id);
        user.save();
        return res.status(201).json({ message: "Added", status: 201 });
    },
    getVerify: (req, res: Response) => {
        const { code } = req.body.secure;
        return res
            .status(200)
            .json({ message: "Code sent", status: 200, code });
    },

    setVerify: async (req, res) => {
        const { id } = req.body.secure;
        const user = await UserSchema.findOne({ id }, "verify");
        user.set("verify", true);
        user.save();
        return res.status(200).json({ message: "OK", status: 200 });
    },
};

export default UserController;
