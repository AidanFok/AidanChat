//connection to host and port
var socket = io();

//when user login or logout,system notice
socket.on('loginInfo',function(msg){
  refreshFriend();
	addMsgFromSys(msg);
  Messenger().post({
    message: "<a href=javascript:refreshFriend()>"+msg,
    showCloseButton: true
  });
});
socket.on('refreshFriend',function(){
  refreshFriend();
});

socket.on('userExisted', function() {
  alert('用户名或邮箱已存在');
  return;
});


socket.on('userNotExist', function() {
  alert('查无此人');
  return;
});

socket.on('friendNotExist', function() {
  alert('查无此人或已经是你的好友');
  return;
});

//add user in ui
socket.on('onlineList',function(userList){
	//modify user count
	//modifyUserCount(userList.length);
  addUserOn(userList);
});

//add user in ui
socket.on('offlineList',function(userList){
  //modify user count
  //modifyUserCount(userList.length);
  addUserOff(userList);
});



//client review user information after login
socket.on('userInfo',function(userObj){
      $('#myModal').modal('hide');
      $('#username').val('');
      $('#password').val('');
      $('#email').val('');
      $('#msg').focus();
  //should be use cookie or session
	userSelf = userObj;
  $('#spanuser').text('欢迎你！'+userObj.name);
});

//review message from toOne
//接收信息
socket.on('toOne',function(msgObj){
  Messenger().post({
    message: "<a href=\"javascript:focusOnPanelOnline(\'"+msgObj.from.name+"\',\'"+msgObj.from.id+"\');\">"+msgObj.from.name + " send to you a message:"+ msgObj.msg+"</a>",
    showCloseButton: true
  });
  addMsgFromUser(msgObj,false);
});

socket.on('sendToPanelUs',function(msgObj){
  addMsgFromUserPre(msgObj,true);
});

socket.on('sendToPanelYou',function(msgObj){
  addMsgFromUserPre(msgObj,false);
});

socket.on('searchResult',function(result){
  $('#namelist').text('用户名：'+result.name+' 性别：'+result.gender+' 申请理由：');
  document.getElementById("addReason").style.display="inline";
  document.getElementById("namelist").style.display="inline";
  document.getElementById("addSendlabel").style.display="inline";
  $('#addSendlabel').text('');
  $('#addSendlabel').append("<a href=\"javascript:addFriendRequest(\'"+userSelf.name+"\',\'"+result.name+"\');\">"+'点击发送申请');
});

socket.on('requestSuccess',function(){
  alert('申请发送成功');
  $('#searchUser').modal('hide');
  return;
});

socket.on('friendResult',function(result){
  $('#delnamelist').text('');
  for(var i=0;i<result.length;i++){
    $('#delnamelist').append('用户名：'+result[i].friend+"<a href=\"javascript:delFriendRequest(\'"+userSelf.name+"\',\'"+result[i].friend+"\');\">"+'   点击删除');
    $('#delnamelist').append(document.createElement("br"));
  }
});

socket.on('groupResult',function(result){
  document.getElementById("groupnamelist").style.display="inline";
  $('#groupnamelist').text('');
  for(var i=0;i<result.length;i++){
    $('#groupnamelist').append('用户名：'+result[i].friend+'   所在组：'+result[i].state+"<a href=\"javascript:showGroupModify(\'"+userSelf.name+"\',\'"+result[i].friend+"\',\'"+result[i].state+"\');\">"+'   点击修改分组');
    $('#groupnamelist').append(document.createElement("br"));
  }
});

socket.on('deleteSuccess',function(){
  refreshFriend();
  alert('删除成功');
  $('#deleteUser').modal('hide');
  return;
});

socket.on('updateSuccess',function(){
  refreshFriend();
  alert('修改分组成功');
  $('#groupUser').modal('hide');
  return;
});

socket.on('clearSuccess',function(){
  alert('已拒绝');
  $('#acceptUser').modal('hide');
  return;
});

socket.on('acceptSuccess',function(){
  refreshFriend();
  alert('已通过');
  $('#acceptUser').modal('hide');
  return;
});


socket.on('requestResult',function(result){
  $('#accnamelist').text('');
  for(var i=0;i<result.length;i++){
    $('#accnamelist').append('用户名：'+result[i].fromname+"<a href=\"javascript:acceptRequest(\'"+result[i].fromname+"\',\'"+userSelf.name+"\');\">"+'   点击接受'+"<a href=\"javascript:rejectRequest(\'"+result[i].fromname+"\',\'"+userSelf.name+"\');\">"+'   点击拒绝');
    $('#accnamelist').append(document.createElement("br"));
    $('#accnamelist').append('申请理由: '+result[i].reason);
    $('#accnamelist').append(document.createElement("br"));
    $('#accnamelist').append(document.createElement("br"));
  }
});