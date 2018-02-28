const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const dboper = require('./operations');
const url = 'mongodb://localhost:27017';

MongoClient.connect(url)
.then((client) => {

	console.log('Connected correctly to the server');
	var db = client.db('conFusion');

	dboper.insertDocument(db, {name: "Vadonut", description: "test"},
		"dishes")
		.then((result) => {
			console.log("Insert Document:\n", result.ops);

            dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Documents:\n", docs);

            dboper.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" }, "dishes");
        })
        .then((result) => {
            console.log("Updated Document:\n", result.result);

            dboper.findDocuments(db, "dishes");
        })
        .then((docs) => {
            console.log("Found Updated Documents:\n", docs);
            
            db.dropCollection("dishes")
        })
        .then((result) => {
            console.log("Dropped Collection: ", result);

            client.close();
        });
}, (err) => console.log(err))
.catch((err) => console.log(err));

// MongoClient.connect(url, (err, client) => {

// 	assert.equal(err, null);

// 	console.log('Connected correctly to the server');

// 	var db = client.db('conFusion');
// 	const collection = db.collection("dishes");

// 	collection.insertOne({"name":"Patrick", "description":"kitten"}, 
// 		(err, result) => {
// 			assert.equal(err, null);

// 			console.log("After insert: \n");
// 			console.log(`${result.ops} operation(s) done`);

// 			collection.find({}).toArray((err, docs) => {
// 				assert.equal(err, null);

// 				console.log('Found: \n');
// 				console.log(docs);

// 				db.dropCollection("dishes", (err, result) => {
// 					assert.equal(err, null);

// 					client.close();
// 				});
// 			});
// 		});
// });