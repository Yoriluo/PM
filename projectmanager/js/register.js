$(function(){
	var $alpcode = $(".sent-alpCode");
	//发送验证码倒计时
	var wait =60;
	function settime(btn){
		if(wait == 0){
			btn.removeAttr('disabled');
			btn.css('background-color','00aff2');
			btn.css('background-image','linear-gradient(to bottom,#00b4f5,#008dc5)');
			btn.html('发送验证码');
			wait = 60;
		}
		else{
			btn.attr('disabled',true);
			btn.css('background','#C5C3C3');
			btn.css('color','#FFFFFF');
			btn.css('background-image','linear-gradient(to bottom,#D9DADA,#D9DADA');
			btn.html(wait+'秒');
			wait--;
			setTimeout(function(){
				settime(btn);
			},1000);
		}
	}

	$alpcode.on('click',function(){
	var $tel = $('#tel').val(),
		reg = /(1[3-9]\d{9}$)/;
		if(!reg.test($tel)){
			swal({
					title:'请输入正确格式的手机号码！',
					timer:1000,
					showConfirmButton:false	
				});
				return false;
		}
		settime($alpcode);
	})
	//获取验证码
	$(".sent-alpCode").on('click',function(){
		var $tel = $('#tel').val();
		$.ajax({
			url:"index.php/web/SMS/getRegisterCheckCode",
			type:"POST",
			data:{"userPhoneNumber":$tel},
			success:function(data){
				var Data = JSON.parse(data);
				console.log(Data)
				if(Data["statusCode"]==000000){
				swal({
					title:'正在获取手机验证码....',
					timer:1000,
					showConfirmButton:false	
				});
				}
				else{
					return false;
				}
			}
		});
	})
	//完成注册
	$('#complete').on('click',function(){
		var $tel = $('#tel').val(),
			$alpCode = $('#alpCode').val(),
			$imp_password = $('#import-password').val(),
			$cfm_password =$('#confirm-password').val(),
			$imp_name =$('#import-name').val(),
			reg = /(1[3-9]\d{9}$)/,
			pattern =/^[a-zA-Z]{1}[0-9a-zA-Z_]{1,}$/;
			password_pattern = /^[0-9a-zA-Z~`!@#$%^&*()-=_+\[\]{};:\'"\\|,<.>\/\?]{6,16}$/;
			if(!($tel && $alpCode && $imp_password && $cfm_password && $imp_name)){
				swal({
						title:'请输入完整的信息！',
						timer:1000,
						showConfirmButton:false	
					});
				return false;
			}
			if(!reg.test($tel)){
				swal({
						title:'请输入正确格式的手机号码！',
						timer:1000,
						showConfirmButton:false	
					});
				return false;
			}
			if(!password_pattern.test($imp_password)){
				swal({
						title:'请输入6~16位包含数字或字母的密码！',
						timer:1000,
						showConfirmButton:false	
					});
				return false;
			}
			if($imp_password!==$cfm_password){
				swal({
						title:'两次输入的密码不同！',
						timer:1000,
						showConfirmButton:false	
					});
			return false;
			}
			// if(0){
			// 	alert('请输入正确格式的姓名！');
			// 	return false;
			// }
			$.ajax({
				url:"index.php/Web/User/register",
				type:'POST',
				data:{"userPhoneNumber":$tel,"checkCode":$alpCode,"userPassword":$imp_password,"rePassword":$cfm_password,"userName":$imp_name},
				success:function(data){
					var Data = JSON.parse(data)
					if(Data["statusCode"] == 000000){
						swal({
						title:'注册成功！',
						timer:1000,
						showConfirmButton:false	
					});
						setTimeout(function(){
							location.href = encodeURI("../projectmanager/login.html?tel="+$tel);
						},1000);
					}
					if(Data['statusCode']==160006){
						swal({
						title:'该号码已注册',
						timer:1000,
						showConfirmButton:false	
					});
					}
				},
				
			});
	});
	$(".rig-login-title").on('click',function(){
		location.href = "../projectmanager/login.html";
	});
	// 判断回车  
	$("body").keydown(function(e){
		e = e || event;
		if(e.keyCode == 13){
			$("#complete").click();
		}
	});
})