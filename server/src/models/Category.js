import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  { name: { type: String, required: true }, slug: { type: String, required: true } },
  { _id: false },
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "Scale" }, // lucide-react icon name
    areas: [areaSchema],
  },
  { timestamps: true },
);

export const Category = mongoose.model("Category", categorySchema);
