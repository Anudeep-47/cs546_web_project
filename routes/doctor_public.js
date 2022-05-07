const express = require('express');
const router = express.Router();
const doctor_public = require('../controllers/doctor_public');

router.get('/login',async(req,res)=>{
	if(!req.session.userId){
		res.redirect('/login');
		return;
	}
	else{
		res.render('/login/doctor_public');
		return;
	}
});