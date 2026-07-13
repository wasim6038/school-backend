import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['campus', 'events', 'sports', 'academics', 'annual-day', 'other'],
      default: 'other'
    },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    media: {
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    },
    thumbnail: { type: String },
    description: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

galleryItemSchema.index({ category: 1, createdAt: -1 });

export default mongoose.model('GalleryItem', galleryItemSchema);
