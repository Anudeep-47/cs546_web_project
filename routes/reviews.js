const router = require("express").Router();
const xss = require('xss');

const {
    addReview
} = require('../models/reviews.js');

const {
    updateDocRating
} = require('../controllers/doctors');

router.post('/', async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/');
        } else {
            const reviewData = xss(req.body.reviewData);
            reviewData.rating = parseInt(reviewData.rating);
            const result = await addReview(reviewData);
            await updateDocRating(reviewData);
            res.json(`Successfully added or updated the review for apptmnt id: ${reviewData.apptmnt_id}`);
        }
    } catch (error) {
        res.status(error.error_code).render(`pages/error${error.error_code}.hbs`, {
            title: `Error ${error.error_code}`,
            error: error.message
        });
    }
});


module.exports = router;