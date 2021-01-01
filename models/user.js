//This will be model for database schema
//For connecting to mongodb client make mongoose instance
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//This is Schema for User to store Data
var UserSchema = new mongoose.Schema({
	email :{
		type: String, 
		unique: true,
		required: true,
		trim: true
	},
	name :{
		type: String, 
		required: true,
		trim: true
	},
	_id :{
		type: Number
	},	
	password :{
		type: String,
		required: true
	}
});

// authenticate input against database
// This is middleware this will authenticate the user
UserSchema.statics.authenticate = function(email, password , callback){
	User.findOne({email: email}).
	exec(function(error,user){
		if(error){
			return callback(error);
		}else if( !user ){
			var err = new Error('User not found.');
			err.status = 401;
			return callback(err);
		}
		bcrypt.compare(password,user.password,function(error,result){
			if(result === true){
				return callback(null , user);
			}else{
				return callback();
			}
		});
	});
}

// hash pasword before saving to database
// Ww use Bcrypt module and 10 for hash difficulty
UserSchema.pre('save',function(next){
	var user = this;
	bcrypt.hash(user.password,10,function(err, hash){
		if(err){
			return next(err);
		}
		user.password = hash;
		next();
	})
});

//Schema is made above and methods attached to it
//We need to make models for making Documents 
//A model is a class with which we construct documents
var User = mongoose.model('User',UserSchema);

//Exporting our model
module.exports = User;