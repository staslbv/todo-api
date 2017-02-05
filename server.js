var express = require('express');
var app     = express();
var PORT    = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Meet monm for lunch', 
	completed: false
},{
	id: 2,
	description: 'Go to market', 
	completed: false
},{
	id: 3,
	description: 'Feed the cat', 
	completed: false
}];

app.get('/',function(reg,res){
	res.send('Todo API Root');
});

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

app.listen(PORT,function(){
	console.log('Listening on PORT : ' + PORT);
});