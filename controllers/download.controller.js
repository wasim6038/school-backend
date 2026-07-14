import Download from '../models/Download.js';
import createCrudController from './crudControllerFactory.js';

const controller = createCrudController(Download, {
  searchFields: ['title'],
  entityName: 'Download',
  uploadField: 'file'
});

export default controller;
