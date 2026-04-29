const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    category: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: String, default: 'LawyerDex Team' },
    readTime: { type: Number, default: 5 },
    isPublished: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

resourceSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
