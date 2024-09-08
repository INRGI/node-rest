import express from "express";
import validateBody from "../helpers/validateBody.js";
import {emailSchema, loginSchema, registerSchema} from '../schemas/usersSchema.js';
import { current, login, logout, register, updateAvatar, verify, verifyAgain } from "../controllers/usersControllers.js";
import { authenticate } from '../helpers/authenticate.js';
import { upload } from "../helpers/uploadAvatar.js";


const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), register);
usersRouter.post("/login", validateBody(loginSchema), login);
usersRouter.post("/logout", authenticate, logout);
usersRouter.post("/current", authenticate, current);
usersRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

usersRouter.get("/verify/:verificationToken", verify);
usersRouter.post("/verify", validateBody(emailSchema), verifyAgain);


export default usersRouter;