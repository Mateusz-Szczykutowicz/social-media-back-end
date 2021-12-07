import FriendSchema from "../database/Schemas/FriendSchema";
import UserSchema from "../database/Schemas/UserSchema";
import { FriendControllerI } from "../interfaces/Friend.interface";

const FriendController: FriendControllerI = {
    getFriendsList: async (req, res) => {
        const id = req.body.secure.id;
        const friendList = await FriendSchema.find(
            {
                user: id,
                mutualFriend: true,
            },
            "friendFirstName friendSecondName friendLastName login"
        );
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
        const user = await UserSchema.findOne({ id: userId });

        if (!friend) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }

        if (friend.get("login") === user.get("login")) {
            return res
                .status(409)
                .json({ message: "You cannot invite yourself", status: 409 });
        }

        if (
            await FriendSchema.findOne({
                user: userId,
                friendId: friend.get("id"),
                isSent: false,
            })
        ) {
            return res
                .status(406)
                .json({ message: "Request already sent", status: 406 });
        }

        const friendUserRequest = await FriendSchema.findOne({
            user: userId,
            friendId: friend.get("id"),
            isSent: true,
        });

        if (friendUserRequest) {
            const friendRequest = await FriendSchema.findOne({
                user: friend.get("id"),
                friendId: userId,
                isSent: false,
            });
            friendUserRequest.set("mutualFriend", true);
            friendRequest.set("mutualFriend", true);
            friendUserRequest.save();
            friendRequest.save();
            return res
                .status(200)
                .json({ message: "Friend request accepted", status: 200 });
        } else {
            const friendRequest = new FriendSchema();
            const friendUserRequest = new FriendSchema();
            friendRequest.set("user", userId);
            friendRequest.set("friendId", friend.get("id"));
            friendRequest.set("friendFirstName", friend.get("firstname"));
            friendRequest.set("friendSecondName", friend.get("secondname"));
            friendRequest.set("friendLastName", friend.get("lastname"));
            friendRequest.set("friendLogin", login);

            friendUserRequest.set("user", friend.get("id"));
            friendUserRequest.set("friendId", userId);
            friendUserRequest.set("friendFirstName", user.get("firstname"));
            friendUserRequest.set("friendSecondName", user.get("secondname"));
            friendUserRequest.set("friendLastName", user.get("lastname"));
            friendUserRequest.set("friendLogin", user.get("login"));
            friendUserRequest.set("isSent", true);

            friendUserRequest.save();
            friendRequest.save();
        }

        return res
            .status(201)
            .json({ message: "Friend request sent", status: 201 });
    },

    getFriendRequestSent: async (req, res) => {
        const id = req.body.secure.id;
        const friendList = await FriendSchema.find(
            {
                user: id,
                mutualFriend: false,
                isSent: false,
            },
            "friendFirstName friendSecondName friendLastName friendLogin"
        );
        return res.status(200).json({
            message: "Friend request - sent",
            status: 200,
            friendList,
        });
    },
    getFriendRequestPending: async (req, res) => {
        const id = req.body.secure.id;
        const friendList = await FriendSchema.find(
            {
                user: id,
                mutualFriend: false,
                isSent: true,
            },
            "friendFirstName friendSecondName friendLastName friendLogin"
        );
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
        if (!friend) {
            return res
                .status(404)
                .json({ message: "User does not exist", status: 404 });
        }

        const friendId = friend.get("id");
        const userId = req.body.secure.id;
        const friendRequest = await FriendSchema.findOne({
            user: userId,
            friendId: friendId,
            isSent: true,
        });
        if (!friendRequest) {
            return res.status(404).json({
                message: "Request does not exist",
                status: 404,
            });
        }
        const userFriendRequest = await FriendSchema.findOne({
            frienId: userId,
            user: friendId,
            isSent: false,
        });
        userFriendRequest.set("mutualFriend", true);
        friendRequest.set("mutualFriend", true);
        userFriendRequest.save();
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
            friendId: friendId,
            mutualFriend: true,
        });
        await FriendSchema.deleteOne({
            friendId: userId,
            user: friendId,
            mutualFriend: true,
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
            mutualFriend: false,
        });
        await FriendSchema.deleteOne({
            user: userId,
            friendId: friendId,
            mutualFriend: false,
        });
        return res
            .status(200)
            .json({ message: "Friend request declined", status: 200 });
    },
};

export default FriendController;
