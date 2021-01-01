//This will be model for database schema
//For connecting to mongodb client make mongoose instance
var mongoose = require('mongoose');

//This is Schema for User to store Data
var EmployeeSchema = new mongoose.Schema({
	empId: {
		type: Number,
		unique: true
	},
	active: {
		type: Boolean,
		required: true
	},
	under: {
		type: String,
		required: true
	},
	name :{
		type: String, 
		required: true,
		trim: true
	},
	email :{
		type: String, 
		required: true,
		trim: true
	},
	gender: {
		type: String,
		trim: true
	},
	guardian  :{
		type: String,
		trim: true
	},
	marital  :{
		type: String,
		trim: true
	},
	children  :{
		type: Number,
		trim: true
	},
	contact :{
		type: Number,
		required: true,
		trim: true
	},
	address :{
		type: String,
		required: true,
		trim: true
	},
	city :{
		type: String,
		required: true,
		trim: true
	},
	state :{
		type: String,
		required: true,
		trim: true
	},
	pan :{
		type: String,
		unique: true,
		required: true,
		trim: true		
	},
	accountNumber :{
		type: String,
		unique: true,
		required: true,
		trim: true		
	},
	bank: {
		type: String,
		trim: true
	},
	designation :{
		type: String,
		trim: true		
	},
	department :{
		type: String,
		trim: true		
	},
	basic :{
		type: Number,
		required: true,
		trim: true		
	},
	pf :{
		type: String,
		required: true,
		trim: true		
	},
	course :{
		type: String,
		required: true,
		trim: true		
	},
	university :{
		type: String,
		required: true,
		trim: true		
	},
	graduation :{
		type: Number,
		required: true,
		trim: true		
	},
	company :{
		type: String,
		trim: true		
	},
	lastDesignation :{
		type: String,
		trim: true		
	},
	lastSalary :{
		type: Number,
		trim: true		
	},
	tenure :{
		type: Number,
		trim: true		
	},						
	DOJyear: {
		type: String,
		required: true
	},
	DOJmonth: {
		type: String,
		required: true
	},
	DOJday: {
		type: String,
		required: true
	}
});

//Schema is made above and methods attached to it
//We need to make models for making Documents 
//A model is a class with which we construct documents
var Employee = mongoose.model('EmployeeNew',EmployeeSchema);

//Exporting our model
module.exports = Employee;