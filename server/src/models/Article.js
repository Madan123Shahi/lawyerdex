import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true }, // plain text paragraphs separated by blank lines
    category: { type: String, default: "General" },
    publishedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

export const Article = mongoose.model("Article", articleSchema);
