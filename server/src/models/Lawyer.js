import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    headline: { type: String, default: "", maxlength: 160 },
    bio: { type: String, default: "", maxlength: 4000 },
    practiceAreas: { type: [String], default: [], index: true }, // area slugs
    city: { type: String, default: "", trim: true, index: true },
    state: { type: String, default: "", trim: true, uppercase: true, index: true },
    barNumber: { type: String, default: "", trim: true },
    experienceYears: { type: Number, default: 0, min: 0, max: 80 },
    languages: { type: [String], default: ["English"] },
    hourlyRate: { type: Number, default: null, min: 0 },
    freeConsultation: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    verificationNote: { type: String, default: "" },
    verifiedAt: Date,
  },
  { timestamps: true },
);

lawyerSchema.index({ name: "text", headline: "text", bio: "text", city: "text" });
lawyerSchema.index({ verificationStatus: 1, rating: -1 });

export const Lawyer = mongoose.model("Lawyer", lawyerSchema);
