var express    = require('express');
var parserBody = require('body-parser');
var _          = require('underscore');

var db         = require('./db.js');

var app        = express();
var PORT       = process.env.PORT || 3000;

// req.body will be always object
app.use(parserBody.json());

// GET
app.get('/todos',function(req,res){
   var query  = req.query;
   var where  = {};
   var filter = undefined;
   if (query.hasOwnProperty('completed')){
   	    var _value = JSON.parse(query.completed);
   	    if (_.isBoolean(_value)) where.completed = _value;
  }
  if (query.hasOwnProperty('q') && _.isString(query.q)){
     where.description =  {
       $like: ('%' + query.q + '%')
     }
  } 
  if (_.keys(where).length > 0)  filter = {where: where};
  db.todo.findAll(filter)
  .then(function(result){
     var va = [];
     result.forEach(function(_result){
      va.push(_result.toJSON());
     });
     res.json(va);
  })
  .catch(function(error){
    res.status(400).json(error);
  });
});

app.get('/todos/:id',function(req,res){
  db.todo.findById(parseInt(req.params.id,10)).then(function(item){
    if (item)
      res.json(item.toJSON());
    else
      res.status(403).json({});
  }).catch(function(error){
    res.status(400).json(error);
  });
   
});

app.delete('/todos/:id',function(req,res){
   var pid = parseInt(req.params.id,10);
   db.todo.findById(pid)
   .then(function(item){
    if (!item)
       res.status(404).json({});
    else
      return db.todo.destroy({where:{id: item.id}});
   })
   .then(function(success){
     res.json({id: pid});
   })
   .catch(function(error){
     res.status(400).json(error);
   });
});

app.post('/todos',function(req,res){
  db.todo.create(req.body).then(function(item){
     res.json(_.pick(item.toJSON(),'id','description','completed'));
  }).catch(function(error){
    res.status(400).json(error);
  });
});

app.put('/todos/:id',function(req,res){
  
   var body            = _.pick(req.body, 'description','completed');
   var validAttrinutes = {};
   var pid             = parseInt(req.params.id,10);
   //
   db.todo.findById(pid)
   .then(function(item){
    if (!item){
      res.status(404).json({});
    }else{
      var _item = _.extend(item.toJSON(),body);
     _item.id   = pid;
      return db.todo.upsert(_item);
    }
   })
   .then(function(success){
      res.json({success: success});
   })
   .catch(function(error){
     res.status(400).json(error);
   });
});


app.post('/users',function(req,res){
  db.users.create(_.pick(req.body,'email','password')).then(function(user){
    res.json(user.toJSON());
  }).catch(function(e){
    res.status(400).json(e);
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

