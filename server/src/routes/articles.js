import { Router } from "express";
import { z } from "zod";
import { Article } from "../models/Article.js";
import { validate } from "../middleware/validate.js";
import { ApiError } from "../utils/ApiError.js";

const router = Router();

const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(30).default(9),
});

router.get("/", validate({ query: listQuery }), async (req, res) => {
  const { page, limit } = req.valid.query;
  const [items, total] = await Promise.all([
    Article.find().select("-content").sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Article.countDocuments(),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug }).lean();
  if (!article) throw ApiError.notFound("Article not found");
  res.json({ article });
});

export default router;
