import mongoose from 'mongoose';

/**
 * Global site-wide settings, singleton document.
 */
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'global', unique: true },
    siteName: { type: String, default: 'Bright Future Public School' },
    tagline: { type: String, default: 'Nurturing Minds, Building Futures' },
    logo: { url: String, publicId: String },
    favicon: { url: String, publicId: String },
    contact: {
      email: String,
      phone: String,
      alternatePhone: String,
      address: String,
      mapEmbedUrl: String,
      latitude: Number,
      longitude: Number
    },
    social: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      linkedin: String
    },
    officeHours: { type: String, default: 'Mon - Sat: 8:00 AM - 3:00 PM' },
    maintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
