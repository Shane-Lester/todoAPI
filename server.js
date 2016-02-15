var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var bodyParser = require('body-parser');
var todosIndex =1;
var _ = require('underscore');

app.use(bodyParser.json());



app.get('/', function(req,res){
	res.send('Todo API root');
}) ;

app.get('/todos', function(req,res){
	res.send(JSON.stringify(todos,null, 4));
});

app.get('/todos/:id', function(req,res){
	var lookedforID = parseInt(req.params.id,10);
	var foundID =_.findWhere(todos,{id :lookedforID});

	// todos.forEach(function(todo){
	// 	if(todo.id === lookedforID){
	// 		foundID = todo;
	// 	}
	// });

	if(foundID){
		res.json(foundID);
		}
	else{
		res.status(404).send();
	}
});

app.post('/todos',function(req, res){
	var body = _.pick(req.body, 'description','completed');


	if(!_.isString(body.description) || !_.isBoolean(body.completed) || body.description.trim().length === 0){
		return res.status(404).send();
	}

	// console.log("description: " + body.description);
	body.description = body.description.trim();

	body.id = todosIndex;
	todosIndex++;
	todos.push(body);

	res.json(body);
});



app.listen(PORT, function(){
	console.log('Express server listening on port ' + PORT + '!');
})