import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { Lawyer } from "../models/Lawyer.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import { validate } from "../middleware/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

const searchQuery = z.object({
  q: z.string().trim().max(100).optional(),
  practiceArea: z.string().trim().max(80).optional(),
  state: z.string().trim().max(2).optional(),
  city: z.string().trim().max(80).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["rating", "experience", "newest"]).default("rating"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Public: search approved lawyers
router.get("/", validate({ query: searchQuery }), async (req, res) => {
  const { q, practiceArea, state, city, minRating, sort, page, limit } = req.valid.query;

  const filter = { verificationStatus: "approved" };
  if (practiceArea) filter.practiceAreas = practiceArea;
  if (state) filter.state = state.toUpperCase();
  if (city) filter.city = new RegExp(`^${escapeRegex(city)}$`, "i");
  if (minRating) filter.rating = { $gte: minRating };
  if (q) filter.$text = { $search: q };

  const sortMap = {
    rating: { rating: -1, reviewCount: -1 },
    experience: { experienceYears: -1 },
    newest: { createdAt: -1 },
  };

  const [items, total] = await Promise.all([
    Lawyer.find(filter)
      .select("-barNumber -verificationNote -user")
      .sort(sortMap[sort])
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Lawyer.countDocuments(filter),
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  headline: z.string().trim().max(160).default(""),
  bio: z.string().trim().max(4000).default(""),
  practiceAreas: z.array(z.string().trim().max(80)).max(12).default([]),
  city: z.string().trim().max(80).default(""),
  state: z.string().trim().length(2).toUpperCase().or(z.literal("")).default(""),
  barNumber: z.string().trim().max(40).default(""),
  experienceYears: z.coerce.number().int().min(0).max(80).default(0),
  languages: z.array(z.string().trim().max(40)).max(10).default(["English"]),
  hourlyRate: z.coerce.number().min(0).max(100000).nullable().default(null),
  freeConsultation: z.boolean().default(false),
});

// Lawyer: own profile (declared before "/:slug" so "me" is not treated as a slug)
router.get("/me/profile", requireAuth, requireRole("lawyer"), async (req, res) => {
  const profile = await Lawyer.findOne({ user: req.user.id });
  if (!profile) throw ApiError.notFound("Lawyer profile not found");
  res.json({ profile });
});

router.put(
  "/me/profile",
  requireAuth,
  requireRole("lawyer"),
  validate({ body: profileSchema }),
  async (req, res) => {
    const profile = await Lawyer.findOne({ user: req.user.id });
    if (!profile) throw ApiError.notFound("Lawyer profile not found");

    const data = req.valid.body;
    // a change to credentials sends the profile back through admin review
    const credentialsChanged = data.barNumber !== profile.barNumber || data.state !== profile.state;
    Object.assign(profile, data);
    if (credentialsChanged && profile.verificationStatus === "approved") {
      profile.verificationStatus = "pending";
    }
    await profile.save();
    if (data.name) await User.findByIdAndUpdate(req.user.id, { name: data.name });
    res.json({ profile });
  },
);

// Public: single profile (approved only)
router.get("/:slug", async (req, res) => {
  const lawyer = await Lawyer.findOne({ slug: req.params.slug, verificationStatus: "approved" })
    .select("-barNumber -verificationNote -user")
    .lean();
  if (!lawyer) throw ApiError.notFound("Lawyer not found");
  const reviews = await Review.find({ lawyer: lawyer._id }).sort({ createdAt: -1 }).limit(20).lean();
  res.json({ lawyer, reviews });
});

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).default(""),
});

router.post(
  "/:slug/reviews",
  requireAuth,
  requireRole("client"),
  validate({ body: reviewSchema }),
  async (req, res) => {
    const lawyer = await Lawyer.findOne({ slug: req.params.slug, verificationStatus: "approved" });
    if (!lawyer) throw ApiError.notFound("Lawyer not found");
    const author = await User.findById(req.user.id);

    const existing = await Review.exists({ lawyer: lawyer._id, author: author._id });
    if (existing) throw ApiError.conflict("You have already reviewed this lawyer");

    const review = await Review.create({
      lawyer: lawyer._id,
      author: author._id,
      authorName: author.name,
      ...req.valid.body,
    });

    const [agg] = await Review.aggregate([
      { $match: { lawyer: new mongoose.Types.ObjectId(lawyer._id) } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    lawyer.rating = Math.round(agg.avg * 10) / 10;
    lawyer.reviewCount = agg.count;
    await lawyer.save();

    res.status(201).json({ review });
  },
);

export default router;
