const express = require('express');
// var eupload = require("express-fileupload");
var bodyParser = require('body-parser');
// var mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");
var multer = require("multer");
// var formidable = require("formidable");
var flash = require("connect-flash");
var Post = require("../models/upload");
var Feed = require("../models/feed");

const router = express.Router();
var storage = multer.diskStorage({
  destination:'./Uploads/',
  filename:function(req, file, cb){
    crypto.pseudoRandomBytes(16,function(err,raw){
      cb(null,raw.toString('hex') + Date.now() + path.extname(file.originalname));
    });
  }
});

var upload = multer({storage:storage});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));


var ensureAuthenticated = require("../auth/auth").ensureAuthenticated;
router.use(express.static(path.resolve(__dirname,'../Uploads')));
router.use(express.static('../public'));



// routing pages 
router.get("/videos",ensureAuthenticated,(req,res)=>{
    Post.find({userID:req.user._id}).exec(function(err,posts){
      if(err){console.log(err);}
      res.render("videos/video",{posts:posts});
    });
});
router.get("/videos/feedback",ensureAuthenticated,(req,res)=>{
    res.render("videos/feedback");
});
router.post("/videos/feedback",(req,res)=>{
    var newFeed = new Feed({
      name: req.body.username,
      email: req.body.email,
      comment: req.body.comments
    });
    newFeed.save(function(err,post){
      if(err){return err;}
      else{
        res.redirect("/");
      }
    });
});
router.get("/videos/watches/:title",(req,res)=>{
  Post.find({title: req.params.title}).exec(function(err,posts){
    if(err){return err;}
    Post.find({}).exec(function(err,posts1){      
      if(err){console.log(err);}
      res.render("videos/watch",{posts:posts,posts1:posts1,title: req.params.title});
    });
  });
});




router.get("/videos/upload-videos",ensureAuthenticated,(req,res)=>{
    res.render("videos/upload-videos");
});
router.post("/videos/upload-videos",upload.single("file"),(req,res)=>{
  try{
    var newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      thumbnail:req.body.thumbnail,
      userID: req.user._id,
      videos: req.file.path
    });
    newPost.save(function(err,post){
      if(err){return err;}
      req.flash("info","file uploaded successfully");
      res.redirect("/");
    });
  }
  catch(err){
    console.log("error occured")
    return res.status('500').send(err);
  }
});
router.get("/videos/feedback/view",ensureAuthenticated,(req,res)=>{
    Feed.find({}).exec(function(err,feeds){
      if(err){console.log(err);}
      res.json(feeds);
    });  
});



router.get("/videos/delete/:title",ensureAuthenticated,(req,res)=>{
  Post.deleteOne({title: req.params.title}).exec(function(err,post){
    if(err){console.log(err);}
    console.log(post);
    req.flash("info","file deleted");
    res.redirect("/");
  });
});


module.exports = router;
