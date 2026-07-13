import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import cloudinary from '../config/cloudinary.js';

/**
 * POST /upload - Generic single-file upload endpoint used by CMS rich-text
 * editors and any form that needs an image/file URL without a dedicated
 * module (e.g. inline images inside Page sections).
 * Expects the upload middleware (e.g. uploadPageAsset.single('file')) to
 * have already run and populated req.file.
 */
export const uploadSingleFile = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file was uploaded.');

  new ApiResponse(
    201,
    { url: req.file.path, publicId: req.file.filename },
    'File uploaded successfully'
  ).send(res);
});

/**
 * DELETE /upload/:publicId - Removes an asset from Cloudinary. publicId
 * must be URL-encoded since Cloudinary IDs contain slashes.
 */
export const deleteFile = asyncHandler(async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId);
  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== 'ok' && result.result !== 'not found') {
    throw ApiError.internal('Failed to delete file from storage.');
  }

  new ApiResponse(200, null, 'File deleted successfully').send(res);
});
