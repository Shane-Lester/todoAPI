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
}
];



app.get('/', function(req,res){
	res.send('Todo API root');
}) ;

app.get('/todos', function(req,res){
	res.json(todos);
});

app.get('/todos:id', function(req,res){
	
});



app.listen(PORT, function(){
	console.log('Express server listening on port ' + PORT + '!');
})
