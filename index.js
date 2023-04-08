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
const ExpressError = require( "./utils/ExpressError" );
const app = express();
const port = process.env.PORT || 3000

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/course";
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
	try
	{
		const data = await Course.find( {} )
			.populate( { path: "lectures" } );
		console.log( "hit" );
		res.send( data );
	} catch ( error )
	{
		console.log( error );
	}
} );

app.get( "/admin", async ( req, res ) =>
{
	try
	{
		const lecture = await Lecture.find( {} );
		const data = await Course.find( {} )
			.populate( { path: "lectures" } );
		console.log( data, lecture );
		console.log( "hit" );
		res.render( "index", { data } );
	} catch ( error )
	{
		console.log( error );
	}
} );

app.get( "/admin/course/:courseId/new-lecture", async ( req, res ) =>
{
	try
	{
		const course = await Course.findById( req.params.courseId );
		console.log( course );
		res.render( "new-lecture", { course } );
	} catch ( error )
	{
		console.log( error );
	}
} );

app.get( "/admin/course/:courseId/:lectureId", async ( req, res ) =>
{
	try
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
	} catch ( error )
	{
		console.log( error );
	}
} );

app.get( "/admin/new", ( req, res ) =>
{
	console.log( "hit" );
	res.render( "new" );
} );

app.post( "/admin/new", async ( req, res ) =>
{
	try
	{
		const course = new Course( req.body );
		await course.save();
		console.log( "hit" );
		console.log( "Done", course );
		res.redirect( "/admin" );
	} catch ( error )
	{
		console.log( error );
	}
} );

app.put( "/admin/course/:courseId/:lectureId", async ( req, res ) =>
{
	try
	{
		const lecture = await Lecture.findByIdAndUpdate( req.params.lectureId, req.body );
		console.log( "hit" );
		console.log( lecture );
		res.redirect( "/admin" );
	} catch ( error )
	{
		console.log( error );
	}
} );

app.delete( "/admin/course/:courseId", async ( req, res ) =>
{
	try
	{
		await Course.findByIdAndDelete( req.params.courseId );
		console.log( "hit" );
		console.log( "done" );
		res.redirect( "/admin" );
	} catch ( error )
	{
		console.log( error );
	}
} );


app.post( "/admin/course/:courseId/new-lecture", async ( req, res ) =>
{
	try
	{
		const course = await Course.findById( req.params.courseId );
		const lecture = new Lecture( req.body );
		course.lectures.push( lecture );
		await lecture.save();
		await course.save();
		console.log( course, lecture );
		res.redirect( "/admin" );
	} catch ( error )
	{
		console.log( error );
	}
} );

app.delete( "/admin/course/:courseId/:lectureId", async ( req, res ) =>
{
	try
	{
		await Lecture.findByIdAndDelete( req.params.lectureId );
		console.log( "done" );
		res.redirect( "/admin" );
	} catch ( error )
	{
		console.log( error );
	}
} );
app.all( "*", ( req, res, next ) =>
{
	next( new ExpressError( "Page Not Found", 404 ) );
} );
app.use( ( err, req, res, next ) =>
{
	const { statusCode = 500 } = err;
	if ( !err.message ) err.message = "Oh No, Something Went Wrong!";
	res.status( statusCode ).send( err );
} );
app.listen( port, () =>
{
	console.log( `Online on port ${ port }` );
} );
