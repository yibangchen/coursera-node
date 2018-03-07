const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [
	'http://localhost:3000',
	'https://localhost:3000']

var corsOptionsDelegate = (req, callback) => {
	var corsOptions;

	// check if in the whitelist
	if (whitelist.indexOf(req.header('Origin')) !== -1) {
		corsOptions = {origin: true}; // in the list
	}
	else {
		corsOptions = {origin: false};
	}
	callback(null, corsOptions);
};

exports.cors = cors(); // wildcard star
exports.corsWithOptions = cors(corsOptionsDelegate);