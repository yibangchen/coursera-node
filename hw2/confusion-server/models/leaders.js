const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
    	type: String,
    	required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    feature: {
    	type: Boolean,
    	default: false
    },
    comments: [commentSchema]	// sub document
},{
    timestamps: true
});

module.exports = leadSchema;
