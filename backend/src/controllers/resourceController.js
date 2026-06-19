import Resource from "../models/Resource.js";
import { asyncHandler, AppError } from "../utils/appError.js";

export const getResources = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  const filter = { isPublished: true };
  if (category) filter.category = { $regex: category, $options: "i" };

  const skip = (page - 1) * limit;
  const [resources, total] = await Promise.all([
    Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Resource.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      resources,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
});

export const getResource = asyncHandler(async (req, res, next) => {
  const resource = await Resource.findOne({
    slug: req.params.slug,
    isPublished: true,
  });
  if (!resource) return next(new AppError("Article not found", 404));
  resource.viewCount += 1;
  await resource.save({ validateBeforeSave: false });
  res.json({ success: true, data: { resource } });
});

export const getLatestResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .select("-content");
  res.json({ success: true, data: { resources } });
});
