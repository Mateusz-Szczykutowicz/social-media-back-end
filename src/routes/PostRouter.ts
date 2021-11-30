import express from "express";
import PostController from "../controllers/PostController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import VerifyMiddleware from "../middlewares/VerifyMiddleware";
const router = express.Router();

//? Get all user's posts
router.get(
    "/",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    PostController.getAllPosts
);

//? Get one user's post
router.get(
    "/id/:id",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    PostController.getOnePost
);

//? Get all other user's post
router.get(
    "/user/:login",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    VerifyMiddleware.isFriend,
    PostController.getAllPostOtherUser
);

router.post(
    "/",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    PostController.createNewPost
);

router.patch(
    "/",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    PostController.modifyPost
);

router.delete(
    "/",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    PostController.deletePost
);

export default router;
