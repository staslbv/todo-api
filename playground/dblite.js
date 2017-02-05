
var _          = require('underscore');

var FLAG_START_FROM_SCRATCH = true;

var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined,undefined,undefined,{
	"dialect": "sqlite",
	"storage": __dirname + "/basic-sqlite-database.sqlite"
});


var Todo = sequelize.define('todo',{
	description:{
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed:{
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});


sequelize.sync({force: FLAG_START_FROM_SCRATCH}).then(function(connection){
	console.log('got connection');
	 Todo.create({description: 'N1'})
	.then(function(va1)
	{
		console.log(va1.toJSON());
		return Todo.create({description: 'N2'});
	})
	.then(function(va2){
		console.log(va2.toJSON());
		return Todo.create({description: 'N3'});
	})
	.then(function(va3){
		console.log(va3.toJSON());
		//return Todo.findById(1000);
		return Todo.findAll({
			where:{
				completed: false,
				description:{
					$like: '%n2%'
				}
			}
		});
	})
	.then(function (result){
		console.log('EVERYTHING DONE');
		console.log(typeof result);
		console.log(JSON.stringify(result));
		if (_.isArray(result))
			result.forEach(function(row){
				console.log(row.toJSON());
			});
		
	})
	.catch(function(e){
		console.log('ERROR: unable to create row! ' + e);
	});
}).catch(function(e){
	console.log('ERROR: unable to connect! ' + e);
});

