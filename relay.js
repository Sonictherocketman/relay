"use strict";

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('node-uuid');

//Server

io.on('connection', function(socket){	
	socket.on('join', function(msg) {
		socket.join(msg.roomId);
		io.to(msg.roomId).emit('system', 'yay, welcome');
	});
	socket.on('leave', function(msg) {
		socket.leave(msg.roomId);
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
});

http.listen(3100, function(){
	console.log('listening on *:3100');
});

