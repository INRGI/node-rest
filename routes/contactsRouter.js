import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactStatus,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema, updateContactStatusSchema } from "../schemas/contactsSchemas.js";
import { isValidId } from "../helpers/isValidId.js";
import { authenticate } from '../helpers/authenticate.js';

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, deleteContact);

contactsRouter.post("/", authenticate, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", authenticate, isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.put("/:id/favorite", authenticate, isValidId, validateBody(updateContactStatusSchema), updateContactStatus);

export default contactsRouter;