import Event from '../models/Event.js';
import createCrudController from './crudControllerFactory.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

const controller = createCrudController(Event, {
  searchFields: ['title', 'description', 'location'],
  entityName: 'Event',
  uploadField: 'coverImage'
});

// GET /events/upcoming - convenience endpoint for homepage widgets
controller.upcoming = asyncHandler(async (_req, res) => {
  const events = await Event.find({ isActive: true, startDate: { $gte: new Date() } })
    .sort('startDate')
    .limit(6);
  new ApiResponse(200, events, 'Upcoming events fetched').send(res);
});

export default controller;
