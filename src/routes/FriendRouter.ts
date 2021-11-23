import express from "express";
import FriendController from "../controllers/FriendController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import VerifyMiddleware from "../middlewares/VerifyMiddleware";
const router = express.Router();

router.get(
    "/",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    FriendController.getFriendsList
);
router.get(
    "/request/sent",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    FriendController.getFriendRequestSent
);
router.get(
    "/request/pending",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    FriendController.getFriendRequestPending
);
router.post(
    "/",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    FriendController.addNewFriend
);

router.patch(
    "/request",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    FriendController.acceptUserFriendRequest
);

export default router;
