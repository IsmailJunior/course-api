const mongoose = require( "mongoose" );

const lectureSchema = new mongoose.Schema( {
	id: Number,
	title: String,
	description: String,
	instructor: String,
	duration: String,
	time: String,
	image: String,
	hall: String
} );

module.exports = mongoose.model( "Lecture", lectureSchema );
