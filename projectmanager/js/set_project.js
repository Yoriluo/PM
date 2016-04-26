$(function(){
	//创建项目
	var set_finish = $(".set_project_complete");
	  var url =decodeURI( window.location.href),
      param = url.substring(url.indexOf('?')+1,url.length),
      info = param.split('&');
      userToken = info[0].substring(10,info[0].length);
      userId = info[1].substring(7,info[1].length);
      userName = info[2].substring(9,info[2].length);
      $('.user_name').html(userName);

	set_finish.on('click',function(){
		var text = $("#import_project_text").val();
		console.log(text)
		if(!text){
			swal({
					title:'请输入项目名称！',
					timer:1000,
					showConfirmButton:false	
				});
			return false;
		}
		var judge = false;
		$.ajax({
			url:'index.php/web/Project/addProject',
			type:'POST',
			async:false, 
			data:{'projectName':text,'userToken':userToken},
			success:function(data){
				var Data = JSON.parse(data);
				console.log(Data);
				if(Data['statusCode'] == 000000){
					swal({
					title:'创建成功！',
					timer:1000,
					showConfirmButton:false	
					});
					$("#import_project_text").val('');
					judge = true;
				}
				else{
					swal({
					title:'请输入2~20长度的中英文名称',
					timer:1000,
					showConfirmButton:false	
					});
				}
			}
		});
		console.log(judge)
		if(judge == true){
			$.ajax({
						url:'index.php/web/Project/getProjectList',
						type:'POST',
						data:{'userToken':userToken},
						success:function(data){
							var Data = JSON.parse(data);
								console.log(Data);
								projectId = Data['myProject'][Data['myProject'].length-1]['projectId'];
								location.href = encodeURI("../projectmanager/task_detail.html?userToken="+userToken+"&id="+projectId+"&userId="+userId+"&userName="+userName); 
						}
		});
		}
	});
	var index = $(".index");
		join = $('.join_task');
		change_pas = $('.change_pas');
		exit = $('.exit');
		news = $('.news');
	index.on('click',function(){
		location.href =encodeURI( "../projectmanager/index.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	join.on('click',function(){
		location.href =encodeURI( "../projectmanager/join_project.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	change_pas.on('click',function(){
		location.href = encodeURI("../projectmanager/forgetPas.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
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
	news.on('click',function(){
		location.href = encodeURI("../projectmanager/news.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	change_pas.on('click',function(){
		location.href = encodeURI("../projectmanager/change_pas.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	// 判断回车  
	$("body").keydown(function(e){
		e = e || event;
		if(e.keyCode == 13){
			$(".set_project_complete").click();
		}
	});
})