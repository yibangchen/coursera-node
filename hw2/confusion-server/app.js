var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');

const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');

const url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Connected correctly to server');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));	// FOR Forms
app.use(cookieParser('abcde-12345-yuidk-14235')); // set cookie secret

//Authentication BEFORE client fetching data
function auth(req, res, next) {
  console.log(req.headers);

  if (! req.signedCookies.user) {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      // client did not provide login
      var err = new Error("You need to provide credentials");
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);  // skip all the way to error handler
    }

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':'); // get the encoded string
    var username = auth[0];
    var password = auth[1];

    if (username === 'admin' && password === 'password') {
      // SET COOKIE here
      res.cookie('user','admin',{signed: true});
      next(); // pass to next middleware
    } else {
      var err = new Error("Not authorized");
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }
  } else {
    //already set cookie
    if (req.signedCookies.user === 'admin'){
      next();
    } else {
      var err = new Error("You are not athenticated");
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);  // skip all the way to error handler      
    }
  }

}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
