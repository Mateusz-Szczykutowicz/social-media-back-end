import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
    user: { type: String, required: true },
    friend: { type: String, required: true },
    mutualFriend: { type: Boolean, default: false },
});

export default mongoose.model("Friend", FriendSchema);
