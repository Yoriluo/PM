$(function(){
	var password_pattern = /^[0-9a-zA-Z~`!@#$%^&*()-=_+\[\]{};:\'"\\|,<.>\/\?]{6,16}$/;
	    url =decodeURI( window.location.href);
        param = url.substring(url.indexOf('?')+1,url.length);
        info = param.split('&');
        userToken = info[0].substring(10,info[0].length);
        userId = info[1].substring(7,info[1].length);
        userName = info[2].substring(9,info[2].length);
        $('.user_name').html(userName);

	$('#complete').click(function(){
		var tel = $("#tel").val(),
			imppas = $('#import-password').val(),
			confirm_pas = $('#confirm-password').val();
			//输入信息的判断
			if(!(tel && imppas && confirm_pas)){
				swal({
				title:'请输入完整信息！',
				timer:1000,
				showConfirmButton:false	
			});
				return false;
			}
			if(!password_pattern.test(imppas)){
				swal({
				title:'请输入6~16位长度的密码!',
				timer:1000,
				showConfirmButton:false	
			});
				return false;
			}
			if(imppas!==confirm_pas){
				swal({
				title:'两次输入密码不同！',
				timer:1000,
				showConfirmButton:false	
			});
				return false;
			}
			$.ajax({
				url:'index.php/web/User/updatePassword',
				type:'POST',
				data:{'userPassword':tel,'newPassword1':imppas,'newPassword2':confirm_pas,'userToken':userToken},
				success:function(data){
					var Data= JSON.parse(data);
					console.log(Data);
					if(Data['statusCode'] == 000000){
						swal({
							title:'修改成功！',
							timer:1000,
							showConfirmButton:false	
						});
						setTimeout(function(){
							location.href="../projectmanager/login.html";
						},500);
					}
					else if(Data['statusCode'] == 180003){
						swal({
							title:'原密码错误',
							timer:1000,
							showConfirmButton:false	
						});
						setTimeout(function(){
							location.href="../projectmanager/login.html";
						},500);
					}
					else if(Data['statusCode'] == 180001){
						swal({
							title:'请输入6~16长度的密码！',
							timer:1000,
							showConfirmButton:false	
						});
						setTimeout(function(){
							location.href="../projectmanager/login.html";
						},500);
					}
				}
			});
	});
		var index = $(".index");
		join = $('.join_task');
		exit = $('.exit');
			set =$('.set_task'),
		news = $('.news');
	index.on('click',function(){
		location.href = encodeURI("../projectmanager/index.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	join.on('click',function(){
		location.href = encodeURI("../projectmanager/join_project.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
		set.on('click',function(){
		location.href = encodeURI("../projectmanager/set_project.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	news.on('click',function(){
		location.href = encodeURI("../projectmanager/news.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
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
	// 判断回车  
	$("body").keydown(function(e){
		e = e || event;
		if(e.keyCode == 13){
			$("#complete").click();
		}
	});
})