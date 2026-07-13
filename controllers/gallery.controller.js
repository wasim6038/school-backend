import GalleryItem from '../models/GalleryItem.js';
import createCrudController from './crudControllerFactory.js';

const controller = createCrudController(GalleryItem, {
  searchFields: ['title', 'description'],
  entityName: 'Gallery item',
  uploadField: 'media'
});

export default controller;
