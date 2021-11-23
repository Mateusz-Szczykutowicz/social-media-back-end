import FriendSchema from "../database/Schemas/FriendSchema";
import UserSchema from "../database/Schemas/UserSchema";
import { FriendControllerI } from "../interfaces/Friend.interface";

const FriendController: FriendControllerI = {
    getFriendsList: async (req, res) => {
        const id = req.body.secure.id;
        const friendList = await FriendSchema.find({
            user: id,
            mutualFriend: true,
        });
        return res
            .status(200)
            .json({ message: "Friend list", status: 200, friendList });
    },
    addNewFriend: async (req, res) => {
        if (!req.body.login) {
            return res
                .status(400)
                .json({ message: "Friend's login field is empty" });
        }
        const { login } = req.body;
        const userId = req.body.secure.id;
        const friend = await UserSchema.findOne({ login });
        if (!friend) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }
        if (
            await FriendSchema.findOne({
                user: userId,
                friend: friend.get("id"),
            })
        ) {
            return res
                .status(409)
                .json({ message: "Request already sent", status: 409 });
        }
        const friendUserRequest = await FriendSchema.findOne({
            user: friend.get("id"),
            friend: userId,
        });
        const friendRequest = new FriendSchema();

        friendRequest.set("user", userId);
        friendRequest.set("friend", friend.get("id"));

        if (friendUserRequest) {
            friendUserRequest.set("mutualFriend", true);
            friendRequest.set("mutualFriend", true);
            friendUserRequest.save();
            friendRequest.save();
            return res
                .status(200)
                .json({ message: "Friend request accepted", status: 200 });
        }
        friendRequest.save();
        return res
            .status(201)
            .json({ message: "Friend request sent", status: 201 });
    },
    getFriendRequestSent: async (req, res) => {
        const id = req.body.secure.id;
        console.log("id :>> ", id);
        const friendList = await FriendSchema.find({
            user: id,
            mutualFriend: false,
        });
        return res.status(200).json({
            message: "Friend request - sent",
            status: 200,
            friendList,
        });
    },
    getFriendRequestPending: async (req, res) => {
        const id = req.body.secure.id;
        console.log("id :>> ", id);
        const friendList = await FriendSchema.find({
            friend: id,
            mutualFriend: false,
        });
        console.log("friendList :>> ", friendList);
        return res.status(200).json({
            message: "Friend request - pending",
            status: 200,
            friendList,
        });
    },
    acceptUserFriendRequest: async (req, res) => {
        if (!req.body.login) {
            return res
                .status(400)
                .json({ message: "Login field is empty", status: 400 });
        }
        const { login } = req.body;
        const friend = await UserSchema.findOne({ login });
        const friendId = friend.get("id");
        const userId = req.body.secure.id;
        const friendRequest = await FriendSchema.findOne({
            friend: userId,
            user: friendId,
        });
        if (!friendRequest) {
            return res.status(406).json({
                message: "Cannot accept request, send friend request",
                status: 406,
            });
        }
        const userFriendRequest = new FriendSchema();
        userFriendRequest.set("user", userId);
        userFriendRequest.set("friend", friendId);
        userFriendRequest.set("mutualFriend", true);
        userFriendRequest.save();
        friendRequest.set("mutualFriend", true);
        friendRequest.save();
        return res
            .status(200)
            .json({ message: "Friend request accepted", status: 200 });
    },
    deleteFriend: async (req, res) => {
        if (!req.body.login) {
            return res
                .status(400)
                .json({ message: "Login field is empty", status: 400 });
        }
        const { login } = req.body;
        const userId = req.body.secure.id;
        const friend = await UserSchema.findOne({ login });
        const friendId = friend.get("id");
        await FriendSchema.deleteOne({
            user: userId,
            friend: friendId,
        });
        await FriendSchema.deleteOne({
            friend: userId,
            user: friendId,
        });
        return res.status(200).json({ message: "Friend deleted", status: 200 });
    },
    declineRequest: async (req, res) => {
        if (!req.body.login) {
            return res
                .status(400)
                .json({ message: "Login field is empty", status: 400 });
        }
        const { login } = req.body;
        const userId = req.body.secure.id;
        const friend = await UserSchema.findOne({ login });
        const friendId = friend.get("id");
        await FriendSchema.deleteOne({
            user: friendId,
            friend: userId,
        });
        return res
            .status(200)
            .json({ message: "Friend request declined", status: 200 });
    },
};

export default FriendController;
