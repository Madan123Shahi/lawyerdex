import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    passwordChangedAt: { type: Date, select: false },
    role: { type: String, enum: ["user", "admin", "lawyer"], default: "user" },
    avatar: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0, select: false },
    lastFingerprint: { type: String, select: false },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (jwtIssuedAt) {
  if (this.passwordChangedAt) {
    const changedAt = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return jwtIssuedAt < changedAt; // true = password changed AFTER token was issued
  }
  return false;
};

export default mongoose.model("User", userSchema);
