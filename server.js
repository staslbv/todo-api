var express    = require('express');
var parserBody = require('body-parser');

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
   var va;
    todos.forEach(function(item){if(item.id == pid) va = item});
    if (va)
       res.status(200).json(va);
    else
       res.status(404).send();	
});

app.post('/todos',function(req,res){
	var obj = req.body;
	switch(typeof obj.description){
		case 'string':
		  obj.id = todoNextId++;
		  todos.push(obj);
		  res.status(200).send(obj);
          break;
		default:
		  res.status(400).send();
		  break;
	}
});

app.listen(PORT,function(){
	console.log('Listening on PORT : ' + PORT);
});