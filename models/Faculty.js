import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    qualification: { type: String, trim: true },
    experienceYears: { type: Number, default: 0 },
    bio: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    photo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    socials: {
      linkedin: String,
      twitter: String
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// facultySchema.index({ department: 1, order: 1 });
// facultySchema.index({ name: 'text', designation: 'text', department: 'text' });

export default mongoose.model('Faculty', facultySchema);
