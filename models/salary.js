//This will be model for database schema
//For connecting to mongodb client make mongoose instance
var mongoose = require('mongoose');


//This is Schema for User to store Data
var SalarySchema = new mongoose.Schema({

	empId: {
		type: Number,
		unique: true
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
		unique: true,
		required: true,
		trim: true
	},
	contact :{
		type: Number,
		required: true,
		trim: true
	},
	address :{
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
	department: {
		type: String,
		trim: true
	},						
	DOJ: {
		type: String,
		required: true
	},
	basic: {
		type: Number,
		trim: true,
		required: true
	},
	hra: {
		type: Number,
		trim: true,
		required: true
	},
	pf: {
		type: Number,
		trim: true,
		required: true
	},
	reimbursement: {
		type: Number,
		trim: true,
		required: true
	},
	specialAllowance: {
		type: Number,
		trim: true,
		required: true
	},
	gross: {
		type: Number,
		trim: true,
		required: true
	},
	epf: {
		type: Number,
		trim: true,
		required: true
	},
	CTC: {
		type: Number,
		trim: true,
		required: true
	},
	netPay: {
		type: Number,
		trim: true,
		required: true
	},
	taxableIncome: {
		type: Number,
		trim: true,
		required: true
	},
	deductions: {
		type: Number,
		trim: true,
		required: true
	},
	tds: {
		type: Number,
		trim: true,
		required: true
	},	
	lopIncome: {
		type: Number,
		trim: true,
		required: true
	},
	month: {
		type: String,
		required: true
	},
	year: {
		type: String,
		required: true
	},
	active: {
		type: Boolean
	},
	present: {
		type: Number,
		required: true
	},
	working: {
		type: Number,
		required: true
	},
	lop: {
		type: Number,
		required: true
	}
});


//A model is a class with which we construct documents
var Salary = mongoose.model('salary',SalarySchema);

//Exporting our model
module.exports = Salary;