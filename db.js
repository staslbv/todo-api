var FLAG_START_FROM_SCRATCH = true;

var Sequelize = require('sequelize');


var sequelize;

console.log('ENV:  ' + process.env.NODE_ENV);

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


/*
var sequelize = new Sequelize(undefined,undefined,undefined,{
	"dialect": "sqlite",
	"storage": __dirname + "/data/dev-todo-api.sqlite"
});

*/

var db = {};

db.todo      = sequelize.import(__dirname + '/models/todo.js')
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;