const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config()
const cors = require('cors')

const app = express();
const port = 4000;

const movieRoutes = require("./routes/movie");
const userRoutes = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb+srv://admin:admin1234@cluster0.hwilf0l.mongodb.net/Movie-Catalog-System?retryWrites=true&w=majority&appName=Cluster0');

let db = mongoose.connection;

db.on('error' , console.error.bind(console, 'connection error'));
db.once('open', () => console.log(`We're now connected to MongoDb Atlas`));

app.use('/movies', movieRoutes);
app.use('/users', userRoutes)

if(require.main === module){
	app.listen(process.env.PORT || port, () => {
	    console.log(`API is now online on port ${ process.env.PORT || port }`)
	});
}

module.exports = { app, mongoose }