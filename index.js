if ( process.env.NODE_ENV !== "production" )
{
	require( "dotenv" ).config();
}

const express = require( "express" );
const mongoose = require( "mongoose" );
const Course = require( "./Model/Course" );
const Lecture = require( "./Model/Lecture" );
const cors = require( "cors" );
const ejsMate = require( "ejs-mate" );
const methodOverride = require( "method-override" );
const bodyParser = require( "body-parser" );
const path = require( "path" );
const morgan = require( "morgan" );
const app = express();
const port = 8080;

const DB_URL = process.env.DB_URL;
main().catch( ( err ) => console.log( err ) );
async function main ()
{
	await mongoose.connect( DB_URL );
	console.log( "connection is on!!" );
}

app.engine( "ejs", ejsMate );
app.set( "view engine", "ejs" );
app.set( "views", path.join( __dirname, "views" ) );
app.use( express.static( path.join( __dirname, "public" ) ) );
app.use( cors() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( morgan( "dev" ) );
app.use( methodOverride( "_method" ) );

app.get( "/", async ( req, res ) =>
{
	const data = await Course.find( {} )
		.populate( { path: "lectures" } );
	console.log( "hit" );
	res.send( data );
} );

app.get( "/admin", async ( req, res ) =>
{
	const lecture = await Lecture.find( {} );
	const data = await Course.find( {} )
		.populate( { path: "lectures" } );
	console.log( data, lecture );
	console.log( "hit" );
	res.render( "index", { data } );
} );

app.get( "/admin/course/:courseId/new-lecture", async ( req, res ) =>
{
	const course = await Course.findById( req.params.courseId );
	console.log( course );
	res.render( "new-lecture", { course } );
} );

app.get( "/admin/course/:courseId/:lectureId", async ( req, res ) =>
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
} );

app.get( "/admin/new", ( req, res ) =>
{
	console.log( "hit" );
	res.render( "new" );
} );

app.post( "/admin/new", async ( req, res ) =>
{
	const course = new Course( req.body );
	await course.save();
	console.log( "hit" );
	console.log( "Done", course );
	res.redirect( "/admin" );
} );

app.put( "/admin/course/:courseId/:lectureId", async ( req, res ) =>
{
	const lecture = await Lecture.findByIdAndUpdate( req.params.lectureId, req.body );
	console.log( "hit" );
	console.log( lecture );
	res.redirect( "/admin" );
} );

app.delete( "/admin/course/:courseId", async ( req, res ) =>
{
	await Course.findByIdAndDelete( req.params.courseId );
	console.log( "hit" );
	console.log( "done" );
	res.redirect( "/admin" );
} );


app.post( "/admin/course/:courseId/new-lecture", async ( req, res ) =>
{
	const course = await Course.findById( req.params.courseId );
	const lecture = new Lecture( req.body );
	course.lectures.push( lecture );
	await lecture.save();
	await course.save();
	console.log( course, lecture );
	res.redirect( "/admin" );
} );

app.delete( "/admin/course/:courseId/:lectureId", async ( req, res ) =>
{
	await Lecture.findByIdAndDelete( req.params.lectureId );
	console.log( "done" );
	res.redirect( "/admin" );
} );
app.listen( port, () =>
{
	console.log( `Online on port ${ port }` );
} );