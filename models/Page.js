import mongoose from 'mongoose';

/**
 * Generic CMS-driven content page.
 * Powers all static informational pages (About, History, Mission, Vision,
 * Principal's Desk, Chairman's Desk, Infrastructure, Library, Sports, etc.)
 * so admins can edit copy/images without any code changes or deployments.
 */
const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    heroImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    // Flexible ordered content blocks, e.g.
    // [{ type: 'richtext', data: { html } }, { type: 'imageGrid', data: { images:[...] } }]
    sections: [
      {
        type: { type: String, required: true }, // richtext | imageGrid | stats | quote | cta | timeline
        data: { type: mongoose.Schema.Types.Mixed, default: {} },
        order: { type: Number, default: 0 }
      }
    ],
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
      canonicalUrl: String
    },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Page', pageSchema);
