import mongoose from 'mongoose';

/**
 * Per-route SEO overrides, keyed by the frontend path (e.g. "/admissions").
 * Falls back to Page.seo or sane defaults when no override exists.
 */
const seoSchema = new mongoose.Schema(
  {
    route: { type: String, required: true, unique: true, index: true },
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    twitterCard: { type: String, default: 'summary_large_image' },
    canonicalUrl: String,
    schemaJsonLd: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

export default mongoose.model('Seo', seoSchema);
