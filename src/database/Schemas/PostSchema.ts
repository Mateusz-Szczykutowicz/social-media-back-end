import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userFirstName: { type: String, required: true },
    userSecondName: { type: String },
    userLastName: { type: String, required: true },
    userLogin: { type: String, required: true },
    userId: { type: String, required: true },
    id: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    modifiedAt: { type: Date, default: new Date() },
    modified: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: true },
});

export default mongoose.model("Post", PostSchema);
