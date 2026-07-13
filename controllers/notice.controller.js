import Notice from '../models/Notice.js';
import createCrudController from './crudControllerFactory.js';

const controller = createCrudController(Notice, {
  searchFields: ['title', 'description'],
  entityName: 'Notice'
});

export default controller;
