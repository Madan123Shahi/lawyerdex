import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env, isProd } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/auth.js";
import lawyerRoutes from "./routes/lawyers.js";
import categoryRoutes from "./routes/categories.js";
import articleRoutes from "./routes/articles.js";
import consultationRoutes from "./routes/consultations.js";
import adminRoutes from "./routes/admin.js";

export function createApp() {
  const app = express();

  if (isProd) app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  if (!isProd) app.use(morgan("dev"));

  app.use(
    "/api",
    rateLimit({ windowMs: 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false }),
  );

  app.get("/api/health", (_req, res) => res.json({ ok: true, uptime: process.uptime() }));
  app.use("/api/auth", authRoutes);
  app.use("/api/lawyers", lawyerRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/articles", articleRoutes);
  app.use("/api/consultations", consultationRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
