
var _          = require('underscore');

var FLAG_START_FROM_SCRATCH = true;

var Sequelize = require('sequelize');

//var env       = (process.env.NODE_ENV || 'development');


var sequelize;

if (process.env.NODE_ENV == 'production'){ // only on heroku
    sequelize = new Sequelize(undefined,undefined,process.env.DATABASE_URL,{
    	dialect: 'postgres'
    });
}else{
	sequelize = new Sequelize(undefined,undefined,undefined,{
		"dialect": "sqlite",
		"storage": __dirname + "/basic-sqlite-database.sqlite"

	});

}


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

var User = sequelize.define('user',{
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);




sequelize.sync({force: FLAG_START_FROM_SCRATCH}).then(function(connection){
	console.log('got connection');
	var _user;
	User.create({email: "stas.lbv@gmail.com"})
	.then(function (user){
		_user = user;
       return Todo.create({description: 'Walk the dog'});
	})
	.then(function(todo){
		console.log('created');
       _user.addTodo(todo);
	})
	.catch(function(e){

	});
	}
).catch(function(e){

});

