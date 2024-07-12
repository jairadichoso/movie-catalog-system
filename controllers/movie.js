const Movie = require('../models/Movies');

module.exports.addMovie = async (req, res) => {
    const { title, director, year, description, genre } = req.body
    
    const movie = await Movie.findOne({ title });
    if(movie) {
        return res.status(409).send({ error: 'Movie already exists'}) 
    }

    let newMovie = new Movie({
        title,
        director,
        year,
        description,
        genre
    })

    try{
        const savedMovie = await newMovie.save();
        return res.status(201).send(savedMovie);
    }
    catch (err) {
        console.log('Error in adding movie',err);
        return res.status(500).send({ message: 'Error in adding movie'})
    }
}

module.exports.getMovies = async (req, res) => {
    
    try{
        const movies = await Movie.find({});
        if(movies.length <= 0){
            return res.status(404).send({ error: "No Movies Found" })
        }
        return res.status(200).send({movies})
    }
    catch(err){
        console.error('Error in getting Movies: ', err);
        return errors.status(500).send({ error: 'Error in getting movies' })
    }
}

module.exports.getMovie = async (req, res) => {
    try{
        const movie = await Movie.findById(req.params.movieId);
        if(!movie) {
            return res.status(404).send({ error: "Movie not found" })
        }
        return res.status(200).send(movie)
    }
    catch(err){
        console.error('Error in getting Movies: ', err);
        return errors.status(500).send({ error: 'Error in getting movies' })
    }
}

module.exports.updateMovie = async (req, res) => {
    const movieId = req.params.movieId;
    const { title, director, year, description, genre } = req.body
    const newMovie = {
        title,
        director,
        year,
        description,
        genre
    }

    try{
        const updatedMovie = await Movie.findByIdAndUpdate(movieId, newMovie, {new :true});
        if(updatedMovie){
            return res.status(200).send({
                message: "Movie updated successfully",
                updatedMovie
            })
        }
    }
    catch(err) {
        console.error('Error in updating Movie: ', err);
        return res.status(500).send({ error: 'Error in updating the Movie'})
    }
}

module.exports.deleteMovie = async (req, res) => {
    const movieId = req.params.movieId;
    try{
        const deletedMovie = await Movie.findByIdAndDelete(movieId);
        if(!deletedMovie) {
            return res.status(404).send({ error: "Movie not found" })
        }

        return res.status(200).send({ message: "Movie deleted successfully" })
    }
    catch(err) {
        console.error('Error in deleting Movie: ', err);
        return res.status(500).send({error:'Error in deleting movie'})
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