import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { User } from "../models/User.js";
import { Lawyer } from "../models/Lawyer.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/slugify.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/token.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { message: "Too many attempts. Please try again later." } },
});

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  role: z.enum(["client", "lawyer"]).default("client"),
});

const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });

async function uniqueSlug(base) {
  let slug = slugify(base) || "lawyer";
  let n = 1;
  while (await Lawyer.exists({ slug })) slug = `${slugify(base)}-${++n}`;
  return slug;
}

router.post("/register", authLimiter, validate({ body: registerSchema }), async (req, res) => {
  const { name, email, password, role } = req.valid.body;
  if (await User.exists({ email })) throw ApiError.conflict("An account with this email already exists");

  const user = await User.create({ name, email, role, passwordHash: await User.hashPassword(password) });

  if (role === "lawyer") {
    await Lawyer.create({ user: user._id, name, slug: await uniqueSlug(name) }); // starts as "pending"
  }

  setAuthCookie(res, signToken(user));
  res.status(201).json({ user });
});

router.post("/login", authLimiter, validate({ body: loginSchema }), async (req, res) => {
  const { email, password } = req.valid.body;
  const user = await User.findOne({ email }).select("+passwordHash");
  // same message for unknown email and wrong password to avoid user enumeration
  if (!user || !(await user.verifyPassword(password))) throw ApiError.unauthorized("Invalid email or password");
  setAuthCookie(res, signToken(user));
  res.json({ user });
});

router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.status(204).end();
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw ApiError.unauthorized();
  res.json({ user });
});

export default router;
