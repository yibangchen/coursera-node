const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Connected correctly to server');

    Dishes.create({
        name: 'Uthappizza',
        description: 'test'
    })
    .then((dish) => {
        console.log(dish);

        // update a dish
        return Dishes.findByIdAndUpdate(dish._id, {
            $set: {description: 'updated test'}
        }, {
            new: true
        })
        .exec();
    })
    .then((dish) => {
        console.log(dish);

        // add/ insert a comment
        dish.comments.push({
            rating: 5,
            comment: 'This is a great place!',
            author: 'Tulippy Cheung'
        });

        return dish.save();
        // return db.collection('dishes').drop();
    })
    .then((dish) => {
        console.log(dish);
        return db.collection('dishes').drop();
    })
    .then(() => {
        return db.close();
    })
    .catch((err) => {
        console.log(err);
    });

});