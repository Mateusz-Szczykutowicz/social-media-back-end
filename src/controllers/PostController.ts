import sha256 from "sha256";
import PostSchema from "../database/Schemas/PostSchema";
import UserSchema from "../database/Schemas/UserSchema";
import { PostControllerI } from "../interfaces/Post.interface";

const PostController: PostControllerI = {
    getAllPosts: async (req, res) => {
        const id = req.body.secure.id;
        const posts = await PostSchema.find({ userId: id });
        return res
            .status(200)
            .json({ message: "All user's posts", status: 200, posts });
    },
    getOnePost: async (req, res) => {
        const userId = req.body.secure.id;
        const { id } = req.params;
        const posts = await PostSchema.findOne({ userId, id });
        return res
            .status(200)
            .json({ message: "All user's posts", status: 200, posts });
    },
    getAllPostOtherUser: async (req, res) => {
        const isFriend = req.body.secure.isFriend;
        const { login } = req.params;
        let posts;
        const user = await UserSchema.findOne({ login });
        if (isFriend) {
            posts = await PostSchema.find({ userId: user.get("id") });
        } else {
            posts = await PostSchema.find({
                userId: user.get("id"),
                isPrivate: false,
            });
        }
        return res
            .status(200)
            .json({ message: "User's posts", status: 200, posts });
    },
    createNewPost: async (req, res) => {
        const id = req.body.secure.id;
        if (!req.body.content || !req.body.isPrivate) {
            return res.status(400).json({
                message: "Content or private field is empty",
                status: 400,
            });
        }
        const { content } = req.body;
        let isPrivate = true;
        if (req.body.isPrivate === "false") {
            isPrivate = false;
        }
        const user = await UserSchema.findOne({ id });
        const post = new PostSchema();

        post.set("userFirstName", user.get("firstname"));
        post.set("userSecondName", user.get("secondname") || "");
        post.set("userLastName", user.get("lastname"));
        post.set("userLogin", user.get("login"));
        post.set("userId", user.get("id"));
        post.set("id", sha256(`#${user.get("id")}!${Math.random()}`));
        post.set("content", content);
        post.set("isPrivate", isPrivate);

        post.save();
        return res.status(201).json({ message: "Post created", status: 201 });
    },
    modifyPost: async (req, res) => {
        const userId = req.body.secure.id;
        if (!req.body.content || !req.body.id) {
            return res
                .status(400)
                .json({ message: "Content or id field is empty", status: 400 });
        }
        const { content, id } = req.body;
        const post = await PostSchema.findOne({ userId, id });
        post.set("content", content);
        post.set("modified", true);
        post.set("modifiedAt", new Date());
        post.save();
        return res.status(200).json({ message: "Post modified", status: 200 });
    },

    deletePost: async (req, res) => {
        const userId = req.body.secure.id;
        if (!req.body.id) {
            return res
                .status(400)
                .json({ message: "Id field is empty", status: 400 });
        }
        const { id } = req.body;
        await PostSchema.deleteOne({ userId, id });
        return res.status(200).json({ message: "Post deleted", status: 200 });
    },
};

export default PostController;
