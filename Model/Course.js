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
})

const courseSchema = new mongoose.Schema( {
	id: Number,
	day: String,
	lectures: [lectureSchema]
} );

module.exports = mongoose.model( "Course", courseSchema );