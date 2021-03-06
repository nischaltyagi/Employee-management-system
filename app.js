var express = require('express');/*module from dependencies*/
var path = require('path');// It is a root module we don't require it in dependencies
var bodyParser = require('body-parser');// for Parsing of data acts as middleware 

var mongoose = require('mongoose');//This is used to connect to mongodb database client
var session = require('express-session');//This is used to create a session 

var multer = require('multer');//This will help in uploading files

var crypto = require('crypto');//Used to generate file names for storage

var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var methodOverride = require('method-override');

var mid = require('./middleware');//This is the middleware object can be used in routes

var app = express();//This object should be at top as we use it to call all other methods

//use session for tracking logins
//This middleware is used to create session order of middlewares is very important
app.use(session({
	secret: 'treehouse loves you',
	resave: true,
	saveUnitialized: false
}));

// mongodb connection When App start databse will be created named hremployee
mongoose.connect("mongodb://localhost:27017/hremployee",{useNewUrlParser:true});

//After connecting to database we made connection object to check for connection error
var db = mongoose.connection;
//mongo error
db.on('error',console.error.bind(console,'connection error:'));
db.on('open', function(){
   console.log('Connected To mongo database');
});

//make userId available to templates
app.use(function(req,res,next){
  //locals are custom variable all templates have access to locals object
  res.locals.currentUser = req.session.userId;
  res.locals.db = db;
  next();//I called the next middleware
});

//view engine setup
//You can add many views from different folders
app.set('views',[__dirname + '/views/basic', __dirname + '/views/profile']);// Which Folder views in The Html files
app.set('view engine','pug');// Setting the view engine


// serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));// Making public folder for storing static files

// parse incoming requests
app.use(bodyParser.json());//Acts as middleware for parsing data coming form html request
app.use(bodyParser.urlencoded({extended: false}));//Same as above for decoding data

app.use(methodOverride('_method'));//Telling it we want a use 
								  //query string in our form in delete request


var gfs;
//When the connection opens we want to initialize gfs
db.once('open', () => {
  // Init stream
  //db.db means connectionVariable.db
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
});


// Create storage engine
var storage = new GridFsStorage({
  url: "mongodb://localhost:27017/hremployee",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
    //randomBytes generates names of 16 characters	
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
          id: req.body.empId // See I attached a id to the file for quick retrieval
        };
        resolve(fileInfo);
      });
    });
  }
});
//We use this object as middleware for storing in database
const upload = multer({ storage });

//GET /upload
//This route was actually in profile.js router files but I will use it here and middlewares
//so I can us datbase good
app.get('/profile/upload/:empId',mid.loggedIn,function(req,res,next){

  gfs.files.find({ _id : req.params.empId}).toArray((err, files) => {
    // Check if files
    //files object of callback function used
      console.log(files)
      res.render('upload', { files: files });
});

});

//POST /upload
// uploads file to DB
//middleware upload.single() for single file
app.post('/profile/upload', upload.single('myImage'), (req,res) =>{
  console.log(req.body.empId);	
  //res.json({file: req.file});
  res.redirect('/profile/update');
});

// @route GET /image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    //This is how you access multiple images at once
    /*  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });             */

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
      // Read output to browser
      // option can be file.filename or others
      var readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

//Test on image database
//GET /profile/test


//include routes
var routes = require('./routes/index');
app.use('/',routes);

//These are middlewares and they handle all errors like 404 etc at Last after all rendering
//These are boiler plate codes
//catch 404 and forwrd to error handler
app.use(function(req,res,next){
	var err = new Error('File Not found');
	err.status = 404;
	next(err);
});

//error handler this is last middleware error handler 
//define as the last app.use callback
app.use(function(err,req,res,next){
	res.status(err.status || 500);
	res.render('error',{
		message: err.message,
		error: {}
	});
});



//listen on port 3000
app.listen(3000, function() {
	console.log("Server is running on port 3000...");	
} );
