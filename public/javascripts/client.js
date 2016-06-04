var userSelf = {};
var toOneId;
var toOneName;
$(function(){
	$('#myModal').modal({
		//backdrop: 'static',
		keyboard: false
	});
	
	Messenger.options = {
		extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
		theme: 'future'
	};

	$('.popover-dismiss').popover('show');

	//注册模块
	$('#btn-register').click(function(){
		var name = $('#username').val();
        var password = $('#password').val();
        var email = $('#email').val();

		if((name.trim().length == 0)||(password.trim().length == 0)||(email.trim().length == 0)){
			$('#username').val('');$('#password').val('');$('#email').val('');
			document.getElementById('status').textContent = '输入不能为空';
			$('#username').focus();
		}else if((name.trim().length <6)||(password.trim().length < 6)){
			$('#username').val('');$('#password').val('');
            document.getElementById('status').textContent = '用户名和密码必须在6字节以上';
            $('#username').focus();
		}else if(email.indexOf("@")<1||(email.lastIndexOf(".")-email.indexOf("@"))<2){
			$('#email').val('');
            document.getElementById('status').textContent = 'Email格式不正确';
            $('#email').focus();
        }else{
			var imgList = ["/images/1.jpg","/images/2.jpg","/images/3.jpg","/images/4.jpg","/images/5.jpg"];
			var randomNum = Math.floor(Math.random()*5);
			//random user
			var img = imgList[randomNum];
			//package user
			var dataObj = {
				name:name,
				password:password,
				email:email,
				img:img
			};
			//send user info to server
			socket.emit('register',dataObj);
			//hide login modal
			//$('#myModal').modal('hide');
			$('#username').val('');
			$('#password').val('');
			$('#email').val('');
			//$('#msg').focus();
		}
	});
    
    //登录模块
	$('#btn-login').click(function(){
		var name = $('#username2').val();
        var password = $('#password2').val();

		if((name.trim().length == 0)||(password.trim().length == 0)){
			$('#username2').val('');$('#password2').val('');
			document.getElementById('status2').textContent = '输入不能为空';
			$('#username2').focus();
		}else if((name.trim().length <6)||(password.trim().length < 6)){
			$('#username2').val('');$('#password2').val('');
            document.getElementById('status2').textContent = '用户名和密码必须在6字节以上';
            $('#username2').focus();
		}else{
			var imgList = ["/images/1.jpg","/images/2.jpg","/images/3.jpg","/images/4.jpg","/images/5.jpg"];
			var randomNum = Math.floor(Math.random()*5);
			//random user
			var img = imgList[randomNum];
			//package user
			var dataObj = {
				name:name,
				password:password,
				img:img
			};
			//send user info to server
			socket.emit('login',dataObj);
			//hide login modal
			//$('#myModal').modal('hide');
			$('#username2').val('');
			$('#password2').val('');
			//$('#msg').focus();
		}
	});
     

    //查找好友
    $('#icon-search').click(function() {
    	$('#searchUser').modal();
        document.getElementById("addReason").style.display="none";
        document.getElementById("namelist").style.display="none";
        document.getElementById("addSendlabel").style.display="none";
	    $('#searchUserLabel').text("搜索用户");
    });

     $('#btn-search').click(function() {
    	var searchUser = $('#input_searchUser').val();
    	if(searchUser.trim().length == 0){
            $('#input_searchUser').val('');
            document.getElementById('searchUserLabel').textContent = '输入不能为空';
    	}else{
    		socket.emit('searchUser',searchUser,userSelf.name);
    		$('#input_searchUser').val('');
    	}	
    });
    
    $('#icon-delete').click(function() {
    	$('#deleteUser').modal();
    	$('#deleteUserLabel').text("删除用户");
    	socket.emit('listFriend',userSelf.name);
    });

    $('#icon-accept').click(function() {
    	$('#acceptUser').modal();
    	$('#acceptUserLabel').text("好友申请");
    	socket.emit('listRequest',userSelf.name);
    });

	//发送信息
    $('#sendMsg').click(function(){
    var msg = $('#msg').val();
    if(msg==''){
      alert('Please enter the message content!');
      return;
    }
    var from = userSelf;
    var myDate = gettime();
    var msgObj = {
  		from:userSelf,
  		to:toOneId,
  		msg:msg,
  		time:myDate
  	};
    var msgObjSql = {
      from:from.name,
      to:toOneName,
      msg:msg,
      time:myDate
    };
    socket.emit('putIntoSql',msgObjSql);
    if(toOneId!=undefined){socket.emit('toOne',msgObj);}

    //socket.emit('toAll',msgObj);
    addMsgFromUser(msgObj,true);
    $('#msg').val('');
    toOneId=undefined;
  });


  $('#clear').click(function(){
    $('#msgcontent').text('');
  });

  $('#refresh').click(function(){
    socket.emit('findFriend',userSelf);
  });

  //发送图片
  $('#sendImage').change(function(){
  	if(this.files.length != 0){
  		var file = this.files[0];
  		reader = new FileReader();
  		if(!reader){
  			alert("!your browser doesn\'t support fileReader");
  			return;
  		}
  		reader.onload = function(e){
  			//console.log(e.target.result);
  			var msgObj = {
  				from:userSelf,
  				img:e.target.result
  			};
  			socket.emit('sendImageToALL',msgObj);
  			addImgFromUser(msgObj,true);
  		};
  		reader.readAsDataURL(file);
  	}
  });

  //已无用
  $('#btn_toOne').click(function(){
  	var msg = $('#input_msgToOne').val();
  	if(msg==''){
      alert('Please enter the message content!');
      return;
    }
  	var msgObj = {
  		from:userSelf,
  		to:toOneId,
  		msg:msg
  	};
  	socket.emit('toOne',msgObj);
  	$('#setMsgToOne').modal('hide');
  	$('#input_msgToOne').val('');
  });

});

