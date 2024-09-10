import {
  Body,
  Get,
  JsonController,
  Patch,
  Post,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import { Request, Response } from "express";
import "dotenv/config";
import { UsersService } from "./UsersService";
import { Authenticate } from "app/middlewares/Authenticate";
import { validateBody } from "helpers/validateBody";
import { emailSchema, loginSchema, registerSchema } from "schemas/usersSchema";
import { upload } from "helpers/uploadAvatar";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  verifyEmailAgainTemplate,
  verifyEmailTemplate,
} from "helpers/verifyPresets";
import { sendEmail } from "helpers/sendEmail";
import { ApiError } from "helpers/ApiError";
import { AuthenticateRequest } from "types/auth";
import Jimp from "jimp";

const { SECRET_KEY } = process.env;

const avatarPath = path.resolve("public", "avatars");

const userService = new UsersService();

@JsonController("/users")
export default class Users {
  @UseBefore(validateBody(registerSchema))
  @Post("/register")
  async register(@Req() req: Request, @Res() res: Response) {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);
    if (user) throw new ApiError(409, { message: "Email in use" });

    const avatar = gravatar.url(email, { d: "retro" });

    const hashPassword = await bcrypt.hash(password, 8);

    const verificationToken = uuidv4();

    const newUser = await userService.addUser({
      ...req.body,
      password: hashPassword,
      avatarURL: avatar,
      verificationToken,
    });

    sendEmail(verifyEmailTemplate(email, req, verificationToken));

    return {
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    };
  }

  @UseBefore(validateBody(loginSchema))
  @Post("/login")
  async login(@Req() req: Request, @Res() _res: Response) {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);
    if (!user)
      throw new ApiError(401, { message: "Email or password is wrong" });

    if (!user.verify)
      throw new ApiError(401, { message: "Email is not verified!" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      throw new ApiError(401, { message: "Email or password is wrong" });

    const payload = { id: user._id };

    if (!SECRET_KEY)
      throw new ApiError(500, { message: "Server can't generate token" });

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });

    await userService.updateUser(user.id, { token });

    return {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    };
  }

  @UseBefore(Authenticate)
  @Post("/logout")
  async logout(@Req() req: AuthenticateRequest, @Res() _res: Response) {
    if (!req.user) throw new ApiError(401, { message: "Unauthorized" });

    const { _id } = req.user;
    if (!_id || typeof _id !== "string")
      throw new ApiError(401, { message: "Unauthorized" });

    const user = await userService.updateUser(_id, { token: "" });
    if (!user) throw new ApiError(401, { message: "You already off" });

    throw new ApiError(204, { message: "No Content!" });
  }

  @UseBefore(Authenticate)
  @Post("/current")
  async current(@Req() req: AuthenticateRequest, @Res() _res: Response) {
    if (!req.user) throw new ApiError(401, { message: "Unauthorized" });
    const { email, subscription } = req.user;

    const user = await userService.getUserByEmail(email);
    if (!user) throw new ApiError(401, { message: "Unauthorized" });

    return { email, subscription };
  }

  @UseBefore(Authenticate)
  @UseBefore(upload.single("avatar"))
  @Patch("/avatars")
  async updateAvatar(@Req() req: AuthenticateRequest, @Res() _res: Response) {
    if (!req.user) throw new ApiError(401, { message: "Unauthorized" });

    const { _id } = req.user;

    if (!req.file || !req.file.path) {
      throw new ApiError(400, { message: "Bad request" });
    }

    const { path: oldPath, filename } = req.file;
    const uniqueFilename = `${uuidv4()}${path.extname(filename)}`;
    const newPath = path.join(avatarPath, uniqueFilename);

    try {
      const lenna = await Jimp.read(oldPath);
      lenna.resize(250, 250).write(newPath);

      await fs.rm(oldPath);

      const avatarURL = path.join("avatars", uniqueFilename);

      if (!_id) {
        throw new ApiError(401, { message: "Unauthorized" });
      }

      const userId = _id.toString()
      
      const user = await userService.updateUser(userId, { avatarURL });

      if (!user) {
        throw new ApiError(401, { message: "Unauthorized" });
      }

      return avatarURL;
    } catch (err) {
      throw new ApiError(500, { message: "Internal server error" });
    }
  }

  @Get("/verify/:verificationToken")
  async verify(@Req() req: AuthenticateRequest, @Res() _res: Response) {
    const { verificationToken } = req.params;

    const user = await userService.verifyUser(verificationToken, {
      verificationToken: "",
      verify: true,
    });

    if (!user) throw new ApiError(404, { message: "User not found!" });

    return "Verification successful!";
  }

  @UseBefore(validateBody(emailSchema))
  @Post("/verify")
  async verifyAgain(@Req() req: AuthenticateRequest, @Res() _res: Response) {
    const { email } = req.body;

    const user = await userService.getUserByEmail(email);
    if (!user) throw new ApiError(404, { message: "User not found!" });

    if (user.verify)
      throw new ApiError(200, { message: "User already verified!" });

    sendEmail(verifyEmailAgainTemplate(email, req, user.verificationToken));
    return "Verification token was sent";
  }
}
