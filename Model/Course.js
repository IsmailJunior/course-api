const mongoose = require( "mongoose" );
const Lecture = require( "./Lecture" );

const courseSchema = new mongoose.Schema( {
	id: Number,
	day: String,
	lectures: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Lecture"
		}
	]
} );

module.exports = mongoose.model( "Course", courseSchema );