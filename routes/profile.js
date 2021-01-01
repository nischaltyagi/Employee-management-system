var express = require('express');//This is used for making server
var router = express.Router();//Router object for making routes
var User = require('../models/user');//This imports the model or document for creating its object and saving in mongo
var Employee = require('../models/newemployee');
var mid = require('../middleware');//This is the middleware object can be used in routes
var Counter = require('../models/counter');//This will be used as counter for id of database
var Salary = require('../models/salary');//For Salary

//POST /search
router.post('/search',function(req,res,next){
	Employee.find({empId : req.body.empId}, function(err,employee){

			console.log(employee)
			console.log(employee.length)
			if(employee.length == 0){
				return res.render('search');
			}
			console.log(employee[0].DOJyear)
			date = String(employee[0].DOJday) + ' ' + String(employee[0].DOJmonth) + ' ' + String(employee[0].DOJyear); 
			return res.render('searchProfile', {data : employee[0] , date: date , male :true } );
	});
});

//GET /search
router.get('/search',mid.loggedIn,function(req,res,next){
	return res.render('search');
})

//POST /pay
router.post('/pay',function(req,res,next){
	 empId = req.body.empId;
	 year = req.body.year;
	 monthSent = req.body.month;
	 switch(monthSent){
	 	case "january":
	 		month = "Jan"
	 		break;
	 	case "february":
	 		month = "Feb"
	 		break;
	 	case "march":
	 		month = "Mar"
	 		break;
	 	case "april":
	 		month = "Apr"
	 		break;
	 	case "may":
	 		month = "May"
	 		break;
	 	case "june":
	 		month = "Jun"
	 		break;
	 	case "july":
	 		month = "Jul"
	 		break;
	 	case "august":
	 		month = "Aug"
	 		break;
	 	case "september":
	 		month = "Sep"
	 		break;
	 	case "october":
	 		month = "Oct"
	 		break;
	 	case "november":
	 		month = "Nov"
	 		break;
	 	case "december":
	 		month = "Dec"
	 		break;
	 }
	 Salary.find({empId: empId ,month: month, year: year},function(err,data){
	 	if(data.length == 0){
	 		return res.render('nopay');
	 	}
	 	console.log(data[0]) 
	 	// earnings = Math.round(data[0].gross);
	 	// deductions = Math.round(data[0].deductions);
		return res.render('pay',{data: data[0]});
	 });
});

//GET /pay
router.get('/pay',function(req,res,next){
	return res.render('payform');
});

//POST /salary
router.post('/salary',function(req,res,next){
	var emp = req.body.emp;
	var working = req.body.working;
	var present = req.body.present;
	var lop = req.body.lop;

	Employee.find({empId : emp},function(err,employee){
	
			//These show I can access both request and employee data
			console.log(employee);
			console.log(emp);
			console.log(working);
			console.log(present);
			console.log(lop);
		
	basic = employee[0].basic;		
	plan = employee[0].pf;
	if(String(plan) == 'maximum'){
		epf = basic*.12;
		pf = epf;
	}
	else{
		epf = 1800;
		pf = epf;
	}
	CTC = basic*2;
	gross = CTC - epf;
	hra = basic*0.5;//50% of basic
	reimbursement = basic*0.05;//5% of basic
	specialAllowance = gross - basic - hra - reimbursement;

	perDayIncome = gross/working;
	lopIncome = perDayIncome*lop;

	//Tax deductions
	taxableIncome = CTC*12 - epf*12 - lopIncome - hra*12;

	if(taxableIncome <= 250000){
		tax = 0
	}else if(taxableIncome > 250000 && taxableIncome <= 500000){
		temp = taxableIncome - 250000;
		tax = temp*0.05;
	}else if(taxableIncome > 500000 && taxableIncome <= 1000000){
		temp1 = taxableIncome - 500000;
		tax1 = 12500
		tax = tax1 + temp1*0.2;
	}else{
		temp1 = taxableIncome - 1000000;
		tax1 = 12500;
		tax2 = 100000;
		tax = tax1 + tax2 + temp1*0.3;
	}
	monthlyTax = tax/12
	deductions = epf + lopIncome + monthlyTax;

	netPay = gross - deductions; 

	var d = new Date();//Can access these methods by only Date object
	var tarrekh = String(d).split(" ");

	var obj = {
		empId: employee[0].empId,
		under: employee[0].under,
		name : employee[0].name,
		email: employee[0].email,
		contact: employee[0].contact,
		address: employee[0].address,
		accountNumber: employee[0].accountNumber,
		bank: employee[0].bank,
		designation: employee[0].designation,
		department: employee[0].department,						
		DOJ: employee[0].DOJday + '-' + employee[0].DOJmonth + '-' + employee[0].DOJyear,
		basic: basic,
		hra: hra.toFixed(2),
		pf: pf.toFixed(2),
		reimbursement: reimbursement.toFixed(2),
		specialAllowance: specialAllowance.toFixed(2),
		gross: gross.toFixed(2),
		epf: epf.toFixed(2),
		CTC: CTC.toFixed(2),
		netPay: netPay.toFixed(2),
		taxableIncome: taxableIncome.toFixed(2),
		deductions: deductions.toFixed(2),
		tds: monthlyTax.toFixed(2),
		lopIncome: lopIncome.toFixed(2),
		month: tarrekh[1],
		year: tarrekh[3],
		active: employee[0].active,
		working: working,
		present: present,
		lop: lop
	};

	console.log(obj);
	
	//use schema's 'create' method to insert documents into mongo
	Salary.create(obj, function(error,salary){
		if(error){
			return next(error);
		}else{
			req.session.userId = req.session.userId;

			Salary.find({ month:tarrekh[1],active:true,under: req.session.userId },function(e,data){
				
				return res.render('salary' ,{data : data});
			
				});
			}
		});
				
	});
});


