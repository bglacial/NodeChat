var http = require('http');
var md5 = require('MD5');

httpServer = http.createServer(function(req, res){
	console.log('Un utilisateur affiche la page');
})

httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);
var users = {};
var messages = [];
var history = 50;
io.sockets.on('connection', function(socket){

	var me;
	
	for(var k in messages){
		socket.emit('newmsg', messages[k]);
	}
	for(var k in users){
		socket.emit('newusr', users[k]);
	}
	console.log('Nouvel utilisateur');
	

	socket.on('login', function(user){
		user.avatar = "https://gravatar.com/avatar/" + md5(user.mail) + "?s=50";
		user.id     = md5(user.mail.replace('@','-').replace('.','-'));
		user.mail = null;
		me = user;
		users[user.id] = user;
		socket.emit('logged');
		io.sockets.emit('newusr', user);
	})
	
	socket.on('disconnect', function () {
		if(!me){
			return false;
		}
		delete users[me.id];
     	io.sockets.emit('signout', me);
	});
	
	socket.on('createmsg', function(message){
		if(!me){
			return false;
		}
		if(message.message == '' || message.message.length < 3){
			return false;
		}
		message.user = me;
		date = new Date();
		message.h = date.getHours();
		message.m = date.getMinutes();
		messages.push(message);
		if(messages.length > history){
			messages.shift();
		}
		io.sockets.emit('newmsg', message);
	});
	

});