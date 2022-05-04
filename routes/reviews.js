const router = require("express").Router();

const {
    addReview
} = require('../models/reviews.js');

const {
    updateDocRating
} = require('../controllers/doctors');

router.post('/', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        const reviewData = req.body.reviewData;
        reviewData.rating = parseInt(reviewData.rating);
        const result = await addReview(reviewData);
        await updateDocRating(reviewData);
        res.json(`Successfully added or updated the review for apptmnt id: ${reviewData.apptmnt_id}`);
    }
});


module.exports = router;