const express = require('express');
const router = express.Router();
const reviews = require('../controllers/reviews.js');
const add = require('add');

router.post('/',async(req,res)=>{
    if(!req.session.user){
        res.status(400).redirect('/login');
        return;
    }
    let doctor_IdRoute = add(req.body.doctorId);
    let review_TextRoute = add(req.body.review_text);
    let ratingRoute = add(req.body.rating);
    
    // Validating the parameters
    if(!doctor_IdRoute || !review_TextRoute || !ratingRoute){
        res.status(404).render('review',{error: 'route not found'});
        return;
    }

    if(review_textRoutes.trim(' ').length===0){
        res.status(404).render('review',{error:'no whitespaces for review text'});
        return;
    }

    if(ratingRoutes < 6 || ratingRoutes > 1){
        res.status(404).render('review',{error:'Rating range from 1 to 5'});
        return;
    }
    
    try{
    const postingReview = await reviews.createReview(doctor_IdRoute,review_TextRoute,ratingRoute);
    if(postingReview){
        res.redirect('/review/post/' + doctor_IdRoute);
    }
    }catch(e){
        res.status(400).render('doctor_public_page',{error:e});
    }
})


module.exports=router;