$(function(){
	$('#complete').on('click',function(){
		var tel = $('#tel'),
			alpCode = $('#alpCode'),
			imppas = $('#import-password'),
			confpas = $('#confirm-password');
			reg = /(1[3-9]\d{9}$)/,
			password_pattern = /^[0-9a-zA-Z~`!@#$%^&*()-=_+\[\]{};:\'"\\|,<.>\/\?]{6,16}$/;

			if(!(tel && alpCode && imppas && confpas )){
				swal({
				title:'请输入完整信息！',
				timer:1000,
				showConfirmButton:false	
			});
				return false;
			}		
			if(!reg.test(tel)){
				swal({
				title:'请输入正确格式的手机号码!',
				timer:1000,
				showConfirmButton:false	
			});
				return false;
			}
			if(!password_pattern.test(imppas)){
				swal({
				title:'请输入6~16位包含数字或字母的密码！',
				timer:1000,
				showConfirmButton:false	
			});
				return false;
			}
			if(imppas!==confpas){
				swal({
				title:'两次输入密码不同！',
				timer:1000,
				showConfirmButton:false	
			});
				return false;
			}
			$.ajax({
				url:'index.php/web/User/setNewPassword',
				type:'POST',
				data:{' checkCode':alpCode,'newPassword1':imppas,'newPassword2':confpas},
				success:function(data){
					var Data = JSON.parse(data);
					if(Data['statusCode']==000000){
						swal({
							title:'新密码设置成功！',
							timer:1000,
							showConfirmButton:false	
						});
					}
				}
			});
	});
})