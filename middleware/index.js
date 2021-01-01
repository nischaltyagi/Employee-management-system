function loggedOut(req,res,next){
	//Session middleware makes session object available through the 
	//request object so we can check userId
	if(req.session && req.session.userId){
		return res.redirect('/profile');
	} 
	return next();
}

function loggedIn(req,res,next){
	if(req.session && req.session.userId){
		return next();
	}
	return res.redirect('/home');
}
//To access it elseware we export it as loggedOut variable
module.exports.loggedOut = loggedOut;
module.exports.loggedIn = loggedIn;