import mongoose from "mongoose";
import { LogOut } from "lucide-react";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const lawyerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
      unique: true,
      required: true,
      sparse: true,
    },
    phone: { type: String, required: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    practiceAreas: [{ type: String }],
    barNumber: { type: String, trim: true, required: true },
    licenseUpload: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    consultationFee: { type: Number, default: 0 },
    languages: [{ type: String }],
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
  },
  { timestamps: true },
);

// Text index for search
lawyerSchema.index({ bio: "text", category: "text" });

export default mongoose.model("Lawyer", lawyerSchema);
