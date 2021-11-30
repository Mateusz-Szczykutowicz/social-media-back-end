import { Request, Response } from "express";

type asyncControllerFunction = (req: Request, res: Response) => Promise<any>;
type syncControllerFunction = (req: Request, res: Response) => Response;

export interface CommentControllerI {
    getAllComments: asyncControllerFunction;
    createNewComment: asyncControllerFunction;
    getPostAllComments: asyncControllerFunction;
    modifyComment: asyncControllerFunction;
    deleteComment: asyncControllerFunction;
}
