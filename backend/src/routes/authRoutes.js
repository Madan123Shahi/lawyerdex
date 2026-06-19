import express from "express";
const router = express.Router();
import {
  register,
  login,
  getMe,
  refresh,
  changePassword,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "../../../shared/schemas/authValidators.js";

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh); // called by your frontend silently
router.patch(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword,
);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
