import express from "express";
import validateBody from "../helpers/validateBody.js";
import {loginSchema, registerSchema} from '../schemas/usersSchema.js';
import { current, login, logout, register, updateAvatar } from "../controllers/usersControllers.js";
import { authenticate } from '../helpers/authenticate.js';
import { upload } from "../helpers/uploadAvatar.js";


const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), register);
usersRouter.post("/login", validateBody(loginSchema), login);
usersRouter.post("/logout", authenticate, logout);
usersRouter.post("/current", authenticate, current);
usersRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);


export default usersRouter;