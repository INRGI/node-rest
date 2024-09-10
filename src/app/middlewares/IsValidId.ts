import { isValidObjectId } from "mongoose";
import { ApiError } from "../../helpers/ApiError";
import { NextFunction, Request, Response } from "express";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

@Middleware({ type: "before" })
export class IsValidId implements ExpressMiddlewareInterface {
  use(request: Request, _response: Response, next: NextFunction) {
    const { id } = request.params;
    if (!isValidObjectId(id))
      next(new ApiError(401, { message: "Contact with this id not found!" }));

    next();
  }
};
