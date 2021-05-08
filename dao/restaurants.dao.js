import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectID;
let restaurants;
export default class RestaurantsDAO {
    static async injectDB(conn) {
        if (restaurants) {
            return;
        }
        try {
            restaurants = await conn.db(process.env.RestaurantNS)
                .collection('restaurants');
        }
        catch (error) {
            console.error(`Unable to establish the connection with restaurant database: ${error}`);
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20
    }) {
        let query;
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] } };
            }
            else if ("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] } };
            }
            else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] } };
            }
        }

        let cursor;

        try {
            cursor = await restaurants.find(query);
        }
        catch (error) {
            console.error(`Unable to issue find command: ${error}`);
            return { restaurants: [], totalRestaurants: 0 };
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

        try {
            const restaurantsList = await displayCursor.toArray();
            const totalRestaurants = restaurants.countDocuments(query);
            return { restaurants: restaurantsList, totalRestaurants };
        }
        catch (error) {
            console.error(`Unable to convert cursor to array: ${error}`);
            return { restaurants: [], totalRestaurants: 0 };
        }
    }

    static async getByID(id) {

        try {
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        let: {
                            id: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurantId", "$$id"],
                                    }
                                }
                            },
                            {
                                $sort: {
                                    date: -1
                                }
                            }
                        ],
                        as: "reviews"
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews"
                    }
                }
            ];
            return await restaurants.aggregate(pipeline).next();
        }
        catch (error) {
            console.error(`Unable to issue find command: ${error}`);
            return { restaurants: [], totalRestaurants: 0 };
        }
    }

    static async getCuisines() {
        let cuisines = [];
        try {
            cuisines = await restaurants.distinct("cuisine");
            return cuisines;
        }
        catch(error) {
            console.error(`Unable to issue find command: ${error}`);
            return cuisines;
        }
    }
}