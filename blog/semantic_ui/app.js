var express = require('express'),
 	app = express(),
	bodyparser=require("body-parser"),
	mongoose = require("mongoose"),
	expressSanitizer=require("express-sanitizer"),
	methodOverride=require("method-override");
mongoose.connect("mongodb://localhost:27017/blog",{useNewUrlParser: true});

app.use(methodOverride("_method"));
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(expressSanitizer());


//schema setup

var blogSchema = new mongoose.Schema(
{
title : String,
image : String,
body : String,
created : {type: Date, default :Date.now}
});


var blog = mongoose.model("blog",blogSchema);


//creating the first blog item

//  blog.create( 
// { 
// 	title:"sql",
// 	image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQtfTNiCMZiO-w89LeO9F9-uzGDLkMHJseVwg&usqp=CAU", 
// 	body: "SQL offers two main advantages over older read–write APIs such as ISAM or VSAM. Firstly, it introduced the concept of accessing many records with one single command. Secondly, it eliminates the need to specify how to reach a record, e.g. with or without an index."},
// 	function(err,campground)
// 	{
// 		if(err)
// 			{
// 				console.log(err);
// 			}
// 		else
// 			{
// 				console.log("Newly created campground");
// 			}
// 	}
// )

//Routes

//Index route  used to show all blogs
app.get("/", function(req, res){
		res.redirect("/blogs");
});

app.get("/blogs", function(req, res){

	blog.find({},function(err,allBlogs)
				   {
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("index",{blog:allBlogs})

			}
	})
});

//redirect to form for creating new blog
app.get("/blogs/new", function(req, res){
	res.render("new");
});


	
//post the new blog to data base and then redirect to all blogs page

app.post("/blogs", function(req, res){
//get data from form and add to array
req.body.blog.body=req.sanitize(req.body.blog.body);

	var newblog=req.body.blog;
	blog.create(newblog,function(err,newblog)
					 {
		if(err)
			{
				console.log(err);
			}
		else{
			res.redirect("/blogs")
		}
	})
});

//show more info about one blog

app.get("/blogs/:id", function(req, res){
//get data from form and add to array
	blog.findById(req.params.id,function(err,foundBlog)
					   {
		if(err)
			{
				console.log(err);
			}
		else{
			res.render("show",{blog:foundBlog});
		}
	})

});


//Edit a blog

app.get("/blogs/:id/edit", function(req, res){
//get data from form and add to array
	blog.findById(req.params.id,function(err,foundBlog)
					   {
		if(err)
			{
				console.log(err);
			}
		else{
			res.render("edit",{blog:foundBlog});
		}
	})

});

//Update a blog

app.put("/blogs/:id", function(req, res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundBlog)
					   {
		if(err)
			{
				console.log(err);
			}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});

//Delete a blog

app.delete("/blogs/:id", function(req, res){
	blog.findByIdAndRemove(req.params.id,function(err)
					   {
		if(err)
			{
				console.log(err);
			}
		else{
			res.redirect("/blogs");
		}
	})
});

//Listen for actions in a port
app.listen(process.env.PORT||99,process.env.IP, function(){
	
    console.log("Server has started!!!");
});
