import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("sanitizeFilter", true); // blocks $-operator injection in query filters
mongoose.set("strictQuery", true);

export async function connectDB() {
  await mongoose.connect(env.MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
