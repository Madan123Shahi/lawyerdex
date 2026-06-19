import express from "express";
const router = express.Router();
import {
  getLawyers,
  getLawyer,
  getFeaturedLawyers,
  getCategories,
} from "../controllers/lawyerController.js";
import { validateQuery } from "../middleware/validateMiddleware.js";
import { lawyerSearchSchema } from "../../../shared/schemas/lawyerValidators.js";

router.get("/", validateQuery(lawyerSearchSchema), getLawyers);
router.get("/featured", getFeaturedLawyers);
router.get("/categories", getCategories);
router.get("/:id", getLawyer);

export default router;
