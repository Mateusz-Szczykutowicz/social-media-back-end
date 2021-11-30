import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
    user: { type: String, required: true },
    friendId: { type: String, required: true },
    friendFirstName: { type: String, required: true },
    friendSecondName: { type: String, default: "" },
    friendLastName: { type: String, required: true },
    friendLogin: { type: String, required: true },
    mutualFriend: { type: Boolean, default: false },
    isSent: { type: Boolean, default: false },
});

export default mongoose.model("Friend", FriendSchema);
