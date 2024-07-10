const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required']
    },
    comment: {
        type: String,
        required: [true, 'Comment is required']
    },
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Movie Name is required']
    },
    director: {
        type: String,
        required: [true, 'Movie Director is required']
    },
    year: {
        type: Number,
        required: [true, 'Movie Year is required']
    },
    description: {
        type: String,
        required: [true, 'Movie Description is required']
    },
    genre: {
        type: String,
        required: [true, 'Genre Description is required']
    },
    comments: [commentSchema]
});

module.exports = mongoose.model('Movie', movieSchema);