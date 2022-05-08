const moment = require('moment');


const prepHomeDocs = (topDocs) => {
    topDocs.forEach(doc => {
        doc.doc_id = doc._id.toString();
        delete doc._id;
        doc.name = `${doc.firstname} ${doc.lastname}`;
    });
    return topDocs;
};

const prepDocPageData = (doc) => {
    delete doc._id;
    doc.name = `${doc.firstname} ${doc.lastname}`;
    doc.reviews_count = doc.reviews.length;
    doc.reviews.forEach(review => {
        delete review._id;
        review.review_time = moment(review.updated_at).format('MMMM Do YYYY');
    });
    const page_data = {
        name: `${doc.firstname} ${doc.lastname}`,
        reviews_count: doc.reviews.length,
        reviews: doc.reviews,
        qualification: doc.qualification,
        location: doc.location,
        rating: doc.rating,
        //recent_review: doc.reviews[doc.reviews.length-1].review,
        //recent_review_time: doc.reviews[doc.reviews.length-1] ? doc.reviews[doc.reviews.length-1].review_time : undefined,

    };
    return page_data;
};


module.exports = {
    prepHomeDocs,
    prepDocPageData
};