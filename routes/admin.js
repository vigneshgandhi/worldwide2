const express = require('express');
var Auser = require("../models/Auser");
var passport = require('passport');
var bodyParser = require('body-parser');
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");
var fs = require("fs");
var users=require("../models/user");
const { ensureAuthenticated } = require('../auth/auth');

const app = express.Router();

var storage = multer.diskStorage({
    destination:'./Uploads/images/',
    filename:function(req, file, cb){
      crypto.pseudoRandomBytes(16,function(err,raw){
        cb(null,raw.toString('hex') + Date.now() + path.extname(file.originalname));
    });
   }
});
  
var upload = multer({storage:storage});

app.use(bodyParser.urlencoded({extended:false}));
app.get('/Admin/portfolio/signup',(req, res) => {
    res.render("Admin/adminsignup");
});

app.get('/Admin/portfolio/login',(req,res)=>{
    users.find({}).exec((err,users)=>{
        if(err){console.log(err);}
        res.render("Admin/adminlogin",{users:users})
    });
});
app.post("/Admin/portfolio/signup",upload.single("file"),(req,res,next)=>{
    var username = req.body.username;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var avatar = req.file.path;
    var password = req.body.password;
    Auser.findOne({email: email},(err,user)=>{
        if(err){
        return next(err);
        }
        if(user){
        req.flash("error","There's already an account exists");
        return res.render("/login");
        }
        var newAuser = new Auser({
        username: username,
        email: email,
        mobile: mobile,
        avatar: avatar,
        password: password
        });
        newAuser.save(function(err,user){
        if(err){console.log(err);}
        console.log(user);
        req.flash("info","Account was created Successfully");
        res.redirect("login");
        });
    });
});
app.post("/Admin/portfolio/login",passport.authenticate("login",{
    successRedirect:"/Admin/cracsky/loky",
    failureRedirect:"/login",
    failureFlash:true
}));

app.get("/Admin/cracsky/loky",ensureAuthenticated,(req,res)=>{
    res.render("Admin/adminpage");
});
module.exports = app;