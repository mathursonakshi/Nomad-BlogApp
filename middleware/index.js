var Blog = require("../models/blog");

// all the middleare goes here
var middlewareObj = {};

//check if user is logged in and owns the blog before edit or delete
middlewareObj.checkBlogOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
           if(err){
			   req.flash("error","Blog not found!");
               res.redirect("back");
           }  else {
               // does user own the Blog?
			   console.log(foundBlog);
			   console.log(req.user._id);
            if(foundBlog.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error","You don't have permission to do that!");
                res.redirect("back");
            }
           }
        });
    } else{
		req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }
}

//check if the user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	//adding flash error message when a user needs to login
	req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;