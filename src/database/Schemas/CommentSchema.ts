import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userFirstName: { type: String, required: true },
    userSecondName: { type: String },
    userLastName: { type: String, required: true },
    userLogin: { type: String, required: true },
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    id: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
    modified: { type: Boolean, default: false },
});

export default mongoose.model("Comment", CommentSchema);
