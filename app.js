var express      			=  require('express'),
	app          			=  express(),
    bodyParser   			=  require("body-parser"),
    mongoose     			=  require("mongoose"),
	methodOverride 			=  require("method-override"),
	Blog					=  require("./models/blog"),
	expressSanitizer		=  require("express-sanitizer"),
	passport    			=  require("passport"),
	LocalStrategy			=  require("passport-local"),
	passportLocalMongoose 	=  require("passport-local-mongoose"),
	flash					=	require("connect-flash"),
	User         			=  require("./models/user");

//adding route files
var blogRoutes		=	require("./routes/blogs"),
	indexRoutes		=	require("./routes/index");;
//conencting to mongo db
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//var url = process.env.DATABASEURL || "mongodb://localhost/blog_app";
mongoose.connect(process.env.DATABASEURL);
//APP CONFIG
//setting up method overridapp.use(methodOverride("_method"));
app.use(methodOverride("_method"));
//setting up body-parser
app.use(bodyParser.urlencoded({extended:true}));
//setting up express-sanitizer
app.use(expressSanitizer());
//setting up ejs as viewing engine
app.set("view engine","ejs");
//find assets like external stylesheets in public library
app.use(express.static(__dirname+"/public"));
//setting up flash for error messages
app.use(flash());
//moment js setup
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Abrini",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware that will run for every single route
app.use(function(req,res,next){
	res.locals.currentUser=	req.user;
	res.locals.error	  =	req.flash("error");
	res.locals.success	  =	req.flash("success");
	next();
});

//using routes
app.use(indexRoutes);
app.use(blogRoutes);

//setting server to listen on port 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server has started!!!");
});