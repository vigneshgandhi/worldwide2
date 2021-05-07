var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var path = require("path");
var crypto = require("crypto");
var flash = require("connect-flash");
var ensureAuthenticated = require("../auth/auth").ensureAuthenticated;
var multer = require("multer");
var User = require('../models/user');
var Post = require('../models/upload');
const { Console } = require('console');

var app = express();

var router = express.Router();

router.use(flash());
router.use(bodyParser.urlencoded({extended:false}));
/* GET home page. */
var storage = multer.diskStorage({
  destination:'./Uploads/images/',
  filename:function(req, file, cb){
    crypto.pseudoRandomBytes(16,function(err,raw){
      cb(null,raw.toString('hex') + Date.now() + path.extname(file.originalname));
    });
  }
});

var upload = multer({storage:storage});

router.get('/', function(req, res) {
  Post.find({}).exec(function(err,posts){
    if(err){console.log(err);}
    // if(path.extname(Post.videos))
    res.render('home/index',{posts:posts});
  });
});
router.get('/home',(req,res)=>{
  req.flash("info","redirect to index file");
  res.redirect("/");
});

router.get('/login',function(req,res){
  res.render('home/login');
});
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect("/");
});
router.post("/login",passport.authenticate("login",{
  successRedirect:"/",
  successFlash:true,
  failureRedirect:"/login",
  failureFlash:true,
  successMessage:"successfully logged in",
  failureMessage:"Invalid username or password (OR) username doesnot exits"
}));

router.get('/signup',(req,res)=>{
  res.render('home/signup', {title: 'Express'});
});

router.post("/signup",upload.single("file"),(req,res,next)=>{
  var username = req.body.username;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var avatar = req.file.path;
  var password = req.body.password;
  User.findOne({email: email},(err,user)=>{
    if(err){
      return next(err);
    }
    if(user){
      req.flash("error","There's already an account exists");
      return res.render("/login");
    }
    var newUser = new User({
      username: username,
      email: email,
      mobile: mobile,
      avatar: avatar,
      password: password
    });
    newUser.save(function(err,user){
      if(err){console.log(err);}
      console.log(user);
      req.flash("info","Account was created Successfully");
      res.redirect("login");
    });
  });
});
router.get("/profile",ensureAuthenticated,(req,res)=>{
    User.find({email:req.user.email}).exec(function(err,users){
      if(err){console.log(err);}
      // res.json(users);
      res.render("home/profile",{users:users});
    });
});
router.get("/about",(req,res)=>{
  res.render("home/about");
});
router.post('/search/process', function(req, res, next) {
  var keyword = req.body.keyword;
  console.log(keyword);
  res.redirect(`/search/${keyword}`);
});
router.get('/search/:keyword',(req,res)=>{
  Post.find({title: req.params.keyword}).exec(function(err,posts){
    if(err){console.log(err);}
    res.render("videos/sec",{posts:posts});
  });
});

module.exports = router;
