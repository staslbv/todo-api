var express = require('express');
var app     = express();

var PORT    = process.env.PORT || 3000;

app.get('/',function(reg,res){
	res.send('Todo API Root');

});

app.listen(PORT,function(){
	console.log('Listening on PORT : ' + PORT);
});