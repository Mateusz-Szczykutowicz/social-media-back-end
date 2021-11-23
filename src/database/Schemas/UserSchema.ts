import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    secondname: { type: String },
    lastname: { type: String, required: true },
    login: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    id: { type: String, required: true },
    verify: { type: Boolean, default: false },
});

export default mongoose.model("User", UserSchema);
