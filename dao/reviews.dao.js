import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectID;

let reviews;

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return;
        }
        try {
            reviews = await conn.db(process.env.RestaurantNS)
                .collection('reviews');
        }
        catch (error) {
            console.error(`Unable to establish the connection with restaurant database: ${error}`);
        }
    }

    static async saveReview(restaurantId, text, user, date) {
        try {
            const reviewDoc = {
                name: user.name,
                userId: user.id,
                date: date,
                text: text,
                restaurantId: ObjectId(restaurantId)
            };

            return await reviews.insertOne(reviewDoc);
        }
        catch (error) {
            console.error(`Unable to save review: ${error}`);
            return { error };
        }
    }

    static async updateReview(reviewId, text, userId, date) {
        try {
            return await reviews.updateOne(
                { userId: userId, _id: ObjectId(reviewId) },
                { $set: { text: text, date: date } }
            );
        }
        catch (error) {
            console.error(`Unable to update review: ${error}`);
            return { error };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            return await reviews.deleteOne(
                { userId: userId, _id: ObjectId(reviewId) }
            );
        }
        catch (error) {
            console.error(`Unable to delete review: ${error}`);
            return { error };
        }
    }
}