//GET /salary
router.get('/salary', mid.loggedIn ,function(req,res,next){
	var d = new Date();//Can access these methods by only Date object
	var date = d.getDate();
	var tarrekh = String(d).split(" ");

	switch(tarrekh[1]){
	 	case "Jan":
	 		month = "January"
	 		break;
	 	case "Feb":
	 		month = "February"
	 		break;
	 	case "Mar":
	 		month = "March"
	 		break;
	 	case "Apr":
	 		month = "April"
	 		break;
	 	case "May":
	 		month = "May"
	 		break;
	 	case "Jun":
	 		month = "June"
	 		break;
	 	case "Jul":
	 		month = "July"
	 		break;
	 	case "Aug":
	 		month = "August"
	 		break;
	 	case "Sep":
	 		month = "September"
	 		break;
	 	case "Oct":
	 		month = "October"
	 		break;
	 	case "Nov":
	 		month = "November"
	 		break;
	 	case "Dec":
	 		month = "December"
	 		break;
	 }

	// if(date == 31 || date == 29 || date == 28){	
		Salary.find({ month:tarrekh[1], active:true ,under: req.session.userId },function(e,data){
			req.session.userId = req.session.userId;
			return res.render('salary' ,{data : data,month: month});
		});
	// }else{
	// 	req.session.userId = req.session.userId;
	// 	return res.redirect('/profile/pay');
	// }
});

//GET /counter
//this is only admin path i need to initialize the counter and then use it everywhere
router.get('/counter/:var',function(req,res,next){
	var initial = {
		count : req.params.var
	}
	//use schema's 'create' method to insert documents into mongo
	Counter.create(initial, function(error,user){
		if(error){
			return next(error);
		}else{
			return res.redirect('/profile');
		}
	});	
});

// //POST /remove
router.post('/remove',function(req,res,next){
	var empId = req.body.empId;
	console.log(empId);
	Employee.updateOne({empId : empId }, { active : false}, function (err, place) {
		req.session.userId = req.session.userId;
  		return res.redirect('/profile/update');
	});
});

//POST /update
router.post('/update',mid.loggedIn,function(req,res,next){
	var id = req.body.empId;
	console.log(id);
	Employee.updateOne({empId : id }, { [req.body.choice] : req.body.data}, function (err, place) {
		req.session.userId = req.session.userId;
  		return res.render('update');
	});
});

//GET /update
router.get('/update',mid.loggedIn,function(req,res,next){
	req.session.userId = req.session.userId;
	return res.render('update');
});

