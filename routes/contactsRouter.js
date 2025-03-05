import express from "express";
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

contactsRouter.get("/", controllerWrapper(getAllContacts));

contactsRouter.get("/:id", controllerWrapper(getOneContact));

contactsRouter.delete("/:id", controllerWrapper(deleteContact));

contactsRouter.post("/", validateBody(createContactSchema), controllerWrapper(createContact));

contactsRouter.put("/:id", validateBody(updateContactSchema), controllerWrapper(updateContact));

contactsRouter.patch("/:id/favorite", validateBody(updateContactSchema), controllerWrapper(updateStatusContact));

export default contactsRouter;
