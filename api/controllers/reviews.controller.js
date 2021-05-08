import ReviewsDAO from '../../dao/reviews.dao.js';

export default class ReviewsController {
    static async apiSave(req, res, next) {
        try {
            const restaurantId = req.body.restaurantId;
            const text = req.body.text;
            const userInfo = {
                name: req.body.name,
                id: req.body.userId
            };
            const date = new Date();

            const reviewResponse = await ReviewsDAO.saveReview(restaurantId, text, userInfo, date);
            var { error } = reviewResponse;
            if (error) {
                res.status(500).json({ isError: true, message: error });
            }
            else
                res.json({ isError: false, message: "Review added successfully" });
        }
        catch (error) {
            console.error(`Unable to save the review: ${error}`);
            res.status(500).json({ isError: true, message: error.message });
        }
    }

    static async apiUpdate(req, res, next) {
        try {
            const reviewId = req.query.reviewId;
            const text = req.body.text;
            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview(reviewId, text, req.body.userId, date);
            console.log(JSON.stringify(reviewResponse));
            var { error } = reviewResponse;
            if (error) {
                res.json(400).json({ isError: true, message: error.message });
            }
            else {
                if (reviewResponse.modifiedCount === 0) {
                    throw new Error('User may not be the original poster');
                }
                else
                    res.json({ isError: false, message: "Review updated successfully" });
            }
        }
        catch (error) {
            console.error(`Unable to update the review: ${error}`);
            res.status(500).json({ isError: true, message: error.message });
        }
    }

    static async apiDelete(req, res, next) {
        try {
            const reviewResponse = await ReviewsDAO.deleteReview(req.body.reviewId, req.body.userId);

            var { error } = reviewResponse;
            if (error) {
                res.json(400).json({ isError: true, message: error.message });
            }
            else
                res.json({ isError: false, message: "Review deleted successfully" });
        }
        catch (error) {
            console.error(`Unable to delete the review: ${error}`);
            res.status(500).json({ isError: true, message: error.message });
        }
    }
}