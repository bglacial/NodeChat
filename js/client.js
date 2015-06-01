 (function($){

        var socket = io.connect('http://localhost:1337');
		var msg = $('#msgtpl').html();
        var lastmsg = false;
		
        $('#msgtpl').remove();
		$('#loginform').submit(function(event){
          event.preventDefault();
          if($('#username').val() == ''){
            alert('Vous devez entrer un pseudo !');
          }else{
            socket.emit('login', {username: $('#username').val(), mail: $('#mail').val()});
          }
          return false;
        });

        socket.on('newusr', function(user){
          $('#users').append('<img src="' + user.avatar + '" id="' + user.id + '">')
        });
		
        socket.on('logged', function(){
          $('#login').fadeOut();
        });
		
		socket.on('signout', function(user){
			$('#'+user.id).slideUp(100, function(){
				$(this).remove();
			})
        });
	
		$('#form').submit(function(event){
          event.preventDefault();
          socket.emit('createmsg', {message : $('#message').val() });
          $('#message').val('');
          $('#message').focus();
          return false;
        });


        socket.on('newmsg', function(message){
          if(lastmsg != message.user.id){
            $('#messages').append('<div class="sep"></div>');
            lastmsg = message.user.id;
          }
          $('#messages').append( '<div class="message">' + Mustache.render(msg, message) + '</div>' );
          $("#messages").animate({ scrollTop: $("#messages").prop("scrollHeight") }, 50);
        });
      })(jQuery);