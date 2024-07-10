const Movie = require('../models/Movie');
const User = require('../models/User');

module.exports.addMovie = async (req, res) => {
    try {
        const existingMovie = await Movie.findOne({ title: req.body.title });

        if (existingMovie) {
            return res.status(409).send({ error: 'Movie already exists' });
        }

        let newMovie = new Movie({
            title: req.body.title,
            director: req.body.director,
            year: req.body.year,
            description: req.body.description,
            genre: req.body.genre
        });

        const savedMovie = await newMovie.save();
        return res.status(201).send(savedMovie);
    } catch (err) {
        console.error('Error in adding the movie: ', err);

        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(409).send({ error: 'Movie already exists' });
        }

        return res.status(500).send({ error: 'Failed to save the movie' });
    }
};


module.exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        
        if (movies.length > 0) {
            return res.status(200).send({ movies: movies });
        } else {
            return res.status(200).send({ message: 'No movies found.' });
        }
    } catch (findErr) {
        console.error('Error in finding all movies: ', findErr);
        return res.status(500).send({ error: 'Error finding movies.' });
    }
};

module.exports.getMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        return res.status(200).send(movie);
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports.updateMovie = async (req, res) => {
    let movieId = req.params.movieId;

    let updatedMovie = {
        title: req.body.title,
        director: req.body.director,
        year: req.body.year,
        description: req.body.description,
        genre: req.body.genre
    };

    try {
        let updateMovie = await Movie.findByIdAndUpdate(movieId, updatedMovie, { new: true });
        
        if (updateMovie) {
            return res.status(200).send({
                message: 'Movie updated successfully',
                updatedMovie: updateMovie
            });
        } else {
            return res.status(404).send({ error: 'Movie not found' });
        }
    } catch (updateErr) {
        console.error('Error in updating the movie: ', updateErr);
        return res.status(500).send({ error: 'Error in updating the movie' });
    }
};

module.exports.deleteMovie = async (req, res) => {

    let movieId = req.params.movieId;
    
	try {
        const deletedMovie = await Movie.findByIdAndDelete(movieId);
        if(!deletedMovie){
            return res.status(404).send({ error: 'Movie not found'});
        }

        return res.status(200).send({ message: 'Movie deleted successfully'});
    }

    catch (err) {
        console.log('Error in deleting movie: ', err);
        return res.status(500).send({error : 'Error in deleting movie'});
    }

}

module.exports.addComment = async (req, res) => {
    const movieId = req.params.movieId;
    const newComment = {
        userId: req.user.id,
        comment: req.body.comment
    }

    try{
        const movie = await Movie.findById(movieId);
        if(!movie){
            return res.status(404).send({ error: 'Movie not found' })
        }

        movie.comments.push(newComment)
        const updatedMovie = await movie.save();
        if(!updatedMovie){
            return res.status(500).send({ error: 'Error in updating the movie'})
        }

        return res.status(200).send({
            message: 'comment added successfully',
            updatedMovie
        })
    }
    catch (err) {
        console.log('error in adding comment: ', err);
        return res.status(500).send({error : 'error in adding comment'});
    }
}

module.exports.getComments = async (req, res) => {
    const movieId = req.params.movieId;
    try{
        const movie = await Movie.findById(movieId)
        if(!movie){
            return res.status(404).send({error: 'Movie not found'})
        }
        return res.status(200).send({ comments: movie.comments})
    }
    catch (err) {
        console.log('error in retreiving comments: ', err);
        return res.status(500).send({error : 'error in retreiving comments'});
    }
}