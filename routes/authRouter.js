import express from "express";
import { registerNewUser, loginUser, logoutUser } from "../controllers/authControllers.js";

import controllerWrapper from "../decorators/controllerWrapper.js";

import { authSchema } from "../schemas/authSchemas.js";
import { validateBody } from "../decorators/validateBody.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchema), controllerWrapper(registerNewUser));
authRouter.post("/login", validateBody(authSchema), controllerWrapper(loginUser));
authRouter.post("/logout", authMiddleware, controllerWrapper(logoutUser));

export default authRouter;