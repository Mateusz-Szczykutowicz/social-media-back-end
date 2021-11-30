import sha256 from "sha256";
import CommentSchema from "../database/Schemas/CommentSchema";
import PostSchema from "../database/Schemas/PostSchema";
import UserSchema from "../database/Schemas/UserSchema";
import { CommentControllerI } from "../interfaces/Comment.interface";

const CommentController: CommentControllerI = {
    getAllComments: async (req, res) => {
        const id = req.body.secure.id;
        const comments = await CommentSchema.find({ userId: id });
        return res
            .status(200)
            .json({ message: "Comments", status: 200, comments });
    },
    getPostAllComments: async (req, res) => {
        const postId = req.params.id;
        const comments = await CommentSchema.find({ postId });
        return res.status(200).json({ message: "Post's comments", comments });
    },
    createNewComment: async (req, res) => {
        const id = req.body.secure.id;
        if (!req.body.postId || !req.body.content) {
            return res.status(400).json({
                message: "Post ID or content field is empty",
                status: 400,
            });
        }
        const { postId, content } = req.body;
        const post = await PostSchema.findOne({ id: postId });
        if (!post) {
            return res
                .status(404)
                .json({ message: "Post does not exist", status: 404 });
        }
        const user = await UserSchema.findOne({ id });
        const comment = new CommentSchema();

        comment.set("userFirstName", user.get("firstname"));
        comment.set("userSecondName", user.get("secondname"));
        comment.set("userLastName", user.get("lastname"));
        comment.set("userLogin", user.get("login"));
        comment.set("userId", user.get("id"));
        comment.set("postId", postId);
        comment.set("content", content);
        comment.set(
            "id",
            sha256(`#${user.get("id")}!${Math.random()}+${postId}`)
        );
        comment.save();
        return res.status(201).json({ message: "Comment added", status: 201 });
    },
    modifyComment: async (req, res) => {
        const userId = req.body.secure.id;
        if (!req.body.id || !req.body.content) {
            return res
                .status(400)
                .json({ message: "ID or conent field is empty", status: 400 });
        }
        const { id, content } = req.body;
        const comment = await CommentSchema.findOne({ id, userId });
        comment.set("content", content);
        comment.set("modifiedAt", new Date());
        comment.set("modified", true);
        comment.save();
        return res.status(200).json({ message: "Comment edited", status: 200 });
    },
    deleteComment: async (req, res) => {
        const userId = req.body.secure.id;
        if (!req.body.id) {
            return res
                .status(400)
                .json({ message: "ID  field is empty", status: 400 });
        }
        const { id } = req.body;
        await CommentSchema.deleteOne({ id, userId });
        return res
            .status(200)
            .json({ message: "Comment deleted", status: 200 });
    },
};

export default CommentController;
