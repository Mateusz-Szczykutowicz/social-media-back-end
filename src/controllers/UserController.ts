import { Request, Response } from "express";
import UserSchema from "../database/Schemas/UserSchema";
import sha256 from "sha256";
import config from "../config";
import { UserControllerI } from "../interfaces/User.interface";

const UserController: UserControllerI = {
    getUserInfo: async (req, res) => {
        const { id } = req.body.secure;
        const user = await UserSchema.findOne({ id }, "login email");
        return res.status(200).json({
            message: "User info",
            status: 200,
            user,
        });
    },
    login: async (req, res) => {
        const { token } = req.body.secure;
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
    getVerify: (req, res) => {
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
    changePassword: async (req, res) => {
        if (!req.body.password || !req.body.newPassword) {
            return res.status(400).json({
                message: "Password or new password field is empty",
                status: 400,
            });
        }
        const { password, newPassword } = req.body;
        const id = req.body.secure.id;
        const user = await UserSchema.findOne({ id }, "password");
        const hashPass = sha256(`#${password}!${config.secure.password_salt}`);
        const newHashPass = sha256(
            `#${newPassword}!${config.secure.password_salt}`
        );
        if (user.get("password") === hashPass) {
            user.set("password", newHashPass);
            user.save();
        } else {
            return res
                .status(406)
                .json({ message: "Wrong password", status: 406 });
        }
        return res
            .status(200)
            .json({ message: "Password updated", status: 200 });
    },
    changeEmail: async (req, res) => {
        if (!req.body.email) {
            res.status(400).json({
                message: "Email field is empty",
                status: 400,
            });
        }
        const email = req.body.email;
        const id = req.body.secure.id;
        const user = await UserSchema.findOne({ id }, "email");
        user.set("email", email);
        user.save();
        return res.status(200).json({ message: "Email updated", status: 200 });
    },
};

export default UserController;
