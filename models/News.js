import mongoose from 'mongoose';
import slugify from 'slugify';

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    preview: { type: String, trim: true },
    content: { type: String, required: true },
    coverImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String
    }
  },
  { timestamps: true }
);

newsSchema.pre('validate', function generateSlug(next) {
  if (this.title && !this.slug) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }
  next();
});

newsSchema.index({ title: 'text', preview: 'text', content: 'text' });

export default mongoose.model('News', newsSchema);
