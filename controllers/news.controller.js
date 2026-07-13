import News from '../models/News.js';
import createCrudController from './crudControllerFactory.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

const controller = createCrudController(News, {
  searchFields: ['title', 'preview', 'content'],
  entityName: 'News article',
  uploadField: 'coverImage'
});

// Override getBySlug to also increment view count for public reads
controller.getBySlugAndTrackView = asyncHandler(async (req, res) => {
  const article = await News.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!article) throw ApiError.notFound('News article not found');
  new ApiResponse(200, article, 'News article fetched').send(res);
});

export default controller;
