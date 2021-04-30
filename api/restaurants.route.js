import express from 'express';
import RestaurantsCtrl from './controllers/restaurants.controller.js';

const router = express.Router();

router.route('/').get(RestaurantsCtrl.apiGet);

export default router;