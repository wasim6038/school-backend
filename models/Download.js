import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['syllabus', 'forms', 'circulars', 'fee-structure', 'results', 'other'],
      default: 'other'
    },
    file: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      fileName: { type: String },
      fileSize: { type: Number }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

downloadSchema.index({ category: 1, createdAt: -1 });

export default mongoose.model('Download', downloadSchema);
