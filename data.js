const mongoose = require( "mongoose" );
const Course = require( "./Model/Course" );

main().catch( ( err ) => console.log( err ) );

async function main ()
{
	await mongoose.connect( "mongodb://localhost:27017/course" );
	console.log( "connection is on!!" );
}

const data = [
	{
		id: 1,
		day: "Saturday",
		lectures: [
			{
				id: 1,
				title: "Grammar",
				description: "N/A",
				instructor: "DR.Omar",
				duration: "50min",
				time: "@9:30",
				image: "DR.Omar-Grammar",
				hall: "EC05"
			},
			{
				id: 2,
				title: "Education",
				description: "N/A",
				instructor: "DR.Noor",
				duration: "50min",
				time: "@10:30",
				image: "DR.Noor-Education",
				hall: "EC17"
			},
			{
				id: 3,
				title: "Psychology",
				description: "N/A",
				instructor: "DR.Jasem",
				duration: "50min",
				time: "@1:30",
				image: "DR.Jasem-Psychology",
				hall: "EC23"
			}

		]
	},
	{
		id: 2,
		day: "Sunday",
		lectures: [
			{
				id: 1,
				title: "Voice",
				description: "N/A",
				instructor: "DR.Ali",
				duration: "50min",
				time: "@8:30",
				image: "DR.Ali-Voice",
				hall: "EC04"
			},
			{
				id: 2,
				title: "Conversation",
				description: "N/A",
				instructor: "DR.Rami",
				duration: "50min",
				time: "@12:30",
				image: "DR.Rami-Conversation",
				hall: "EC05"
			}
		]
	},
	{
		id: 3,
		day: "Monday",
		lectures: [
			{
				id: 2,
				title: "Focus",
				description: "N/A",
				instructor: "DR.Tariq",
				duration: "50min",
				time: "@12:30",
				image: "DR.Tariq-Focus",
				hall: "EC23"

			},
			{
				id: 1,
				title: "Writing",
				description: "N/A",
				instructor: "DR.Salah",
				duration: "50min",
				time: "@10:30",
				image: "DR.Salah-Writing",
				hall: "EC17"
			},
		]
	},
	{
		id: 4,
		day: "Tuesday",
		lectures: [
			{
				id: 1,
				title: "Literature",
				description: "N/A",
				instructor: "DR.Israa",
				duration: "50min",
				time: "@8:30",
				image: "DR.Israa-Literature",
				hall: "EC17"
			},
			{
				id: 2,
				title: "Computer Science",
				description: "N/A",
				instructor: "DR.Alia",
				duration: "50min",
				time: "@1:30",
				image: "DR.Alia-Cs",
				hall: "EC05"
			},
			{
				id: 3,
				title: "Arabic",
				description: "N/A",
				instructor: "DR.Jasem",
				duration: "50min",
				time: "@10:30",
				image: "DR.Jasem-Arabic",
				hall: "EC06"
			},
		]
	}
]


const seedDB = async () =>
{
	await Course.deleteMany( {} );
	await Course.insertMany( data );
	console.log( "saved" );
};
seedDB().then( () =>
{
	mongoose.connection.close();
})
