//include dependencies
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

//setup mysl connection
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'login'
});

//define express
var app = express();

//use sessions
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//use bodyparser
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(bodyParser.json());

//use files in public folder
app.use(express.static('public'));

//GET ROUTES

//default route
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/login.html'));
});

//loggin in buffer route
app.get('/loggingin', function(request, response) {
	if (request.session.loggedin) {	//checks if the seesion is true
		response.redirect('/loggedin');
	} else {
		response.redirect('/');
	}
	response.end();
});

//logged in route
app.get('/loggedin', function(request, response) {
	if(request.session.loggedin == false){
		response.redirect('/');
	}
	response.sendFile(path.join(__dirname + '/public/loggedin.html'));
});

//POST ROUTES

//logout route
app.post('/logout', function(request, response) {
	request.session.loggedin = false;
	response.redirect('/');
});

//authenticateion route
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				//request.session.username = username;
				response.redirect('/loggingin');
			} else {
				response.redirect('/');
			}			
			response.end();
		});
	} else {
		response.redirect('/');
		response.end();
	}
});

app.post('/reg', function(request, response) {
	var name = request.body.name;
	var pass = request.body.pass;
	console.log(name, pass);
	if (name && pass) {
		var sql = "INSERT INTO users VALUES (0,?,?);"
		connection.query(sql, [name, pass], function(error, results, fields){
			console.log('it works');
			response.redirect('/');
		});
	}
});

//listen on port 3000
app.listen(3000);