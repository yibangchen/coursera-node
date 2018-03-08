var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
	User.register({username: req.body.username}
		,req.body.password, (err, user) => {
			if (err) {
				console.log(err.message);
			  	res.statusCode = 500;
			  	res.setHeader = ('Content-Type', 'application/json');
			  	res.json({err: err});				
			} else {	
				if (req.body.firstname)
					user.firstname = req.body.firstname;
				if (req.body.last)
					user.lastname = req.body.lastname;
				// after changes modifications need to be saved!
				user.save((err, user) => {
					if (err) {
						res.statusCode = 500;
						res.setHeader('Content-Type', 'application/json');
						res.json({err: err});
						return ;
					}
					passport.authenticate('local')(req, res, () => {
					  	res.statusCode = 200;
					  	res.setHeader('Content-Type', 'application/json');
					  	res.json({success: true, status: 'Registration Successful'});
					});

				});
			}
		});
/*
  User.findOne({username: req.body.username})
  .then((user) => {
  	if (user != null) {
  		var err = new Error(`User ${req.body.username} already exsited`);
  		err.status = 403;
  		next(err);
  	} else {
  		return User.create({
  			username: req.body.username,
  			password: req.body.password
  		});
  	}
  })
  .then((user) => {
  	res.statusCode = 200;
  	res.setHeader = ('Content-Type', 'application/json');
  	res.json({status: 'Registration Successful', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));
*/
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

/*
router.post('/login', (req, res, next) => {
	if (! req.session.user) {
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

	    // if user exists
	    User.findOne({username: username})
	    .then((user) => {
		    if (user.password === password) {
		      // SET COOKIE here
		      // res.cookie('user','admin',{signed: true});
		      req.session.user = 'authenticated';
		      res.statusCode = 200;
		      res.setHeader('Content-Type', 'application/json');
		      res.end('You are authenticated');
		    } 
		    else if (user.password !== password) {
		      var err = new Error("Incorrect password!");
		      res.setHeader('WWW-Authenticate', 'Basic');
		      err.status = 403;
		      next(err);		    	
		    }
		    else if (user === null) {
		      var err = new Error(`Username ${user.username} does not exist`);
		      res.setHeader('WWW-Authenticate', 'Basic');
		      err.status = 401;
		      next(err);
		    }
	    })
	    .catch((err) => next(err));
	  }
	  else {
	  	res.statusCode = 200;
	  	res.setHeader('Content-Type', 'text/plain');
	  	res.end('You are already authenticated');
	  }
});
*/

router.get('/logout', (req, res, next) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie('session-id');// already set this at client
		res.redirect('/');
	} else {
		var err = new Error('You are not logged in');
		err.status = 403;
		next(err);
	}
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
	if (req.user) {
		var token = authenticate.getToken({_id: req.user._id});
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({success: true, token: token, status: 'You are successfully logged in!'});
	}
})

module.exports = router;
