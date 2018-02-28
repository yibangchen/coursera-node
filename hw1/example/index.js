var rect = require('./rectangle');

function solveRect(l, b) {
	rect(l, b, (err, rectangle) => {
		if (err)
			console.log("ERROR: ", err.message);
		else {
			console.log("The area is: " + rectangle.area());
			console.log("The perimeter is: " + rectangle.perimeter());
		}
	});
}

solveRect(2, 4);
solveRect(3, 5);
