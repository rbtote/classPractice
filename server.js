let express = require( "express" );
let morgan = require( "morgan" );
let mongoose = require( "mongoose" );
let bodyParser = require( "body-parser" );
let { PetList } = require('./model');
let { DATABASE_URL, PORT } = require('./config');

let app = express();
let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

app.use( express.static( "public" ) );

app.use( morgan( "dev" ) );

let nameOfPets = [
	{
		name : "Burbuja",
		typeOfPet : "Dog"
	},
	{
		name : "Kia",
		typeOfPet : "Dog"
	},
	{
		name : "Jagger",
		typeOfPet : "Dog"
	},
	{
		name : "Kirby",
		typeOfPet : "Dog"
	}
];

app.get( "/api/pets", ( req, res, next ) => {
	PetList.get()
		.then( pets => {
			return res.status( 200 ).json( pets );
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			})
		});
});

app.post( "/api/postPet", jsonParser, ( req, res, next ) => {
	let name = req.body.name;
	let typeOfPet = req.body.typeOfPet;
	let id = req.body.id;

	let newPet = {
		name,
		typeOfPet,
		id
	};

	PetList.post(newPet)
		.then( pet => {
			return res.status( 201 ).json({
				message : "Pet added to the list",
				status : 201,
				student : pet
			});
		})
		.catch( error => {
			res.statusMessage = "Something went wrong with the DB. Try again later.";
			return res.status( 500 ).json({
				status : 500,
				message : "Something went wrong with the DB. Try again later."
			});
		});
});

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };