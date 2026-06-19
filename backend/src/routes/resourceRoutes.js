import express from "express";
const router = express.Router();
import {
  getResources,
  getResource,
  getLatestResources,
} from "../controllers/resourceController.js";

router.get("/", getResources);
router.get("/latest", getLatestResources);
router.get("/:slug", getResource);

export default router;
