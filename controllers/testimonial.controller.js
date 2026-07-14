import Testimonial from '../models/Testimonial.js';
import createCrudController from './crudControllerFactory.js';

const controller = createCrudController(Testimonial, {
  searchFields: ['name', 'message'],
  entityName: 'Testimonial',
  uploadField: 'photo'
});

export default controller;
