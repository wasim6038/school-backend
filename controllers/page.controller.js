import Page from '../models/Page.js';
import createCrudController from './crudControllerFactory.js';

const controller = createCrudController(Page, {
  searchFields: ['title', 'subtitle'],
  entityName: 'Page'
});

export default controller;
