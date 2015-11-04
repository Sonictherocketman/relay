"use strict";

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('node-uuid');
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

//Server

io.on('connection', function(socket){	
	//Message Types
	socket.on('join', function(msg) {
		//Join room if exists.
		socket.join(msg.roomId);
		io.to(msg.roomId).emit('system', 'yay, welcome');
	});
	socket.on('leave', function(msg) {
		//Leave room and clean up if last member.
	});
	socket.on('system', function(msg) {
		console.log('system', msg);
		io.to(msg.roomId).emit('system', msg);
	});
	socket.on('req', function(msg) {
		console.log('req', msg);
		io.to(msg.roomId).emit('req', msg);
	});
	socket.on('data', function(msg) {
		console.log('data', msg);
		io.to(msg.roomId).emit('data', msg);
	});
	socket.on('disconnect', function() {
		//Do cleanup and room maintenance.
	});
});

/** 
 * Since not all browsers support file downloads from the client,
 * this handler accepts a json file (character data), saves it to 
 * a tmp file, and sends it back as an attachment so the user can
 * download it.
 */ 
app.post('/download', function(req, res) {
	console.log(req.body);
	var filename = '/tmp/' + req.body.id;
	fs.writeFile(filename, req.body.data, function(err) {
		if (err) return console.log(err);
  		console.log('Writing: ' + filename);
		res.download(filename, function(err) {
			if (err) return console.log(err);
			fs.unlink(filename);
		}); // Set disposition and send it.
	});

});

http.listen(3100, function(){
	console.log('listening on *:3100');
});
