const express = require( "express" );
const mongoose = require( "mongoose" );
const Course = require( "./Model/Course" );
const cors = require( "cors" );
const ejsMate = require( "ejs-mate" );
const methodOverride = require( "method-override" );
const bodyParser = require( "body-parser" );
const path = require( "path" );
const app = express();
const port = 5050;

main().catch( ( err ) => console.log( err ) );
async function main ()
{
	await mongoose.connect( "mongodb://localhost:27017/course" );
	console.log( "connection is on!!" );
}

app.engine( "ejs", ejsMate );
app.set( "view engine", "ejs" );
app.set( "views", path.join( __dirname, "views" ) );
app.use( cors() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( methodOverride( "_method" ) );
app.use( express.static( path.join( __dirname, "public" ) ) );

app.get( "/", async ( req, res ) =>
{
	const data = await Course.find( {} );
	res.send(data)
} );

app.get( "/admin", async ( req, res ) =>
{
	const data = await Course.find( {} );
	res.render( "index", { data } );
} )

app.get( "/admin/course/:courseId/:lectureId", async ( req, res ) =>
{
	const course = await Course.findOne( { _id: req.params.courseId } )
	const lectures = course.lectures.map( lecture => lecture );
	const lecture = lectures.find( lecture =>
	{
		return lecture._id == req.params.lectureId;
	})
	console.log( lecture )
	res.render("lecture", {lecture, course})
})

app.put( "/admin/course/:courseId/:lectureId", async ( req, res ) =>
{
	const course = await Course.findOneAndUpdate( { "_id": req.params.courseId, "lectures._id": req.params.lectureId },
		{
			"$set": {
				"lectures.$.title": req.body.title,
				"lectures.$.instructor": req.body.instructor,
				"lectures.$.duration": req.body.duration,
				"lectures.$.time": req.body.time,
				"lectures.$.hall": req.body.hall
			}
		}
	)
	await course.save()
	console.log( course )
	res.redirect( "/admin" );
})

app.listen( port, () =>
{
	console.log( `Online on port ${ port }` );
})