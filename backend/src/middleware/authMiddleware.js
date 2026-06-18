// middleware/protect.js
import jwt from "jsonwebtoken";
import { asyncHandler, AppError } from "../utils/appError.js";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  // Read access token from HTTP-only cookie (set by authController)
  const token = req.cookies?.access_token;

  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please log in to access this resource.",
        401,
      ),
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Distinguish between expired and invalid for clearer client-side handling
    if (err.name === "TokenExpiredError") {
      return next(
        new AppError(
          "Your session has expired. Please refresh your token or log in again.",
          401,
        ),
      );
    }
    return next(new AppError("Invalid token. Please log in again.", 401));
  }

  const currentUser = await User.findById(decoded.id).select("-password");

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401),
    );
  }

  // Guard: if user changed password after token was issued, force re-login
  if (typeof currentUser.changedPasswordAfter === "function") {
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "Your password was recently changed. Please log in again.",
          401,
        ),
      );
    }
  }

  req.user = currentUser;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403),
      );
    }
    next();
  };
