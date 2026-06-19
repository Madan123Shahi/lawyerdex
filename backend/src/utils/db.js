// utils/db.js
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    mongoose.set("strictQuery", true); // suppress deprecation warning in Mongoose 7+

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // max concurrent connections in the pool
      serverSelectionTimeoutMS: 5000, // fail fast if MongoDB is unreachable
      socketTimeoutMS: 45000, // close idle sockets after 45s
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Re-connect automatically if the connection drops mid-runtime
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
      isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected.");
      isConnected = true;
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      isConnected = false;
    });
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;

  try {
    await mongoose.connection.close();
    isConnected = false;
    console.log("🔌 MongoDB connection closed.");
  } catch (err) {
    console.error("❌ Error closing MongoDB connection:", err);
  }
};
