import RestaurantsDAO from '../../dao/restaurants.dao.js';

export default class RestaurantsController {
    static async apiGet(req, res, next) {
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 20) : 20;
        const page = req.query.page ? parseInt(req.query.page, 0) : 0;

        let filters = {};
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine;
        }
        else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode;
        }
        else if(req.query.name) {
            filters.name = req.query.name;
        }

        const { restaurants, totalRestaurants } = await RestaurantsDAO.getRestaurants( { filters, page, restaurantsPerPage });

        let response = {
            restaurants,
            page,
            filters,
            restaurantsPerPage,
            totalRestaurants
        };
        res.json(response);
    }
}