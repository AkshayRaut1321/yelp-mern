import express from 'express';
import RestaurantsCtrl from './controllers/restaurants.controller.js';
import ReviewsCtrl from './controllers/reviews.controller.js';

const router = express.Router();

router.route('/').get(RestaurantsCtrl.apiGet);

router.route('/reviews')
.post(ReviewsCtrl.apiSave)
.put(ReviewsCtrl.apiUpdate)
.delete(ReviewsCtrl.apiDelete);

export default router;