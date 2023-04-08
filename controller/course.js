const Course = require( "../models/Course" );
const Lecture = require( "../models/Lecture" );

module.exports.index = async ( req, res ) =>
{
	const data = await Course.find( {} )
		.populate( { path: "lectures" } );
	console.log( "hit" );
	res.send( data );
};

module.exports.renderAdmin = async ( req, res ) =>
{
	const lecture = await Lecture.find( {} );
	const data = await Course.find( {} )
		.populate( { path: "lectures" } );
	console.log( data, lecture );
	console.log( "hit" );
	res.render( "index", { data } );
};

module.exports.renderNewLecture = async ( req, res ) =>
{
	const course = await Course.findById( req.params.courseId );
	console.log( course );
	res.render( "new-lecture", { course } );
};

module.exports.renderLecture = async ( req, res ) =>
{
	const course = await Course.findOne( { _id: req.params.courseId } )
		.populate( { path: "lectures" } );
	const lectures = course.lectures.map( lecture => lecture );
	const lecture = lectures.find( lecture =>
	{
		return lecture._id == req.params.lectureId;
	} );
	console.log( lecture );
	console.log( "hit" );
	res.render( "lecture", { lecture, course } );
};

module.exports.renderNewCourse = ( req, res ) =>
{
	console.log( "hit" );
	res.render( "new" );
};

module.exports.createCourse = async ( req, res ) =>
{
	const course = new Course( req.body );
	await course.save();
	console.log( "hit" );
	console.log( "Done", course );
	res.redirect( "/admin" );
};

module.exports.updateLecture = async ( req, res ) =>
{
	const lecture = await Lecture.findByIdAndUpdate( req.params.lectureId, req.body );
	console.log( "hit" );
	console.log( lecture );
	res.redirect( "/admin" );
};

module.exports.deleteCourse = async ( req, res ) =>
{
	await Course.findByIdAndDelete( req.params.courseId );
	console.log( "hit" );
	console.log( "done" );
	res.redirect( "/admin" );
};

module.exports.createLecture = async ( req, res ) =>
{
	const course = await Course.findById( req.params.courseId );
	const lecture = new Lecture( req.body );
	course.lectures.push( lecture );
	await lecture.save();
	await course.save();
	console.log( course, lecture );
	res.redirect( "/admin" );
};

module.exports.deleteLecture = async ( req, res ) =>
{
	await Lecture.findByIdAndDelete( req.params.lectureId );
	console.log( "done" );
	res.redirect( "/admin" );
};