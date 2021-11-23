import { Request, Response } from "express";

type asyncControllerFunction = (req: Request, res: Response) => Promise<any>;
type syncControllerFunction = (req: Request, res: Response) => Response;

export interface FriendControllerI {
    getFriendsList: asyncControllerFunction;
    addNewFriend: asyncControllerFunction;
    getFriendRequestSent: asyncControllerFunction;
    getFriendRequestPending: asyncControllerFunction;
    acceptUserFriendRequest: asyncControllerFunction;
    deleteFriend: asyncControllerFunction;
    declineRequest: asyncControllerFunction;
}
