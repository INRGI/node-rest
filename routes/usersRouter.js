import express from "express";
import validateBody from "../helpers/validateBody.js";
import {loginSchema, registerSchema} from '../schemas/usersSchema.js';
import { current, login, logout, register } from "../controllers/usersControllers.js";
import { authenticate } from '../helpers/authenticate.js';


const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerSchema), register);
usersRouter.post("/login", validateBody(loginSchema), login);
usersRouter.post("/logout", authenticate, logout);
usersRouter.post("/current", authenticate, current);


export default usersRouter;