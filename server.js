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
	var params = req.query;
	// console.log(params);
	//completed = true
	var filteredTodos = todos;
	if(params.hasOwnProperty('completed') && params.completed === 'true'){
		// console.log('Completed is true');
		filteredTodos =_.where(filteredTodos,{completed:true});
		}
	else if(params.hasOwnProperty('completed') && params.completed === 'false'){
		filteredTodos =_.where(filteredTodos,{completed:false});
		// console.log('Completed is false');
		}
	
	res.json(filteredTodos);
});

app.get('/todos/:id', function(req,res){
	var lookedforID = parseInt(req.params.id,10);
	var foundTodo=_.findWhere(todos,{id :lookedforID});

	// todos.forEach(function(todo){
	// 	if(todo.id === lookedforID){
	// 		foundID = todo;
	// 	}
	// });

	if(foundTodo){
		res.json(foundTodo);
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

app.delete('/todos/:id',function(req,res){
	var lookedforID = parseInt(req.params.id, 10);
	var foundTodo =_.findWhere(todos, {id:lookedforID});

	if(foundTodo){
		todos=_.without(todos,foundTodo);
		res.json(foundTodo);
	}
	else{
		res.status(404).json({"error":"no todo found with that ID"});
	}
});

app.put('/todos/:id',function(req,res){
	var lookedforID = parseInt(req.params.id,10);
	var foundTodo = _.findWhere(todos,{id:lookedforID});
	var body = _.pick(req.body, 'description','completed');
	var validAttributes = {};

	if(!foundTodo){
		return res.status(404).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	}
	else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length >0){
		validAttributes.description = body.description;
		

	}
	else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}
	
	_.extend(foundTodo,validAttributes);
	res.json(foundTodo);




});



app.listen(PORT, function(){
	console.log('Express server listening on port ' + PORT + '!');
})
