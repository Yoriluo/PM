
$(function(){
		var r = window.location.search;
			tel = r.substring(5,r.length);
			if(r){
				$('#username').val(tel);
				$('#password').val('');
			}	
			else{
				//cookie用户名和密码的输入
				if ($.cookie("rmbUser") == "true"){
       			 $("#rmbUser").attr("checked", true);
       			 $("#username").val($.cookie("userName"));
       			 $("#password").val($.cookie("passWord"));
   				 }
			}
	var $Login = $('#login');
		rig_title = $('.register-title');
	
	//登陆
	$Login.on('click',function(){
		var info ={
		$Username : $('#username').val(),
		$Password : $('#password').val(),
		}	
		if(!(info.$Username && info.$Password)){
			swal({
				title:'请输入完整信息！',
				timer:1000,
				showConfirmButton:false	
			});
			return false;
		}
		$.ajax({
			url:'index.php/web/User/login',
			type:'POST',
			data:{"userPhoneNumber":info.$Username,"userPassword":info.$Password},
			success:function(data){
				var Data = JSON.parse(data);
				if(Data["statusCode"] == 000000){
					saveUserInfo() ;
					location.href = encodeURI("../projectmanager/index.html?userToken="+Data["userToken"]+"&userId="+Data['userId']+"&userName="+Data['userName']);
				}
				else{
					swal({
						title:'用户不存在或者密码错误',
						timer:1000,
						showConfirmButton:false	
					});
					return false;
				}
				
			}
		});
	});

 // 判断回车  
 $("body").keydown(function(e){
 	e.stopPropagation();
 	e = e || event;
 	if(e.keyCode == 13){
 		$Login.click();
 	}
 });
 rig_title.on('click',function(){
 	location.href = "../projectmanager/register.html";
 });
 });

//存储cookie
function saveUserInfo() {
    if ($("#rmbUser").is(':checked')) {
        var userName = $("#username").val();
        var passWord = $("#password").val();

        $.cookie("rmbUser", "true", { expires: 7 }); // 存储一个带7天期限的 cookie
        $.cookie("userName", userName, { expires: 7 }); // 存储一个带7天期限的 cookie
        $.cookie("passWord", passWord, { expires: 7 }); // 存储一个带7天期限的 cookie
    }
    else {
        $.cookie("rmbUser", "false", { expires: -1 });        // 删除 cookie
        $.cookie("userName", '', { expires: -1 });
        $.cookie("passWord", '', { expires: -1 });
    }
   } 