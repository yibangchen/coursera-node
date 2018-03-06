const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req,res,next) => {
    // res.end('Will send all the dishes to you!');
    Dishes.find()
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    // res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish created');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    // NOT ALLOWED
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.remove()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);        
    }, (err) => next(err))
    .catch((err) => next(err));
    // res.end('Deleting all dishes');
});

dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
    // res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish created', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true})
    .then((dish) => {
        console.log('Dish updated');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));    
    // res.write('Updating the dish: ' + req.params.dishId + '\n');
    // res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);        
    }, (err) => next(err))
    .catch((err) => next(err));
});


dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        } else {
            err = new Error(`Dish ${req.params.dishId} not exists`);
            err.status = 404;
            return next(err); // will handle in app.js
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    // res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null){
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            })
        } else {
            err = new Error(`Dish ${req.params.dishId} not exists`);
            err.status = 404;
            return next(err); // will handle in app.js
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    // NOT ALLOWED
    res.statusCode = 403;
    res.end('PUT operation not supported');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null){
            for (var i = (dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove({});
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            })

        } else {
            err = new Error(`Dish ${req.params.dishId} not exists`);
            err.status = 404;
            return next(err); // will handle in app.js
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        } else if (dish == null) {
            err = new Error(`Dish ${req.params.dishId} not exists`);
            err.status = 404;
            return next(err); // will handle in app.js
        } else {
            err = new Error(`Dish comment ${req.params.commentId} not exists`);
            err.status = 404;
            return next(err); // will handle in app.js
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    // res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
})
.post((req, res, next) => {
    // NOT ALLOWED
    res.statusCode = 403;
    res.end('POST operation not supported');
})
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null){
            if (req.body.rating)
                dish.comments.id(req.params.commentId).rating = req.body.rating;

            if (req.body.comment)
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments.id(req.params.commentId));                
            }, (err) => next(err));
        } else if (dish == null) {
            err = new Error(`Dish ${req.params.dishId} not exists`);
            err.status = 404;
            return next(err); // will handle in app.js
        } else {
            err = new Error(`Dish comment ${req.params.commentId} not exists`);
            err.status = 404;
            return next(err); // will handle in app.js
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null){
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);                
            }, (err) => next(err));        
        } 
        else if (dish == null) {
            err = new Error(`Dish ${req.params.dishId} not exists`);
            err.status = 404;
            return next(err); // will handle in app.js
        } else {
            err = new Error(`Dish comment ${req.params.commentId} not exists`);
            err.status = 404;
            return next(err); // will handle in app.js
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;