/**
 * Generic repository wrapping a Mongoose model. Controllers/services talk to
 * repositories instead of the model directly, which keeps query/filter logic
 * reusable and swappable (repository pattern).
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findById(id, populate = '') {
    const query = this.model.findById(id);
    if (populate) query.populate(populate);
    return query;
  }

  findOne(filter = {}, populate = '') {
    const query = this.model.findOne(filter);
    if (populate) query.populate(populate);
    return query;
  }

  /**
   * Generic list with pagination, search, sorting, and arbitrary filters.
   * @param {Object} options
   * @param {Object} options.filter - Mongo filter object (already sanitized)
   * @param {String} options.search - free-text search term
   * @param {String[]} options.searchFields - fields to $regex search across
   * @param {String} options.sort - e.g. "-createdAt" or "title"
   * @param {Number} options.page
   * @param {Number} options.limit
   * @param {String} options.populate
   */
  async findPaginated({
    filter = {},
    search = '',
    searchFields = [],
    sort = '-createdAt',
    page = 1,
    limit = 10,
    populate = ''
  }) {
    const finalFilter = { ...filter };

    if (search && searchFields.length > 0) {
      finalFilter.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' }
      }));
    }

    const skip = (Math.max(page, 1) - 1) * limit;

    const [items, total] = await Promise.all([
      this.model.find(finalFilter).sort(sort).skip(skip).limit(Number(limit)).populate(populate),
      this.model.countDocuments(finalFilter)
    ]);

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }

  updateById(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

export default BaseRepository;
