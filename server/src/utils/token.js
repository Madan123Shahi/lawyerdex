import jwt from "jsonwebtoken";
import { env, isProd } from "../config/env.js";

export const COOKIE_NAME = "ld_token";

export function signToken(user) {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: String(user._id),
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: isProd, sameSite: "lax", path: "/" });
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
