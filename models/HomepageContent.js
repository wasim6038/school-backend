import mongoose from 'mongoose';

/**
 * Single-document collection storing every editable section of the homepage
 * (hero, stats, principal message, chairman message, features, facilities,
 * academic programs teaser, CTA, FAQ). Admin edits this via the CMS instead
 * of touching frontend code.
 */
const homepageContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'homepage', unique: true },
    hero: {
      headline: String,
      subheadline: String,
      backgroundImage: { url: String, publicId: String },
      ctaText: String,
      ctaLink: String
    },
    intro: {
      title: String,
      description: String,
      image: { url: String, publicId: String }
    },
    stats: [{ label: String, value: Number, suffix: String, icon: String }],
    principalMessage: {
      name: String,
      designation: String,
      message: String,
      photo: { url: String, publicId: String }
    },
    chairmanMessage: {
      name: String,
      designation: String,
      message: String,
      photo: { url: String, publicId: String }
    },
    features: [{ title: String, description: String, icon: String }],
    facilities: [{ title: String, description: String, image: { url: String, publicId: String } }],
    programs: [{ title: String, description: String, icon: String, link: String }],
    faqs: [{ question: String, answer: String, order: Number }],
    admissionCta: {
      title: String,
      description: String,
      buttonText: String,
      buttonLink: String
    }
  },
  { timestamps: true }
);

export default mongoose.model('HomepageContent', homepageContentSchema);
