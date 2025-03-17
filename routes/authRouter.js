import express from "express";
import {
    registerNewUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateAvatar,
    verifyEmail,
    resendVerifyEmail
} from "../controllers/authControllers.js";

import controllerWrapper from "../decorators/controllerWrapper.js";

import { authSchema, verifySchema } from "../schemas/authSchemas.js";
import { validateBody } from "../decorators/validateBody.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchema), controllerWrapper(registerNewUser));
authRouter.post("/login", validateBody(authSchema), controllerWrapper(loginUser));
authRouter.post("/logout", authMiddleware, controllerWrapper(logoutUser));
authRouter.get("/current", authMiddleware, controllerWrapper(getCurrentUser));
authRouter.patch("/avatars", authMiddleware, upload.single("avatar"), controllerWrapper(updateAvatar));
authRouter.get("/verify/:verificationToken", controllerWrapper(verifyEmail));
authRouter.post("/verify", validateBody(verifySchema), controllerWrapper(resendVerifyEmail));

export default authRouter;