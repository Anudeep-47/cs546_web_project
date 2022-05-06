const mongoCollections = require('../config/mongoCollections');
const mongocall = require("mongodb");
const {ObjectId} = require('mongodb');
const reviews = mongoCollections.reviews;
const doctorList = mongoCollections.doctors;

//Create a comment
async function createReviews(doctorId,userID,review_text,rating){
    if(!doctorId){
        throw 'No Doctor ID was provided'
    }
    if(typeof doctorId!='string'){
        throw 'Doctor ID must be a string'
    }
    if(doctorId.length==0){
        throw 'Doctor ID cannot be empty'
    }
    if(!review_text){
        throw 'No Subject was provided'
    }
    if(!rating){
        throw 'No description was provided'
    }
    if(typeof review_text !='string'){
        throw 'Subject must be a string'
    }
    if(typeof rating!='string'){
        throw 'Description must be a string'
    }
    if(review_text.trim(' ').length===0){
        throw 'Subject cannot contain only whitespaces'
    }
    if(rating.trim(' ').length===0){
        throw 'Description cannot contain only whitespaces'
    }
    let x = ObjectId(doctorId);
    let rObj = {doctorId,userID,review_text,rating};
    const getDoctor = await doctorList();
    const insertComment = await getDoctor.updateOne({_id:x},{$push:{reviews:rObj}});
    return insertComment;
}

module.exports={createReviews}