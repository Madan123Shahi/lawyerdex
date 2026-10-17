import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    lawyer: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "", maxlength: 2000 },
  },
  { timestamps: true },
);

reviewSchema.index({ lawyer: 1, author: 1 }, { unique: true }); // one review per client per lawyer

export const Review = mongoose.model("Review", reviewSchema);
