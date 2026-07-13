import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    attachment: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    category: { type: String, default: 'General' },
    isPinned: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

noticeSchema.index({ isPinned: -1, createdAt: -1 });

export default mongoose.model('Notice', noticeSchema);
