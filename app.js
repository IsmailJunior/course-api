if ( process.env.NODE_ENV !== "production" )
{
	require( "dotenv" ).config();
}

const express = require( "express" );
const mongoose = require( "mongoose" );
const courseRouter = require( './router/course' );
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
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use(express.urlencoded({ extended: true }));
app.use( express.static( path.join( __dirname, "public" ) ) );
app.use( cors() );
app.use( bodyParser.json() );
app.use( morgan( "dev" ) );
app.use( methodOverride( "_method" ) );
app.use( '/', courseRouter );

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
