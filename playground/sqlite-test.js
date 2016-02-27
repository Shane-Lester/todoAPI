	var Sequelize = require('sequelize');
	var sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/sqlite-test.sqlite'
	});

	var Todo = sequelize.define('todo', {
		description: {
			type: Sequelize.STRING,
			allowNull: false,
			validat: {
				len: [1, 250]
			}
		},
		completed: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});

	sequelize.sync().then(function() {
		console.log('everything is synced');

		Todo.findById(33)
			.then(function(todo) {
				console.log(todo.toJSON());
				console.log('found todo id=1');

			})
			.catch(function(e) {
				console.log('Not found');
			})


		// Todo.create({
		// 		description: "Think about databases",
		// 		completed: false
		// 	})
		// 	.then(function(todo) {
		// 		return Todo.create({
		// 			description: "Clean house"
		// 		});
		// 	})
		// 	.then(function() {
		// 		// return Todo.findById(1)
		// 		return Todo.findAll({
		// 			where: {
		// 				description: {
		// 					$like:'%learn%'
		// 				}
		// 			}
		// 		})
		// 	})
		// 	.then(function(todos) {
		// 		if (todos) {
		// 			todos.forEach(function(todo) {
		// 				console.log(todo.toJSON());

		// 			});
		// 		} else {
		// 			console.log("no todo found");
		// 		}
		// 	})
		// .catch(function(e) {
		// 	console.log(e);
		// })
	});