import UserController from "../controllers/UserController";
import Auth from "../middlewares/AuthMiddleware";
import Verify from "../middlewares/VerifyMiddleware";

import express from "express";
import Mail from "../middlewares/MailMiddleware";
const router = express.Router();

router.get("/", Auth.checkToken, Verify.checkUser, UserController.getUserInfo);
router.post("/login", Auth.generateToken, UserController.login);
router.post("/register", UserController.register);
router.get("/logout", Auth.logout);
router.get(
    "/verify",
    Auth.checkToken,
    Verify.generateCode,
    Mail.sendVerifyMail,
    UserController.getVerify
);
router.patch("/verify", Verify.checkCode, UserController.setVerify);
router.patch(
    "/password",
    Auth.checkToken,
    Verify.checkUser,
    UserController.changePassword
);
router.patch(
    "/email",
    Auth.checkToken,
    Verify.checkUser,
    UserController.changeEmail
);

router.get(
    "/recover",
    Verify.recoverPassword,
    Verify.generateCode,
    Mail.sendRecoverPasswordMail,
    UserController.recoverPassword
);

router.patch(
    "/recover",
    Verify.checkCode,
    UserController.changePasswordWithCode
);

router.delete(
    "/",
    Auth.checkToken,
    Verify.checkUser,
    UserController.deleteAccount
);

export default router;
