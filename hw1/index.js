const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'))
.use(bodyParser.json())
.use('/dishes', dishRouter)
.use('/promotions', promoRouter)
.use('/leaders', leaderRouter)
.use(express.static(__dirname+'/public'))
.use((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type','text/html');
	res.end('<html><body><h1>This is an Express Server</h1></body></html>')
});

const server = http.createServer(app);
server.listen(port, hostname, ()=>{
	console.log(`Server running at http://${hostname}:${port}/`);
});