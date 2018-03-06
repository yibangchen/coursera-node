var passport = require('passport');

// authentication strategy
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

// user authentication function: User.authenticate() can be written by hand 
exports.local = passport.use(new LocalStrategy(User.authenticate()));

// session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
	console.log('*******checkpoint 1');
	return jwt.sign(user, config.secretKey, 
		{expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
exports.jwtPassport = passport.use(new JwtStrategy(opts,
	(jwt_payload, done) => {
		console.log("JWT payload: ", jwt_payload);
		User.findOne({_id: jwt_payload._id}, (err, user) => {
			if (err) {
				return done(err, false); // callback function
			}
			else if (user) {
				return done(null, user);
			}
			else {
				return done(null, false);
			}
		});
	}));

exports.verifyUser = passport.authenticate('jwt', {session: false});