let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let petSchema = mongoose.Schema({
	name : { type : String },
	typeOfPet : { type : String },
	id : { 
			type : Number,
			required : true }
});

let Pet = mongoose.model( 'Pet', petSchema );


let PetList = {
	get : function(){
		return Pet.find()
				.then( pets => {
					return pets;
				})
				.catch( error => {
					throw Error( error );
				});
	},
	post : function( newPet ){
		return Pet.create( newPet )
				.then( pet => {
					return pet;
				})
				.catch( error => {
					throw Error(error);
				});
	}
};

module.exports = { PetList };


