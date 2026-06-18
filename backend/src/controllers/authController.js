// controllers/authController.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { asyncHandler, AppError } from "../utils/appError.js";

// ─── Token Helpers ────────────────────────────────────────────────────────────

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });

const signRefreshToken = (id, tokenVersion) =>
  jwt.sign({ id, tokenVersion }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

/** Stable fingerprint derived from User-Agent + IP (no extra DB field needed) */
const buildFingerprint = (req) => {
  const raw = `${req.ip}|${req.headers["user-agent"] ?? ""}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
};

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("access_token", accessToken, {
    ...COOKIE_BASE,
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refresh_token", refreshToken, {
    ...COOKIE_BASE,
    path: "/api/auth/refresh", // scoped — not sent on every request
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("access_token", COOKIE_BASE);
  res.clearCookie("refresh_token", {
    ...COOKIE_BASE,
    path: "/api/auth/refresh",
  });
};

/**
 * Issue both tokens, rotate refresh token in DB, and set cookies.
 * `tokenVersion` on the User model acts as a revocation counter —
 * bump it to instantly invalidate all outstanding refresh tokens.
 */
const issueTokens = async (user, req, res) => {
  // Rotate: increment version so old refresh tokens are dead
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  user.lastFingerprint = buildFingerprint(req);
  await user.save({ validateBeforeSave: false });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id, user.tokenVersion);

  setAuthCookies(res, accessToken, refreshToken);
  return { accessToken, refreshToken };
};

// ─── Controllers ─────────────────────────────────────────────────────────────

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing)
    return next(
      new AppError("An account with this email already exists.", 409),
    );

  const user = await User.create({ name, email, password });

  await issueTokens(user, req, res);

  user.password = undefined;
  res.status(201).json({
    success: true,
    data: { user },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid email or password.", 401));
  }

  await issueTokens(user, req, res);

  user.password = undefined;
  res.status(200).json({
    success: true,
    data: { user },
  });
});

export const refresh = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refresh_token;
  if (!token) return next(new AppError("No refresh token provided.", 401));

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    clearAuthCookies(res);
    return next(new AppError("Invalid or expired refresh token.", 401));
  }

  const user = await User.findById(payload.id).select(
    "+tokenVersion +lastFingerprint",
  );
  if (!user) return next(new AppError("User no longer exists.", 401));

  // Token reuse / version mismatch → possible theft; revoke everything
  if (payload.tokenVersion !== user.tokenVersion) {
    clearAuthCookies(res);
    return next(
      new AppError("Refresh token reuse detected. Please log in again.", 401),
    );
  }

  // Fingerprint check — catches stolen cookies from a different device/browser
  if (buildFingerprint(req) !== user.lastFingerprint) {
    clearAuthCookies(res);
    return next(
      new AppError("Device fingerprint mismatch. Please log in again.", 401),
    );
  }

  await issueTokens(user, req, res); // rotates tokenVersion again

  res.status(200).json({ success: true, message: "Tokens refreshed." });
});

export const logout = asyncHandler(async (req, res) => {
  // Invalidate the refresh token family server-side
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { tokenVersion: 1 },
    });
  }

  clearAuthCookies(res);
  res.status(200).json({ success: true, message: "Logged out successfully." });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // 1. Validate input
  if (!currentPassword || !newPassword) {
    return next(
      new AppError("Please provide both current and new password.", 400),
    );
  }

  if (currentPassword === newPassword) {
    return next(
      new AppError(
        "New password must be different from your current password.",
        400,
      ),
    );
  }

  if (newPassword.length < 8) {
    return next(
      new AppError("New password must be at least 8 characters long.", 400),
    );
  }

  // 2. Fetch user with password field (excluded by default)
  const user = await User.findById(req.user._id).select("+password");
  if (!user) return next(new AppError("User no longer exists.", 401));

  // 3. Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new AppError("Your current password is incorrect.", 401));
  }

  // 4. Update password — pre-save hook in User model will hash it
  user.password = newPassword;
  user.passwordChangedAt = new Date(Date.now() - 1000); // -1s buffer for slow DB writes
  await user.save();

  // 5. Rotate tokens so all existing sessions are invalidated
  await issueTokens(user, req, res);

  res.status(200).json({
    success: true,
    message:
      "Password changed successfully. All other sessions have been logged out.",
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});
