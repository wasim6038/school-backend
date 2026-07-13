import mongoose from 'mongoose';
import slugify from 'slugify';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    coverImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, default: 'School Campus' },
    category: {
      type: String,
      enum: ['academic', 'sports', 'cultural', 'holiday', 'other'],
      default: 'other'
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

eventSchema.pre('validate', function generateSlug(next) {
  if (this.title && !this.slug) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }
  next();
});

eventSchema.index({ startDate: 1 });

export default mongoose.model('Event', eventSchema);
