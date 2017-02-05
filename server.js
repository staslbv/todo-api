var express    = require('express');
var parserBody = require('body-parser');
var _          = require('underscore');

var app        = express();
var PORT       = process.env.PORT || 3000;

// req.body will be always object
app.use(parserBody.json());

var todos      = [];
var todoNextId = 1;

// GET
app.get('/todos',function(req,res){
   res.json(todos);
});

app.get('/todos/:id',function(req,res){
   var pid = parseInt(req.params.id,10);
   var va = _.findWhere(todos,{id: pid});
   
    if (va)
       res.status(200).json(va);
    else
       res.status(404).send();	
});

app.post('/todos',function(req,res){
	var obj = req.body;
	if (!_.isString(obj.description) || !obj.description.trim() || !_.isBoolean(obj.completed))
		return res.status(400).send();
    obj.id           = (todoNextId++);
    var norm         = _.pick(obj,'id','description','completed');
    norm.description = obj.description.trim();
    todos.push(norm);
    res.status(200).json(norm);
});

app.listen(PORT,function(){
	console.log('Listening on PORT : ' + PORT);
});