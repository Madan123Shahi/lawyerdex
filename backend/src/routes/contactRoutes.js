import express from "express";
const router = express.Router();
import { submitContact } from "../controllers/contactController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { contactSchema } from "../../../shared/schemas/lawyerValidators.js";

router.post("/", validate(contactSchema), submitContact);
export default router;
