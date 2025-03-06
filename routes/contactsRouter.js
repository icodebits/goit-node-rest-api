import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import controllerWrapper from "../decorators/controllerWrapper.js";

import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import { validateBody } from "../decorators/validateBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, controllerWrapper(getAllContacts));

contactsRouter.get("/:id", authMiddleware, controllerWrapper(getOneContact));

contactsRouter.delete("/:id", authMiddleware, controllerWrapper(deleteContact));

contactsRouter.post("/", authMiddleware, validateBody(createContactSchema), controllerWrapper(createContact));

contactsRouter.put("/:id", authMiddleware, validateBody(updateContactSchema), controllerWrapper(updateContact));

contactsRouter.patch("/:id/favorite", authMiddleware, validateBody(updateContactSchema), controllerWrapper(updateStatusContact));

export default contactsRouter;
