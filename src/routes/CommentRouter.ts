import express from "express";
import CommentController from "../controllers/CommentController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import VerifyMiddleware from "../middlewares/VerifyMiddleware";
const router = express.Router();

router.get(
    "/",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    CommentController.getAllComments
);

router.get(
    "/post/:id",
    // AuthMiddleware.checkToken,
    // VerifyMiddleware.checkUser,
    CommentController.getPostAllComments
);

router.post(
    "/",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    CommentController.createNewComment
);

router.patch(
    "/",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    CommentController.modifyComment
);

router.delete(
    "/",
    AuthMiddleware.checkToken,
    VerifyMiddleware.checkUser,
    CommentController.deleteComment
);

export default router;
