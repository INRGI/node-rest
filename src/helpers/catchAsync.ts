import { NextFunction, Request, Response } from "express";

type AsyncHandler<T> = (req: Request, res: Response, next: NextFunction) => Promise<T>;

export const catchAsync = <T>(fn: AsyncHandler<T>) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => next(err));
};