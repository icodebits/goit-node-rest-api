import express from "express";
import { registerNewUser } from "../controllers/authControllers.js";

import controllerWrapper from "../decorators/controllerWrapper.js";

import { authRegisterSchema } from "../schemas/authSchemas.js";
import { validateBody } from "../decorators/validateBody.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authRegisterSchema), controllerWrapper(registerNewUser));

export default authRouter;