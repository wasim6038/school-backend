import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: 'Parent' },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    photo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