//POST /unall
//for sorting all removed employees
router.post('/unall',function(req,res,next){
	var choice = req.body.choice;
	var value = req.body.data;
	//See to set the key as variables always write as {[variable_name] : value}
	//var temp = {[yo] : value };
	//console.log(temp);
	//Store data in lowercase or upper case and search similarly and also you can return capital
	//ASK for all Users to search in lowercase as thats how you store data in mongo when you see it then you can format
	Employee.find({[choice]:value , under:req.session.userId, active:false},function(err,data){
		req.session.userId = req.session.userId;
		return res.render('unall',{data:data});
	});
});

//GET /unall
//For employees that are removed
router.get('/unall',mid.loggedIn,function(req,res,next){
	 Employee.find({under:req.session.userId , active:false },function(err,data){
			//console.log(data); For testing if recieving data
			req.session.userId = req.session.userId;
			return res.render('unall' , {data: data});
		});
});

//POST /all
//This will display only list which is sorted
router.post('/all',function(req,res,next){
	var choice = req.body.choice;
	var value = req.body.data;
	//See to set the key as variables always write as {[variable_name] : value}
	//var temp = {[yo] : value };
	//console.log(temp);
	//Store data in lowercase or upper case and search similarly and also you can return capital
	//ASK for all Users to search in lowercase as thats how you store data in mongo when you see it then you can format
	Employee.find({[choice]:value , under:req.session.userId, active:true},function(err,data){
		req.session.userId = req.session.userId;
		return res.render('all',{data:data});
	});
});


//GET /all
router.get('/all',mid.loggedIn,function(req,res,next){
	 Employee.find({under:req.session.userId , active:true },function(err,data){
			//console.log(data); For testing if recieving data
			req.session.userId = req.session.userId;
			return res.render('all' , {data: data});
		});
});

//POST /add
router.post('/add',function(req,res,next){ 
	Counter.find({_id:"5d1e52efb00948206c72a1f4"},function(err,data){
		console.log(data[0].count);
		number = data[0].count;
		number += 1;
	var d = new Date();//Can access these methods by only Date object
	var tarrekh = String(d).split(" ");
	var objForEmployee = {
		empId: number,
		active: true,
		under: req.session.userId,
		name: req.body.name.toLowerCase(),
		email: req.body.email,
		gender: req.body.gender,
		guardian: req.body.guardian.toLowerCase(),
		marital: req.body.marital,
		children: req.body.children,
		contact: req.body.contact,
		address: req.body.address,
		city: req.body.city,
		state: req.body.state,
		pan: req.body.pan,
		accountNumber: req.body.account,
		bank: req.body.bank,
		designation: req.body.designation,
		department: req.body.department,
		basic: req.body.basic,
		pf: req.body.pf,
		university: req.body.university,
		course: req.body.course,
		graduation: req.body.graduation,
		company: req.body.company,
		lastDesignation: req.body.lastDesignation,
		lastSalary: req.body.lastSalary,
		tenure: req.body.tenure,
		DOJyear: d.getFullYear(),
		DOJmonth: tarrekh[1],
		DOJday: d.getDate()
	};

	//use schema's 'create' method to insert documents into mongo
	Employee.create(objForEmployee, function(error,user){
		if(error){
			return next(error);
		}else{
			console.log(user.name);
			req.session.userId = req.session.userId;
			Counter.findByIdAndUpdate( "5d1e52efb00948206c72a1f4",{count: number},function(err,data){
				//empty 
				console.log(data);
			});
			req.session.userId = req.session.userId;
			return res.redirect('/profile');
		}
	});	


	});
});

//GET /add
router.get('/add',mid.loggedIn,function(req,res,next){
	return res.render('add');
});

//GET /profile
router.get('/',function(req,res,next){


	//See The property set when creation so we can use it
	if(! req.session.userId){
		return res.render('notprofile');
	}
	//Now we know that the user has logged in so now we can ask mongo to retrieve data
	//We use USer object to retrieve data
	User.findById(req.session.userId)
		.exec(function (error,user){
			if(error){
				return next(error);
			}else{//we are sending variables to the template variable placeholders
				return res.render('profile',{title:'Profile',  name: user.name.toUpperCase()});
			}
		});

});


module.exports = router;//For exporting all the routes