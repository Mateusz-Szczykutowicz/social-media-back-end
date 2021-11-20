import express from "express";
import UserController from "../controllers/UserController";
import Auth from "../middlewares/AuthMiddleware";
import Verify from "../middlewares/VerifyMiddleware";

const router = express.Router();

router.get("/", Auth.checkToken, Verify.checkUser, UserController.getUserInfo);
router.post("/login", Auth.generateToken, UserController.login);
router.post("/register", UserController.register);
router.get("/logout", Auth.logout);
router.get(
    "/verify",
    Auth.checkToken,
    Verify.generateCode,
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

export default router;
