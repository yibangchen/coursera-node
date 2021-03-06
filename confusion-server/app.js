var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var index = require('./routes/index');
var users = require('./routes/users');

var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');

const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');

const url = config.mongoUrl;
mongoose.connect(url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Connected correctly to server');
});

var app = express();

// redirect all traffics to https
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();  // why return??
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));	// FOR Forms
//app.use(cookieParser('abcde-12345-yuidk-14235')); // set cookie secret

// app.use(session({
//   name: 'session-id',
//   secret: 'abcde-12345-yuidk-14235',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));
app.use(passport.initialize());
// app.use(passport.session());

app.use('/', index);
app.use('/users', users);

/*
//Authentication BEFORE client fetching data
function auth(req, res, next) {

  console.log(req.user);

  if (! req.user) {
    var err = new Error("You need to provide credentials");
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    next(err);  // skip all the way to error handler
  } else {
    next();
  }
  /*
  console.log(req.session);

  if (! req.session.user) {
    var err = new Error("You need to provide credentials");
    err.status = 403;
    next(err);  // skip all the way to error handler
  } else {
    if (req.session.user === 'authenticated'){
      next();
    } else {
      var err = new Error("You are not athenticated");
      err.status = 403;
      next(err);  // skip all the way to error handler      
    }
  }
  /
}

app.use(auth);
*/

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);

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
