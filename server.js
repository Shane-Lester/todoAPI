var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var bodyParser = require('body-parser');
var todosIndex = 1;
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');

app.use(bodyParser.json());



app.get('/', function(req, res) {
	res.send('Todo API root');
});

app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}
	if (query.hasOwnProperty('q') && query.q.trim().length > 0) {
		where.description = {
			$like: "%" + query.q.toLowerCase() + "%"
		};

	}

	db.todo.findAll({
			where: where
		})
		.then(function(arrayTodos) {
				// arrayTodos.forEach(function(todo) {
				res.json(arrayTodos);
			},
			// }),
			function(error) {
				res.status(500).send();
				// }
			});
	// // console.log(params);
	// //completed = true
	// var filteredTodos = todos;
	// if (params.hasOwnProperty('completed') && params.completed === 'true') {
	// 	// console.log('Completed is true');
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: true
	// 	});
	// } else if (params.hasOwnProperty('completed') && params.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: false
	// 	});
	// 	// console.log('Completed is false');
	// }

	// if (params.hasOwnProperty('q') && params.q.trim().length > 0) {
	// 	var searchParam = params.q.toLowerCase();
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.toLowerCase().indexOf(searchParam) > -1;
	// 	});
	// }

	// res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res) {
	var lookedforID = parseInt(req.params.id, 10);

	db.todo.findById(lookedforID)
		.then(function(todo) {
			if (!!todo) {
				res.json(todo);
			} else {
				res.status(404).send();
			}
		}, function(error) {
			res.status(500).send(error);
		})
		// var foundTodo = _.findWhere(todos, {
		// 	id: lookedforID
		// });

	// // todos.forEach(function(todo){
	// // 	if(todo.id === lookedforID){
	// // 		foundID = todo;
	// // 	}
	// // });

	// if (foundTodo) {
	// 	res.json(foundTodo);
	// } else {
	// 	res.status(404).send();
	// }
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	body.description = body.description.trim();


	db.todo.create(body)
		.then(function(todo) {
				res.status(200).send(todo.toJSON());
			},
			function(error) {
				res.status(400).json(error);
			})


	// if (!_.isString(body.description) || !_.isBoolean(body.completed) || body.description.trim().length === 0) {
	// 	return res.status(404).send();
	// }

	// // console.log("description: " + body.description);
	// body.description = body.description.trim();

	// body.id = todosIndex;
	// todosIndex++;
	// todos.push(body);

	// res.json(body);
});

app.delete('/todos/:id', function(req, res) {
	var lookedforID = parseInt(req.params.id, 10);

	db.todo.findById(lookedforID)
		// could just do db.todo.destroy({
		// where:{
		//id:lookedforID
		// }})
		.then(function(todo) {
			if (todo) {
				todo.destroy()
					.then(function(todoDeleted) {
						res.status(200).json(todoDeleted);
					})
			} else {
				res.status(404).json({
					error: 'no todo with that ID'
				});
			}
		}, function(error) {
			res.status(500).send(error);
		})
		// var foundTodo = _.findWhere(todos, {
		// 	id: lookedforID
		// });

	// if (foundTodo) {
	// 	todos = _.without(todos, foundTodo);
	// 	res.json(foundTodo);
	// } else {
	// 	res.status(404).json({
	// 		"error": "no todo found with that ID"
	// 	});
	// }
});

app.put('/todos/:id', function(req, res) {
	var lookedforID = parseInt(req.params.id, 10);
	console.log(lookedforID);
	// var foundTodo = _.findWhere(todos, {
	// 	id: lookedforID
	// });
	var body = _.pick(req.body, 'description', 'completed');
	// var validAttributes = {};
	var attributes = {};

	// if (!foundTodo) {
	// 	return res.status(404).send();
	// }

	// if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}
	// else if (body.hasOwnProperty('completed')) {
	// 	return res.status(400).send();
	// }

	// if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}


	// } else if (body.hasOwnProperty('description')) {
	// 	return res.status(400).send();
	// }

	db.todo.findById(lookedforID)
		.then(function(todo) {
				if (todo) {
					todo.update(attributes)
						.then(function(todo) {
							res.json(todo.toJSON());

						}, function(error) {
							res.status(400).json(error);
						})


				} else {
					res.status(404).send();
				}
			},
			function(error) {
				res.status(500).send(error);
			})

	// _.extend(foundTodo, validAttributes);
	// res.json(foundTodo);



});

app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body)
		.then(function(user) {
				res.status(200).send(user.toPublicJSON());
			},
			function(error) {
				res.status(400).json(error);
			})

});

//POST /users/login
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.authenticate(body).then(
		function(user){
			res.header('Auth',user.generateToken('authentication')).json(user.toPublicJSON());

		},
		function(){
			res.status(401).send();

		});

});



db.sequelize.sync({force:true}).then(function() {

	app.listen(PORT, function() {
		console.log('Express server listening on port ' + PORT + '!');
	})
});