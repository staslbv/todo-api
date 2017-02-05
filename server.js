var express    = require('express');
var parserBody = require('body-parser');
var _          = require('underscore');

var db         = require('./db.js');

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
   	    	result = _.where(result,{completed: _value});
   	    }
   }
   if (query.hasOwnProperty('q') && _.isString(query.q)){
   	result = _.filter(result,function(value){
   		return (value.description.indexOf(query.q) >= 0);
   	});
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
  db.todo.create(req.body).then(function(item){
     res.json(_.pick(item.toJSON(),'id','description','completed'));
  }).catch(function(error){
    res.status(400).json(error);
  });
});



db.sequelize.sync()
.then(function(connection){
  console.log('db connection ok , stand by for listed...');
  return app.listen(PORT,function(success){
     console.log('Listening on PORT : ' + PORT);
  });
})
.catch(function(error){
  onsole.log('ERROR : ' + error);
});


