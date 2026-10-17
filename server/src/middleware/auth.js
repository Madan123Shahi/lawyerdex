import { ApiError } from "../utils/ApiError.js";
import { COOKIE_NAME, verifyToken } from "../utils/token.js";

function readUser(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export function optionalAuth(req, _res, next) {
  req.user = readUser(req);
  next();
}

export function requireAuth(req, _res, next) {
  const user = readUser(req);
  if (!user) throw ApiError.unauthorized();
  req.user = user;
  next();
}

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) throw ApiError.unauthorized();
  if (!roles.includes(req.user.role)) throw ApiError.forbidden();
  next();
};
