const Lawyer = require('../models/Lawyer');
const { asyncHandler, AppError } = require('../utils/appError');

exports.getLawyers = asyncHandler(async (req, res) => {
  const { q, category, location, page = 1, limit = 12, sortBy = 'rating', order = 'desc' } = req.query;

  const filter = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = { $regex: category, $options: 'i' };
  if (location) {
    filter.$or = [
      { 'location.city': { $regex: location, $options: 'i' } },
      { 'location.state': { $regex: location, $options: 'i' } },
    ];
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const skip = (page - 1) * limit;

  const [lawyers, total] = await Promise.all([
    Lawyer.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(Number(limit)),
    Lawyer.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { lawyers, total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

exports.getLawyer = asyncHandler(async (req, res, next) => {
  const lawyer = await Lawyer.findById(req.params.id);
  if (!lawyer) return next(new AppError('Lawyer not found', 404));
  res.json({ success: true, data: { lawyer } });
});

exports.getFeaturedLawyers = asyncHandler(async (req, res) => {
  const lawyers = await Lawyer.find({ isFeatured: true }).sort({ rating: -1 }).limit(6);
  res.json({ success: true, data: { lawyers } });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Lawyer.distinct('category');
  res.json({ success: true, data: { categories } });
});
