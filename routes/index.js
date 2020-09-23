var express		=	require('express');
var router		=	express.Router();
var User        =   require("../models/user");
var passport    =   require("passport");

// ===============
//AUTH ROUTES
//===============

//register:show sign-up page
router.get("/register",function(req,res){
	res.render("register");
});
 //handle sign-up logic
router.post("/register",function(req,res){
	var newUser	= new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err)
			{
				console.log(err);
   				return res.render("register", {error: err.message});
			}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to the Nomad "+user.username);
			res.redirect("/blogs");
		});
	});
});
//show login information
router.get("/login",function(req,res){
	res.render("login");
});

//handling login logic
router.post("/login",passport.authenticate("local",
	{
		successRedirect:"/blogs",
		failureRedirect:"/login"
	}), function(req,res){
	
});
//logout route
router.get("/logout",function(req,res){
		req.logout();
		req.flash("success","Logged You Out!");
		res.redirect("/blogs");
	});

module.exports = router;
