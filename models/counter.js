//This will be model for database schema
//For connecting to mongodb client make mongoose instance
var mongoose = require('mongoose');

//This is Schema for User to store Data
var CountSchema = new mongoose.Schema({
	count :{
		type: Number, 
		required: true,
		trim: true
	}
});


//Schema is made above and methods attached to it
//We need to make models for making Documents 
//A model is a class with which we construct documents
var Counter = mongoose.model('Count',CountSchema);

//Exporting our model
module.exports = Counter;