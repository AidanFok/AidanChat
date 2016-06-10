var io = require('socket.io')();
var _ = require('underscore');
var moment = require('moment');
var mysql = require('mysql');
var sqlconn= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aidanchat',
    port: 3306
  });
var userList = [];

//api
/*

socket.emit('message', "this is a test");  // send to current request socket client
socket.broadcast.emit('message', "this is a test");  // sending to all clients except sender
socket.broadcast.to('game').emit('message', 'nice game');  // sending to all clients in 'game' room(channel) except sender
io.sockets.emit('message', "this is a test"); // sending to all clients, include sender
io.sockets.in('game').emit('message', 'cool game'); // sending to all clients in 'game' room(channel), include sender
io.sockets.socket(socketid).emit('message', 'for your eyes only'); // sending to individual socketid
*/

/*user list
Format:[
	{
		name:"",
		img:"",
		socketid:""
	}
]
*/


//var socketList = [];
io.on('connection',function(socket){
	//register function
	socket.on('register',function(user){
		console.log('register is called');
        //将此用户写入数据库
        var insertSQL = 'insert into user values(';
            insertSQL+= '\'' + user.name + '\',';
            insertSQL+= '\'' + user.password + '\',';
            insertSQL+= '\'' + user.email + '\',"male")';
            sqlconn.query(insertSQL, function (err1, res1) {
                if (err1) {console.log(err1);socket.emit('userExisted');}
                else{
                console.log("INSERT Return ==> ");
                console.log(res1);

		user.id = socket.id;
		console.log('user.id: '+user.id);
		userList.push(user);
		//socketList.push(socket);
		//send the userlist to all client
		//io.emit('userList',userList);
		//send the client information to client
		socket.emit('userInfo',user);
		//send login info to all.
		socket.broadcast.emit('loginInfo',user.name+"上线了。");
           
	}
		});
	});

	//login function
	socket.on('login',function(user){
		console.log('login is called');
        var selectSQL = "select * from user where "
                  + " name=  '" + user.name + "' "
                  + " and password=  '" + user.password + "'";
        sqlconn.query(selectSQL, function (err, res) {
            if (res[0]==undefined) {socket.emit('userNotExist');}
            else{
                console.log("SELECT Return ==> ");
                console.log(res);

		        user.id = socket.id;
		        console.log('user.id: '+user.id);
		        userList.push(user);
		        //socketList.push(socket);
		       
		        //send the userlist to all client
		 
	          	//io.emit('userList',userList);
	          	//send the client information to my client
	        	socket.emit('userInfo',user);
	          	//send login info to all.
	           	socket.broadcast.emit('loginInfo',user.name+"上线了。");     
	        }
	        console.log(userList);        
        });
        console.log(userList);
        console.log('myfindFriend is called ');
		var selectSQL1 = "select friend from relation where "
                  + " user= '" + user.name + "' "
                  + " and state= '1'";
        sqlconn.query(selectSQL1, function (err1, res1) {
            if (err1) {console.log(err1);}
            else{
            	var onlineList=[];
                var offlineList=[];
                for (var i=0;i<res1.length;i++){
                    var findUser = _.findWhere(userList,{name:res1[i].friend});
                    console.log(findUser);
                    console.log(res1[i]);
                    if(findUser){console.log('online called');
                    	onlineList.push(findUser);}
                    else{console.log('offline called');
                    	offlineList.push(res1[i].friend);}
                }
            socket.emit('onlineList',onlineList); 
            socket.emit('offlineList',offlineList);
            
            }
        }); 
	});

    socket.on('findFriend',function(userSelf){
    	console.log('findFriend is called ');
    	
		var selectSQL1 = "select friend from relation where "
                  + " user= '" + userSelf.name + "';"
        sqlconn.query(selectSQL1, function (err1, res1) {
            if (err1) {console.log(err1);}
            else{
            	var onlineList=[];
                var offlineList=[];
                for (var i=0;i<res1.length;i++){
                    var findUser = _.findWhere(userList,{name:res1[i].friend});
                    console.log(findUser);
                    console.log(res1[i]);
                    if(findUser){console.log('online called');
                    	onlineList.push(findUser);}
                    else{console.log('offline called');
                    	offlineList.push(res1[i].friend);}
                }
            socket.emit('onlineList',onlineList); 
            socket.emit('offlineList',offlineList);
           
            }
        });
    });
    
	//log out
	socket.on('disconnect',function(){
		var user = _.findWhere(userList,{id:socket.id});
		if(user){
			userList = _.without(userList,user);
			//socketList = _.without(socketList,socket);
			//send the userlist to all client
			io.emit('userList',userList);
			//send login info to all.
			socket.broadcast.emit('loginInfo',user.name+"下线了。");
		}
	});

	//send to all
	socket.on('toAll',function(msgObj){
		/*
			format:{
				from:{
					name:"",
					img:"",
					id:""
				},
				msg:""
			}
		*/
		socket.broadcast.emit('toAll',msgObj);
	});

    socket.on('listFriend',function(userName){
        var selectSQL = "select * from relation where user='" + userName + "';";
        sqlconn.query(selectSQL,function(err,res){ 
            if (err){console.log(err);}
            else{
                console.log('friendlist');
                console.log(res);
                if(res)socket.emit('friendResult',res);
                }
        });
    });

    socket.on('listRequest',function(userName){
        var selectSQL = "select * from friendRequest where toname='" + userName + "';";
        sqlconn.query(selectSQL,function(err,res){ 
            if (err){console.log(err);}
            else{
                console.log('requestlist');
                console.log(res);
                if(res)socket.emit('requestResult',res);
                }
        });
    });

    socket.on('searchUser',function(toUser,fromUser){
        console.log('searchUser');
            console.log(toUser);
        var selectSQL = "select * from user where name='" + toUser + "' and name not in(select friend from relation where user='"+ fromUser+"') and name not in(select name from user where name='"+ fromUser+"');";
         sqlconn.query(selectSQL,function(err,res){ 
            console.log(res[0]);
            if (res[0]==undefined){socket.emit('friendNotExist');}
            else{
                socket.emit('searchResult',res[0]);
            }
        });
    });

    socket.on('delFriendRequest',function(delmsg){
        console.log('delFriendRequest is called');
        /*
            format:{
                from:fromName,
                to:toName
            }
        */
       var deleteSQL1 = "delete from message where "
                  + " (fromuser=  '" + delmsg.from + "' "
                  + " and touser=  '" + delmsg.to + "')or"
                  + " (fromuser=  '" + delmsg.to + "' "
                  + " and touser=  '" + delmsg.from + "');";

            sqlconn.query(deleteSQL1, function (err1, res1) {
                if (err1) {console.log(err1);}
                else{
                console.log("DELETE Return ==> ");
                console.log(res1);
            }
            });

       var deleteSQL = "delete from relation where "
                  + " (user=  '" + delmsg.from + "' "
                  + " and friend=  '" + delmsg.to + "')or"
                  + " (user=  '" + delmsg.to + "' "
                  + " and friend=  '" + delmsg.from + "');";

            sqlconn.query(deleteSQL, function (err, res) {
                if (err) {console.log(err);}
                else{
                console.log("DELETE Return ==> ");
                console.log(res);
                socket.emit('deleteSuccess');
            }
            });
    });

    socket.on('accFriendRequest',function(accmsg){
        console.log('accFriendRequest is called');
        /*
            format:{
                from:fromName,
                to:toName
            }
        */
        var insertSQL = 'insert into relation values(';
            insertSQL+= '\'' + accmsg.from + '\',';
            insertSQL+= '\'' + accmsg.to + '\',';
            insertSQL+= '1)';
            sqlconn.query(insertSQL, function (err, res) {
                if (err) {console.log(err);}
                else{
                console.log("INSERT Return ==> ");
                console.log(res);
            }
            });
        var insertSQL1 = 'insert into relation values(';
            insertSQL1+= '\'' + accmsg.to + '\',';
            insertSQL1+= '\'' + accmsg.from + '\',';
            insertSQL1+= '1)';
            sqlconn.query(insertSQL1, function (err1, res1) {
                if (err1) {console.log(err1);}
                else{
                console.log("INSERT Return ==> ");
                console.log(res1);
            }
            });

       var deleteSQL = "delete from friendRequest where "
                  + " fromname=  '" + accmsg.from + "' "
                  + " and toname=  '" + accmsg.to + "';";
            sqlconn.query(deleteSQL, function (err2, res2) {
                if (err2) {console.log(err2);}
                else{
                console.log("DELETE Return ==> ");
                console.log(res2);
                socket.emit('acceptSuccess');
                socket.broadcast.emit('refreshFriend');
            }
            });
    });
    
    socket.on('rejFriendRequest',function(rejmsg){
        console.log('rejFriendRequest is called');
        /*
            format:{
                from:fromName,
                to:toName
            }
        */
       var deleteSQL = "delete from friendRequest where "
                  + " fromname=  '" + rejmsg.from + "' "
                  + " and toname=  '" + rejmsg.to + "';";
            sqlconn.query(deleteSQL, function (err, res) {
                if (err) {console.log(err);}
                else{
                console.log("DELETE Return ==> ");
                console.log(res);
                socket.emit('clearSuccess');
            }
            });
    });

    socket.on('addFriendRequest',function(addmsg){
        console.log('addFriendRequest is called');
        /*
            format:{
                from:fromName,
                to:toName,
                reason:reason
            }
        */
        var insertSQL = 'insert into friendRequest values(';
            insertSQL+= '\'' + addmsg.from + '\',';
            insertSQL+= '\'' + addmsg.to + '\',';
            insertSQL+= '\'' + addmsg.reason + '\')';
            sqlconn.query(insertSQL, function (err, res) {
                if (err) {console.log(err);}
                else{
                console.log("INSERT Return ==> ");
                console.log(res);
                socket.emit('requestSuccess');
            }
            });
    });

    socket.on('putIntoSql',function(msgObj){
		/*
			format:{
				from:from.name,
                to:toOneName,
                msg:msg,
                date:myDate
			}
		*/
		console.log('putIntoSql is called');
        //将此用户写入数据库
        var insertSQL = 'insert into message values(';
            insertSQL+= '\'' + msgObj.from + '\',';
            insertSQL+= '\'' + msgObj.to + '\',';
            insertSQL+= '\'' + msgObj.msg + '\',';
            insertSQL+= '\'' + msgObj.time + '\',';
            insertSQL+= '1)';
            sqlconn.query(insertSQL, function (err1, res1) {
                if (err1) {console.log(err1);}
                else{
                console.log("INSERT Return ==> ");
                console.log(res1);}
            });
	});
 
    socket.on('selectChat',function(msgObj){
    	console.log('selectChat is called');
        /*
			format:{
			from:userSelf.name,
  		    to:toOneName,
  		    toId:toOneId,
  		    msg:msg
			}
	  	*/
	    var selectSQL = "select * from message where "
                  + " (fromuser=  '" + msgObj.from + "' "
                  + " and touser=  '" + msgObj.to + "') or"
                  + " (fromuser=  '" + msgObj.to + "' "
                  + " and touser=  '" + msgObj.from + "') "
                  + "order by dayandtime;";
        sqlconn.query(selectSQL, function (err, res) { 
            if (err){console.log(err);}
            else{
            	for (var i=0;i<res.length;i++){
        	        if(res[i].fromuser==msgObj.from){
        	        	var resultname=res[i].fromuser;
        	        	var resultcontent=res[i].content;
                        var resulttime=moment(res[i].dayandtime).format('YYYY-MM-DD HH:mm:ss');
                        console.log(resulttime);
        	        	var result={
        	        		name:resultname,
        	        		content:resultcontent,
                            time:resulttime
        	        	};
        	        	socket.emit('sendToPanelUs',result);
        	        	console.log("执行1");
                    }
                    else{
                        var resultname=res[i].name;
        	        	var resultcontent=res[i].content;
                        var resulttime=moment(res[i].dayandtime).format('YYYY-MM-DD HH:mm:ss');
                        console.log(resulttime);
        	        	var result={
        	        		name:resultname,
        	        		content:resultcontent,
                            time:resulttime
        	        	};
        	        	socket.emit('sendToPanelYou',result);
        	        	console.log("执行2");
                    }
                console.log("SELECT Return ==> ");
                console.log(res);
                    }
                }
            });
        /*for (var i=0;i<results.length;i++){
        	if(results[i])
            addMsgFromUser(msgObj,true);
            }*/
    });


	//sendImageToALL
	socket.on('sendImageToALL',function(msgObj){
		/*
			format:{
				from:{
					name:"",
					img:"",
					id:""
				},
				img:""
			}
		*/
		socket.broadcast.emit('sendImageToALL',msgObj);
	});


	//send to one
	socket.on('toOne',function(msgObj){
		/*
			format:{
				from:{
					name:"",
					img:"",
					id:""
				},
				to:"",  //socketid
				msg:""
			}
		*/
		//var toSocket = _.findWhere(socketList,{id:msgObj.to});
		var toSocket = _.findWhere(io.sockets.sockets,{id:msgObj.to});
		console.log(toSocket);
		toSocket.emit('toOne', msgObj);
	});
});
//var jj=[{4:1,2:1,3:1},2,3,4,5];

//console.log(_.findWhere(jj,1));


exports.listen = function(_server){
	io.listen(_server);
};