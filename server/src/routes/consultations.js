import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { Consultation } from "../models/Consultation.js";
import { Lawyer } from "../models/Lawyer.js";
import { validate } from "../middleware/validate.js";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { message: "Too many requests. Please try again later." } },
});

const createSchema = z.object({
  lawyerSlug: z.string().trim().min(1),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: z.string().trim().max(30).default(""),
  message: z.string().trim().min(10, "Please describe your issue in a few words").max(3000),
});

// Public (guests allowed): request a consultation with an approved lawyer
router.post("/", createLimiter, optionalAuth, validate({ body: createSchema }), async (req, res) => {
  const { lawyerSlug, ...data } = req.valid.body;
  const lawyer = await Lawyer.findOne({ slug: lawyerSlug, verificationStatus: "approved" }).select("_id");
  if (!lawyer) throw ApiError.notFound("Lawyer not found");
  const consultation = await Consultation.create({
    ...data,
    lawyer: lawyer._id,
    client: req.user?.role === "client" ? req.user.id : null,
  });
  res.status(201).json({ consultation: { id: consultation._id, status: consultation.status } });
});

// Lawyer: inbox
router.get("/mine", requireAuth, requireRole("lawyer"), async (req, res) => {
  const profile = await Lawyer.findOne({ user: req.user.id }).select("_id");
  if (!profile) throw ApiError.notFound("Lawyer profile not found");
  const items = await Consultation.find({ lawyer: profile._id }).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ items });
});

const statusSchema = z.object({ status: z.enum(["new", "contacted", "closed"]) });

router.patch("/:id/status", requireAuth, requireRole("lawyer"), validate({ body: statusSchema }), async (req, res) => {
  const profile = await Lawyer.findOne({ user: req.user.id }).select("_id");
  if (!profile) throw ApiError.notFound("Lawyer profile not found");
  const item = await Consultation.findOneAndUpdate(
    { _id: req.params.id, lawyer: profile._id }, // ownership check
    { status: req.valid.body.status },
    { new: true },
  );
  if (!item) throw ApiError.notFound("Consultation not found");
  res.json({ consultation: item });
});

export default router;
