// server.js
import { EventEmitter } from "events";
import app from "./app.js";
import { connectDB, disconnectDB } from "./utils/db.js";

// Raise listener limit before anything else registers listeners
EventEmitter.defaultMaxListeners = 20;

const PORT = process.env.PORT || 5000;
let server;

// ─── Startup ──────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
    );
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use.`);
    } else {
      console.error("❌ Server error:", err);
    }
    process.exit(1);
  });
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);

  // Stop accepting new connections
  server?.close(async () => {
    console.log("🔌 HTTP server closed.");

    await disconnectDB();

    console.log("✅ Graceful shutdown complete.");
    process.exit(0);
  });

  // Force exit if shutdown takes longer than 10s (stuck DB query, etc.)
  setTimeout(() => {
    console.error("❌ Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000).unref(); // .unref() so the timer doesn't keep the process alive itself
};

// ─── Process Events ───────────────────────────────────────────────────────────
process.on("SIGTERM", () => shutdown("SIGTERM")); // sent by hosting platforms on deploy/scale
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C in terminal

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Promise Rejection:", reason);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  shutdown("uncaughtException");
});

start();
