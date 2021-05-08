import RestaurantsDAO from '../../dao/restaurants.dao.js';

export default class RestaurantsController {
    static async apiGet(req, res, next) {
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 20) : 20;
        let page = req.query.page ? parseInt(req.query.page, 0) : 0;

        if (page > 0)
            page = page - 1;

        let filters = {};
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine;
        }
        else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode;
        }
        else if (req.query.name) {
            filters.name = req.query.name;
        }

        const { restaurants, totalRestaurants } = await RestaurantsDAO.getRestaurants({ filters, page, restaurantsPerPage });

        let response = {
            restaurants,
            page,
            filters,
            restaurantsPerPage,
            totalRestaurants
        };
        res.json(response);
    }

    static async apiGetById(req, res, next) {
        try {
            let id = req.params.id || {};
            let restaurant = await RestaurantsDAO.getByID(id);
            if (!restaurant) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            res.json(restaurant);
        }
        catch (error) {
            console.log(`api: ${error}`);
            res.status(500).json({ error });
        }
    }

    static async apiGetCuisines(req, res, next) {
        try {
            let cuisines = await RestaurantsDAO.getCuisines();
            res.json(cuisines);
        }
        catch (error) {
            console.log(`api: ${error}`);
            res.status(500).json({ error });
        }
    }
}