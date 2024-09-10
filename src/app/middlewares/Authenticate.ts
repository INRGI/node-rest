import { UsersService } from "app/domain/users/UsersService";
import "dotenv/config";
import { NextFunction, Response } from "express";
import { ApiError } from "helpers/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { AuthenticateRequest } from "types/auth";

const userService = new UsersService();

const { SECRET_KEY } = process.env;

@Middleware({ type: "before" })
export class Authenticate implements ExpressMiddlewareInterface {
  async use(
    request: AuthenticateRequest,
    _response: Response,
    next: NextFunction
  ): Promise<void> {
    const { authorization = "" } = request.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer")
      next(new ApiError(401, { message: "Unauthorized" }));

    try {
      if(!SECRET_KEY) throw new ApiError(500, {message: 'Server Error'})
      const { id } = jwt.verify(token, SECRET_KEY) as JwtPayload;
      const user = await userService.getUserById(id);

      if (!user || !user.token || user.token !== token)
        return next(new ApiError(401, { message: "Unauthorized" }));

      request.user = user;
      next();
    } catch (err) {
      throw new ApiError(401, { message: "Unauthorized" });
    }
  }
};