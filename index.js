import app from './server.js';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import RestaurantsDAO from './dao/restaurants.dao.js';
import ReviewsDAO from './dao/reviews.dao.js';

dotenv.config();

const MongoDBClient = mongodb.MongoClient;

const port = process.env.PORT || 2000;

MongoDBClient.connect(
    process.env.RestaurantMongoDBURI,
    {
        poolSize: 50,
        wtimeout: 2500,
        useNewUrlParser: true
    }
).catch(error => {
    console.error(error);
    process.exit(1);
}).then(async client => {
    await RestaurantsDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
        
    })
})