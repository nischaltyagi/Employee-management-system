var express = require('express');//This is used for making server
var router = express.Router();//Router object for making routes
var User = require('../models/user');//This imports the model or document for creating its object and saving in mongo
var mid = require('../middleware');//This is the middleware object can be used in routes

//this is routes for this routes
var routes = require('./profile');
router.use('/profile',routes);

//if we were on app.js file then we would have used app.get																				
router.get('/',function(req,res,next){//Starting Page
	console.log("Hello World")/*this means running on server*/
	/* res.send("<h1>Hello World Client</h1>"); To send text to client */
	/*We can send text also html but we don't want to load up our functions*/
	/*We use template for view and use jade for that*/
	console.log(req.currentUser);
	return res.render('index',{title: 'Computer Not Working?'})/*We can use title to pass stuff to our view like array 
	from databse*/
	//You write return or just res.render same thing
});

//GET /logout
router.get('/logout',mid.loggedIn,function(req,res,next){
	if(req.session){
		//delete session object
		//IT also takes a callback
		req.session.destroy(function(err){
			if(err){
				return next(err);
			}else{
				return res.redirect('/');
			}
		});
	}
});

//GET /register
//There is amiddleware so can't go to this route when logged in
router.get('/register',mid.loggedOut,function(req,res,next){
	return res.render('register',{title:'Register'});
});

//POST / register
router.post('/register',function( req, res, next){
	if(req.body.email &&
		req.body.name &&
		req.body.password &&
		req.body.confirmPassword &&
		req.body._id
		){
		// confirm that the two passwords match
	if(req.body.password !== req.body.confirmPassword){
		var err = new Error('Passwords Do not match');
		err.status = 400;
		return next(err);
	}

	//The object of User Type Created 
	var userData = {
		email: req.body.email,
		name: req.body.name,
		password: req.body.password,
		_id: req.body._id
	};

	//use schema's 'create' method to insert documents into mongo
	User.create(userData, function(error,user){
		if(error){
			return next(error);
		}else{
			//We can access Session in any router that has access to request object as 
			//session is property of request and userID from id in database
			req.session.userId = user._id;
			//right now redirect to home or render home otherwise profile
			return res.redirect('/profile');
		}
	});	

	}else{
		var err = new Error('All fields require.');
		err.status = 400;
		return next(err);
	}
});

//GET /login
router.get('/login',mid.loggedOut,function(req,res,next){
	return res.render('login',{title:'log in'});
});

//POST /login
router.post('/login',function(req,res,next){
	if(req.body.email && req.body.password){
		User.authenticate(req.body.email,req.body.password,function(error,user){
			if(error || !user){
				var err = new Error('Wrong email or passsword.');
				err.status = 401;
				return next(err);
			}else{
				req.session.userId = user._id;//Session ID given the actual ID of person
				return res.redirect('/profile');//Right now just checking if working
			}
		});
	}else{
		var err = new Error('Email and password are required');
		err.status = 401;
		return next;
	}
});

// GET /about
router.get('/about',function(req,res,next){
	return res.render('about',{title:'About'});
});

// GET /home
router.get('/home',function(req,res,next){
	return res.render('index',{title: 'Home Page'})
});

// GET /contact 
router.get('/contact',function(req,res,next){
	return res.render('contact',{title:'Contact'});
});

module.exports = router;//For exporting all the routes