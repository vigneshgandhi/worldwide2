var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
// var multer = require("multer");
var favicon = require("serve-favicon");
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/video','./routes/users');
var adminRouter = require("./routes/admin");
var params = require("./params/params");
var setpassport = require("./setuppassport");
var app = express();

mongoose.connect(params.DBC,{useCreateIndex: true,useNewUrlParser:true,useUnifiedTopology:true});
setpassport();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
  secret:'asakfwlkefj3uiortliwrolser_323!@',
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/Uploads",express.static(path.resolve(__dirname,'Uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(indexRouter);
app.use(usersRouter);
app.use(adminRouter);
app.use(require("./routes/video"));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
