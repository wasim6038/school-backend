import Faculty from '../models/Faculty.js';
import createCrudController from './crudControllerFactory.js';

const controller = createCrudController(Faculty, {
  searchFields: ['name', 'designation', 'department'],
  entityName: 'Faculty member'
});

export default controller;