//向panel添加图片
function addImgFromUser(msgObj,isSelf){
	var msgType = isSelf?"message-reply":"message-receive";
	var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
	msgHtml.addClass(msgType);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',userSelf.img);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.from.name);
	msgHtml.children('.message-info').children('.message-content-box').children('.message-content').html("<img src='"+msgObj.img+"'>");
	$('.msg-content').append(msgHtml);
	//滚动条一直在最底
	$(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
}

//向panel添加信息
function addMsgFromUserPre(msgObj,isSelf){
	$('.msg-content').append(msgObj.time);
	var msgType = isSelf?"message-reply":"message-receive";
	var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
	msgHtml.addClass(msgType);
	//msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',msgObj.from.img);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.name);
	msgHtml.children('.message-info').children('.message-content-box').children('.message-content').text(msgObj.content);
	$('.msg-content').append(msgHtml);
	//滚动条一直在最底
	$(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
}


//向panel添加信息
function addMsgFromUser(msgObj,isSelf){
	$('.msg-content').append(msgObj.time);
	var msgType = isSelf?"message-reply":"message-receive";
	var msgHtml = $('<div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
	msgHtml.addClass(msgType);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src',msgObj.from.img);
	msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title',msgObj.from.name);
	msgHtml.children('.message-info').children('.message-content-box').children('.message-content').text(msgObj.msg);
	$('.msg-content').append(msgHtml);
	//滚动条一直在最底
	$(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
}

//add msg from system in UI
function addMsgFromSys(msg){
	$.scojs_message(msg, $.scojs_message.TYPE_OK);
}

//check is the username exist.
/*function checkUser(name){
	var haveName = false;
	$(".user-content").children('ul').children('li').each(function(){
		if(name == $(this).find('span').text()){
			haveName = true;
		}
	});
	return haveName;
}*/



//在线好友定位到panel
function focusOnPanelOnline(name,id){
	$('#chatTitle').text("Send to "+name);
	$('#msgcontent').text('');
	toOneName = name;
	toOneId = id;
	var msgObj = {
  		from:userSelf.name,
  		frompic:userSelf.img,
  		to:toOneName,
  		toId:toOneId,
  		msg:msg
  	};
	socket.emit('selectChat',msgObj);
    $('#msg').focus();
}

//离线好友定位到panel
function focusOnPanelOffline(name){
	$('#chatTitle').text("Send to "+name);
	$('#msgcontent').text('');
	toOneName = name;
	var msgObj = {
  		from:userSelf.name,
  		frompic:userSelf.img,
  		to:toOneName,
  		msg:msg
  	};
	socket.emit('selectChat',msgObj);
    $('#msg').focus();
}

//发送好友申请
function addFriendRequest(fromName,toName){
	var reason=$('#addReason').val();
    var addmsg={
    	from:fromName,
    	to:toName,
    	reason:reason
    };
	socket.emit('addFriendRequest',addmsg);
}

function delFriendRequest(fromName,toName){
    var delmsg={
    	from:fromName,
    	to:toName,
    };
	socket.emit('delFriendRequest',delmsg);
}

function acceptRequest(fromName,toName){
    var accmsg={
    	from:fromName,
    	to:toName,
    };
	socket.emit('accFriendRequest',accmsg);
}
function rejectRequest(fromName,toName){
    var rejmsg={
    	from:fromName,
    	to:toName,
    };
	socket.emit('rejFriendRequest',rejmsg);
}

//在线好友列表
function addUserOn(userList){
	var parentUl = $('.user-contentOn').children('ul');
	var cloneLi = parentUl.children('li:first').clone();
	parentUl.html('');
	parentUl.append(cloneLi);
	for(var i in userList){
		var cloneLi = parentUl.children('li:first').clone();
		cloneLi.children('a').attr('href',"javascript:focusOnPanelOnline('"+userList[i].name+"','"+userList[i].id+"');");
		cloneLi.children('a').children('img').attr('src',userList[i].img);
		cloneLi.children('a').children('span').text(userList[i].name);
		cloneLi.show();
		parentUl.append(cloneLi);
	}
}

//离线好友列表
function addUserOff(userList){
	var parentUl = $('.user-contentOff').children('ul');
	var cloneLi = parentUl.children('li:first').clone();
	parentUl.html('');
	parentUl.append(cloneLi);
	for(var i in userList){

		var imgList = ["/images/1.jpg","/images/2.jpg","/images/3.jpg","/images/4.jpg","/images/5.jpg"];
		var randomNum = Math.floor(Math.random()*5);
		//random user
		var img = imgList[randomNum];

		var cloneLi = parentUl.children('li:first').clone();
		cloneLi.children('a').attr('href',"javascript:focusOnPanelOffline('"+userList[i]+"');");
		cloneLi.children('a').children('img').attr('src',img);
		cloneLi.children('a').children('span').text(userList[i]);
		cloneLi.show();
		parentUl.append(cloneLi);
	}
}

//send message enter function
function keywordsMsg(e){
	var event1 = e || window.event;
	if(event1.keyCode == 13){
		$('#sendMsg').click();
	}
}

//set name enter function
function keywordsName(e){
	var event1 = e || window.event;
	if(event1.keyCode == 13){
		$('#btn-register').click();
	}
}
//send to one enter function

function keywordsName1(e){
	var event1 = e || window.event;
	if(event1.keyCode == 13){
		$('#password2').focus();
	}
}
function keywordsName2(e){
	var event1 = e || window.event;
	if(event1.keyCode == 13){
		$('#btn-login').click();
	}
}

//刷新好友
function refreshFriend(){
	socket.emit('findFriend',userSelf);
}

function gettime(){
    var year = new Date().getFullYear();       //年
    var month = new Date().getMonth()+1;         //月
    var day = new Date().getDate();            //日
    var hh = new Date().getHours();            //时
    var mm = new Date().getMinutes();          //分 
    var ss = new Date().getSeconds();
    return(year+'-'+month+'-'+day+' '+hh+':'+mm+':'+ss);
}
