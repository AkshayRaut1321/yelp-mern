import express from 'express';

const router = express.Router();

router.route('/').get((request, response) => {
    response.send("Hello from Express");
});

export default router;