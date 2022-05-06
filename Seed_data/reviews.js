const mongoCollections = require('../config/mongoCollections');
const mongocall = require("mongodb");
const {ObjectId} = require('mongodb');
const reviews = mongoCollections.reviews;
const doctorList = mongoCollections.doctors;

// Function to create reviews
async function createReviews(doctorId,userID,review_text,rating){
    if(doctorId == null || userID == null || review_text == null || rating == null){
        throw Error("INVALID: invalid review parameters")
    }
    if(typeof review_text !='string' || rating!='string'){
        throw Error("Subject must be a string");
    }
    if(review_text.trim(' ').length===0 || rating.trim(' ').length===0){
        throw Error("Subject cannot contain only whitespaces");
    }
    let x = ObjectId(doctorId);
    let rObj = {doctorId,userID,review_text,rating};
    const getDoctor = await doctorList();
    const insertComment = await getDoctor.updateOne({_id:x},{$push:{reviews:rObj}});
    return insertComment;
}
module.exports={createReviews}
