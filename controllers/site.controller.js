import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import HomepageContent from '../models/HomepageContent.js';
import Setting from '../models/Setting.js';
import Seo from '../models/Seo.js';

/**
 * GET /site/homepage - Public. Returns the single homepage content document,
 * creating a sane default on first request if it doesn't exist yet.
 */
export const getHomepageContent = asyncHandler(async (_req, res) => {
  let content = await HomepageContent.findOne({ key: 'homepage' });
  if (!content) {
    content = await HomepageContent.create({ key: 'homepage' });
  }
  new ApiResponse(200, content, 'Homepage content fetched').send(res);
});

/**
 * PUT /site/homepage - Admin/Editor only. Full upsert of homepage sections.
 */
export const updateHomepageContent = asyncHandler(async (req, res) => {
  const content = await HomepageContent.findOneAndUpdate({ key: 'homepage' }, req.body, {
    new: true,
    upsert: true,
    runValidators: true
  });
  new ApiResponse(200, content, 'Homepage content updated').send(res);
});

/**
 * GET /site/settings - Public. Global settings (contact info, socials, logo).
 */
export const getSettings = asyncHandler(async (_req, res) => {
  let settings = await Setting.findOne({ key: 'global' });
  if (!settings) {
    settings = await Setting.create({ key: 'global' });
  }
  new ApiResponse(200, settings, 'Settings fetched').send(res);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.findOneAndUpdate({ key: 'global' }, req.body, {
    new: true,
    upsert: true,
    runValidators: true
  });
  new ApiResponse(200, settings, 'Settings updated').send(res);
});

/**
 * GET /site/seo/:route - Public. Route is URL-encoded, e.g. %2Fadmissions
 */
export const getSeoForRoute = asyncHandler(async (req, res) => {
  const route = decodeURIComponent(req.params.route);
  const seo = await Seo.findOne({ route });
  new ApiResponse(200, seo || null, 'SEO data fetched').send(res);
});

export const upsertSeoForRoute = asyncHandler(async (req, res) => {
  const route = decodeURIComponent(req.params.route);
  const seo = await Seo.findOneAndUpdate({ route }, { ...req.body, route }, {
    new: true,
    upsert: true,
    runValidators: true
  });
  new ApiResponse(200, seo, 'SEO data updated').send(res);
});

export const listAllSeo = asyncHandler(async (_req, res) => {
  const items = await Seo.find().sort('route');
  new ApiResponse(200, items, 'All SEO overrides fetched').send(res);
});
