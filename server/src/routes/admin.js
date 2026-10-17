import { Router } from "express";
import { z } from "zod";
import { Lawyer } from "../models/Lawyer.js";
import { validate } from "../middleware/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();
router.use(requireAuth, requireRole("admin"));

const listQuery = z.object({ status: z.enum(["pending", "approved", "rejected"]).default("pending") });

router.get("/lawyers", validate({ query: listQuery }), async (req, res) => {
  const items = await Lawyer.find({ verificationStatus: req.valid.query.status }).sort({ updatedAt: -1 }).lean();
  res.json({ items });
});

const decisionSchema = z.object({
  status: z.enum(["approved", "rejected", "pending"]),
  note: z.string().trim().max(500).default(""),
});

router.patch("/lawyers/:id/verification", validate({ body: decisionSchema }), async (req, res) => {
  const { status, note } = req.valid.body;
  const lawyer = await Lawyer.findById(req.params.id);
  if (!lawyer) throw ApiError.notFound("Lawyer not found");
  if (status === "approved" && (!lawyer.barNumber || !lawyer.state)) {
    throw ApiError.badRequest("Cannot approve a profile without a bar number and state");
  }
  lawyer.verificationStatus = status;
  lawyer.verificationNote = note;
  lawyer.verifiedAt = status === "approved" ? new Date() : undefined;
  await lawyer.save();
  res.json({ lawyer });
});

export default router;
