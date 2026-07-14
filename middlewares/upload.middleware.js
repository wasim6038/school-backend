import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';

/**
 * Factory that builds a multer instance streaming uploads straight to a
 * given Cloudinary folder, restricted to image/document mime types.
 */
const buildUploader = (folder, { allowDocs = false, maxSizeMB = 1 } = {}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `school-website/${folder}`,
      allowed_formats: allowDocs
        ? ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx']
        : ['jpg', 'jpeg', 'png', 'webp'],
      resource_type: 'auto'
    }
  });

  return multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowedMimes = allowDocs
        ? ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
        : ['image/jpeg', 'image/png', 'image/webp'];

      if (!allowedMimes.includes(file.mimetype)) {
        return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
      }
      cb(null, true);
    }
  });
};

export const uploadFacultyPhoto = buildUploader('faculty');
export const uploadEventImage = buildUploader('events');
export const uploadGalleryMedia = buildUploader('gallery');
export const uploadNewsImage = buildUploader('news');
export const uploadTestimonialPhoto = buildUploader('testimonials');
export const uploadAdmissionDocs = buildUploader('admissions', { allowDocs: true, maxSizeMB: 5 });
export const uploadDownloadFile = buildUploader('downloads', { allowDocs: true, maxSizeMB: 10 });
export const uploadPageAsset = buildUploader('pages', { allowDocs: false });