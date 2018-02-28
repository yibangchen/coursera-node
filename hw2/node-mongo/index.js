const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/conFusion';

MongoClient.connect(url, (err, db) => {

	assert.equal(err, null);

	console.log('Connected correctly to the server');

	const collection = db.collection("dishes");
	
	collection.insertOne({"name":"Patrick", "description":"kitten"}, 
		(err, result) => {
			assert.equal(err, null);

			console.log("After insert: \n");
			console.log(`${result.ops} operation(s) done`);

			collection.find({}).toArray((err, docs) => {
				assert.equal(err, null);

				console.log('Found: \n');
				console.log(docs);

				db.dropCollection("dishes", (err, result) => {
					assert.equal(err, null);

					db.close();
				});
			});
		});
})