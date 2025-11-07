import express from 'express';
import authenticate from '../middlewares/auth.middleware.js';
import controller from '../controllers/listing.controller.js';

const route = express.Router();

// público
route.get('/', controller.searchListings);

// autenticado
route.get('/mine', authenticate, controller.myListings);
route.post('/', authenticate, controller.createListing);
route.patch('/:listingId', authenticate, controller.updateListing);
route.delete('/:listingId', authenticate, controller.deleteListing);
route.post('/:listingId/mark', authenticate, controller.markStatus);

export default route;
