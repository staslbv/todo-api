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
   var query  = req.query;
   var result = todos;
   if (query.hasOwnProperty('completed')){
   	    var _value = JSON.parse(query.completed);
   	    if (_.isBoolean(_value)){
   	    	result = _.where(todos,{completed: _value});
   	    }
   }
   res.json(result);
});

app.get('/todos/:id',function(req,res){
   var pid = parseInt(req.params.id,10);
   var va  = _.findWhere(todos,{id: pid});
   if (!va)
      return res.status(404).send();	
   res.json(va); 	
});

app.delete('/todos/:id',function(req,res){
   var pid = parseInt(req.params.id,10);
   var va  = _.findWhere(todos,{id: pid});
   if (!va) return res.status(404).send();
   todos   = _.without(todos,va);
   res.json(va);
});

app.put('/todos/:id',function(req,res){
   var body            = _.pick(req.body, 'description','completed');
   var validAttrinutes = {};
   var pid             = parseInt(req.params.id,10);
   var va              = _.findWhere(todos,{id: pid});
   if (body.hasOwnProperty('completed') && _.isBoolean(body.completed))
   	   validAttrinutes.completed = body.completed;
   if (body.hasOwnProperty('description') && _.isString(body.description) && _.isString(body.description.trim()))
   	   validAttrinutes.description = body.description.trim();
   if (!_.keys(validAttrinutes).length)
   	   return res.status(204).send();
   if (!va)   
   	   return res.status(404).send();
   _.extend(va,validAttrinutes);
   res.json(va);
});

app.post('/todos',function(req,res){
	var obj = req.body;
	if (!_.isString(obj.description) || !obj.description.trim() || !_.isBoolean(obj.completed))
		return res.status(400).send();
    obj.id           = (todoNextId++);
    var norm         = _.pick(obj,'id','description','completed');
    norm.description = obj.description.trim();
    todos.push(norm);
    return res.status(200).json(norm).send();
});

app.listen(PORT,function(){
	console.log('Listening on PORT : ' + PORT);
});