const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

const lawyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: 'USA' },
    },
    practiceAreas: [{ type: String }],
    category: { type: String, required: true },
    experience: { type: Number, default: 0 },
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
  { timestamps: true }
);

// Text index for search
lawyerSchema.index({ name: 'text', bio: 'text', category: 'text' });

module.exports = mongoose.model('Lawyer', lawyerSchema);
