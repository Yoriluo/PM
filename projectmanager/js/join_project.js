$(function(){
	var join_btn = $('.join_project_complete');
	var url =decodeURI( window.location.href),
      param = url.substring(url.indexOf('?')+1,url.length),
      info = param.split('&');
      userToken = info[0].substring(10,info[0].length);
      userId = info[1].substring(7,info[1].length);
      userName = info[2].substring(9,info[2].length);
      $('.user_name').html(userName);
	join_btn.on('click',function(){
		var txt = $('#join_project_text').val();
		if(!txt){
			alert("请输入项目邀请码！");
			return false;
		}
		$.ajax({
			url:'index.php/web/Project/joinProject',
			type:'POST',
			data:{'inviteNumber':txt,'userToken':userToken},
			success:function(data){
				var Data = JSON.parse(data);
				if(Data('statusCode')==230002){
					alert("邀请码错误！");
				}
				else if(Data('statusCode') ==000000){
					alert('加入项目成功！');
					location.href = encodeURI( "../projectmanager/index.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);

				}	
			}
		});
	});
	var index = $(".index");
		change_pas = $('.change_pas');
		exit = $('.exit');
		set =$('.set_task'),
		news = $('.news');
	index.on('click',function(){
		location.href = encodeURI( "../projectmanager/index.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	change_pas.on('click',function(){
		location.href =encodeURI("../projectmanager/change_pas.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	  $('.exit').on('click',function(){
      	 swal({
       		   			title:'确认退出？',
       		   			type:'warning',
       		   			showCancelButton: true,   
       		   			confirmButtonColor: "#DD6B55",   
       		   			confirmButtonText: "确认", 
       		   			cancelButtonText:"取消",  
       		   			closeOnConfirm: false
       		   		},
       		   		function(){
       		   			$.ajax({
      						url:'index.php/web/User/logout',
      						type:'POST',
      						data:{},
      						success:function(data){
        						var Data = JSON.parse(data);
          						if(Data['statusCode']==000000){
            						location.href = "../projectmanager/login.html";
          						}
      						}
   						 });	 
       	 });
		
	});
	set.on('click',function(){
		location.href = encodeURI("../projectmanager/set_project.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	news.on('click',function(){
		location.href = encodeURI("../projectmanager/news.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
})