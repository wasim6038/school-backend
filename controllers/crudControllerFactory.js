import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import BaseRepository from '../utils/BaseRepository.js';

/**
 * Builds a full set of REST controllers (list/get/create/update/delete) for
 * a Mongoose model. Used by the simpler CMS modules (faculty, gallery, news,
 * events, notices, downloads, testimonials, pages) to avoid duplicating the
 * same pagination/search/sort/filter/error-handling logic in every file.
 *
 * @param {mongoose.Model} model
 * @param {Object} options
 * @param {String[]} options.searchFields - fields eligible for free-text search
 * @param {String} options.entityName - human readable name for messages
 * @param {Function} options.buildFilter - (req) => additional mongo filter object
 * @param {String} options.uploadField - name of the field to upload files to
 */
const createCrudController = (model, { searchFields = [], entityName = 'Item', buildFilter, uploadField = null } = {}) => {
  const repo = new BaseRepository(model);

  const list = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = '', sort = '-createdAt', ...rest } = req.query;

    const filter = buildFilter ? buildFilter(req) : {};

    // Allow simple equality filters via query params declared by the route,
    // e.g. ?category=sports&isActive=true
    Object.entries(rest).forEach(([key, value]) => {
      if (['category', 'department', 'status', 'isActive', 'isFeatured', 'isPinned', 'type'].includes(key)) {
        filter[key] = value === 'true' ? true : value === 'false' ? false : value;
      }
    });

    const { items, meta } = await repo.findPaginated({
      filter,
      search,
      searchFields,
      sort,
      page: Number(page),
      limit: Number(limit)
    });

    new ApiResponse(200, items, `${entityName} list fetched`, meta).send(res);
  });

  const getOne = asyncHandler(async (req, res) => {
    const item = await repo.findById(req.params.id);
    if (!item) throw ApiError.notFound(`${entityName} not found`);
    new ApiResponse(200, item, `${entityName} fetched`).send(res);
  });

  const getBySlug = asyncHandler(async (req, res) => {
    const item = await repo.findOne({ slug: req.params.slug });
    if (!item) throw ApiError.notFound(`${entityName} not found`);
    new ApiResponse(200, item, `${entityName} fetched`).send(res);
  });

  const create = asyncHandler(async (req, res) => {
    const data = { ...req.body };

    if (req.file) {
      data[uploadField] = {
        url: req.file.path,
        publicId: req.file.filename,
        fileName: req.file.originalname,
        fileSize: req.file.size
      };
    }
    const item = await repo.create(data);
    new ApiResponse(201, item, `${entityName} created successfully`).send(res);
  });

  const update = asyncHandler(async (req, res) => {
    const data = { ...req.body };

    if (req.file) {
      data[uploadField] = {
        url: req.file.path,
        publicId: req.file.filename,
        fileName: req.file.originalname,
        fileSize: req.file.size
      };
    }

    const item = await repo.updateById(req.params.id, data);
    if (!item) throw ApiError.notFound(`${entityName} not found`);
    new ApiResponse(200, item, `${entityName} updated successfully`).send(res);
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await repo.deleteById(req.params.id);
    if (!item) throw ApiError.notFound(`${entityName} not found`);
    new ApiResponse(200, null, `${entityName} deleted successfully`).send(res);
  });

  return { list, getOne, getBySlug, create, update, remove, repo };
};

export default createCrudController;
