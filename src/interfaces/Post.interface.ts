import { Request, Response } from "express";

type asyncControllerFunction = (req: Request, res: Response) => Promise<any>;
type syncControllerFunction = (req: Request, res: Response) => Response;

export interface PostControllerI {
    getAllPosts: asyncControllerFunction;
    getOnePost: asyncControllerFunction;
    getAllPostOtherUser: asyncControllerFunction;
    createNewPost: asyncControllerFunction;
    modifyPost: asyncControllerFunction;
    deletePost: asyncControllerFunction;
}
