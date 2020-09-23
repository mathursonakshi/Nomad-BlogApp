var express 	= require("express");
var router 		= express.Router();
var Blog        = require("../models/blog");
var middleware  = require("../middleware");
					  
// //RESTFUL ROUTES
router.get("/",function(req,res){
	res.redirect("/blogs");
});
//INDEX Route
router.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err)
			{
				console.log(err);
			}
		else
		{
			res.render("index",{blogs:blogs});	
		}
	});
});
//NEW Route
router.get("/blogs/new",middleware.isLoggedIn,function(req,res){
	res.render("new");
});
//CREATE Route
router.post("/blogs",middleware.isLoggedIn,function(req,res){
	 var title=req.body.blog.title;
	 var image=req.body.blog.image;
	 var body=req.sanitize(req.body.blog.body);//sanitize input
	 var author = {
      id: req.user._id,
      username: req.user.username
     }
	var newBlog = {title: title, image: image, body: body, author: author};
	//create blog
	Blog.create(newBlog,function(err,newBlog){
		if(err)
			{
				res.render("new");
			}
		else
			{
				req.flash("success","Successfully Added Blog Post!!")
				//redirect to index
				res.redirect("/blogs");
			}
	});
});
//SHOW Route
router.get("/blogs/:id",function(req,res){
	//find a blog with provided id
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			{
				res.redirect("/blogs");
			}
		else
			{
			 res.render("show",{blog:foundBlog});
			}
	});
});
//EDIT Route
router.get("/blogs/:id/edit",middleware.checkBlogOwnership, function(req, res){
	//find a blog with provided id
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			{
				req.flash("error","Blog not found!");
				res.redirect("/blogs");
			}
		else
			{
			 res.render("edit",{blog:foundBlog});
			}
	});
});
//UPDATE Route
router.put("/blogs/:id",middleware.checkBlogOwnership,function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err)
			{
		    	req.flash("error", err.message);
           		res.redirect("back");
			}
		else
			{ 
				req.flash("success","Successfully Updated!");
				res.redirect("/blogs/"+req.params.id);
			}
	});
});
//DELETE Route
router.delete("/blogs/:id",middleware.checkBlogOwnership, function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
		   req.flash("error","Blog not found!");
           res.redirect("/blogs");
       } else {
		   req.flash("success","Blog Post Deleted!");
           res.redirect("/blogs");
       }
   });
});
module.exports = router;
