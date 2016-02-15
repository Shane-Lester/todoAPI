var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	description: "Learn Express",
	completed: false,
	id:1
},
{
	description: "Learn Git and be awesome",
	completed: true,
	id:2
},
{
	description: "Deploy to Heroku",
	completed: false,
	id:3
}
];



app.get('/', function(req,res){
	res.send('Todo API root');
}) ;

app.get('/todos', function(req,res){
	res.json(todos);
});

app.get('/todos/:id', function(req,res){
	// res.send('Asking for Todo with id of ' + req.params.id);
	var lookedforID = parseInt(req.params.id,10);
	var foundID;

	todos.forEach(function(todo){
		if(todo.id === lookedforID){
			foundID = todo;
		}
	});

	if(foundID){
		res.json(foundID);
		}
	else{
		res.status(404).send();
	}
});



app.listen(PORT, function(){
	console.log('Express server listening on port ' + PORT + '!');
})
