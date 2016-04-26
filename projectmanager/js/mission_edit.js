$(function(){
	var stage_sel = $('.stage_selector'),
		add_sel = $('.add_men_selector'),
		del_men = $('.del_men'),
		begin_sel_time = $('.begin_sel_time'),
		end_sel_time =$('.end_sel_time'),
		task_complete_lay =$('.task_complete_lay');
		add_men_selector = $('.add_men_selector');
	var taskUserId ='';
		num = {
			1:'第一阶段',
			2:'第二阶段',
			3:'第三阶段',
			4:'第四阶段',
			5:'第五阶段',
			6:'第六阶段',
			7:'第七阶段',
			8:'第八阶段',
			9:'第九阶段',
		};
		//页面传参的获取||修改任务
		var url = decodeURI(window.location.href),
	    param = url.substring(url.indexOf("?")+1,url.length),
	    info = param.split("&");
	    id = info[1].substring(3,info[1].length),
	    userToken = info[0].substring(10,info[0].length);
	    userId  = info[2].substring(7,info[2].length);
	    userName = info[3].substring(9,info[3].length);
	    $('.user_name').html(userName);
		if(info.length>4){
	   	 var taskName = info[4].substring(9,info[4].length),
	   		 stageName = info[5].substring(10,info[5].length);
	   		 taskBegin = info[6].substring(10,info[6].length),
	   		 taskEnd = info[7].substring(8,info[7].length);
	   		 which = '';
	   		 taskId = info[9].substring(7,info[9].length),
	   		 taskUserId=task_userId = info[10].substring(12,info[10].length);
	   		 mem = taskUserId.split(',');
	   		 memList =[];
	   		 memid= [];
	   		 $('#stage_select_text').val(stageName);
	   		 // $('#stage_select_text').val(which);
	   		 $('#import_task_name_text').val(taskName);
	   		 $('#begin_time_lay').html(taskBegin.substring(0,10));
	   		 $('#end_time_lay').html(taskEnd.substring(0,10));
	   		$.ajax({
	   			url:'index.php/web/Project/getPartnerList',
	   			type:'POST',
	   			data:{'projectId':id,'userToken':userToken},
	   			success:function(data){
	   				var Data =JSON.parse(data);
	   				if(Data['statusCode']==000000){
	   					for(var i=0;i<mem.length;i++){
	   						for(var j=0;j<Data['partnerList'].length;j++){
	   							if(mem[i] == Data['partnerList'][j]['userId']){
	   								memList.push(Data['partnerList'][j]['userName']);
	   								memid.push(Data['partnerList'][j]['userId']);
	   							}
	   						}
	   					}
	   				}
	   				var each_men='';
	   				for(var z=0;z<memList.length;z++){
	   					each_men+= "<div class='each_men'><div class='men_name'>"+memList[z]+"</div><div class='del_men' data-id="+memid[z]+">×</div></div>";
	   				}
	   				$('.existed_men').html(each_men);
	   			}
	   		});
	   		var mem_text = '';
	   		$(document).on('click',function(){
	   			$('.each_stage_men input').each(function(){
					if($(this).is(':checked')){
						if(mem_text.indexOf($(this).data('id'))<0){
							mem_text+=$(this).data('id')+',';
						}
					}
				});
	   		});
	   		$('.add_men_selector').on('click',function(){
	   			$('.each_stage_men input').each(function(){
					if($(this).is(':checked')){
						if(mem_text.indexOf($(this).data('id'))<0){
							mem_text+=$(this).data('id')+',';
						}
					}
				});
	   		});

            var jud = false;
	   		$(document).on('click','.del_men',function(){
	   			console.log(mem_text);
	   			var this_id = $(this).data('id');
	   			for(j=0;j<memid.length;j++){
	   				if(this_id == memid[j]){
	   					memid.splice(j,1);
	   					$(this).parent().remove();
	   				}
	   			}
	   			for(var i=0;i<memid.length;i++){
					mem_text+=memid[i]+',';
				}
				jud = true;
				$('.add_men_lay').append("<li class='each_stage_men'><input type='checkbox' value='"+$(this).prev().html()+"'data-id= '"+$(this).data('id')+"'>"+$(this).prev().html()+"</input></li>");
	   		});
	  		
				$('.task_complete_lay').on('click',function(){
					console.log(mem_text);
					if(jud == false){
						for(var i=0;i<memid.length;i++){
							mem_text+=memid[i]+',';
					}
					}
					console.log(memid)
					mem_text = mem_text.substring(0,mem_text.length-1);
					var taskbegin = $('#begin_time_lay').html();
						taskend = $('#end_time_lay').html();
					var BT = new Date(taskbegin.replace("-", "/").replace("-", "/"));
						ET = new Date(taskend.replace("-", "/").replace("-", "/"));
					if(BT<=ET){
						$.ajax({
						url:'index.php/web/Task/updateTask',
						type:'POST',
						data:{'userToken':userToken,'projectId':id,'taskId':taskId,'members':mem_text,'taskName':taskName ,'stageName':stageName,'taskBegin':taskbegin,'taskEnd':taskend},
						success:function(data){
							var Data = JSON.parse(data);
							if(Data['statusCode'] == 000000){
								swal({
									title:'修改任务成功！',
									timer:1000,
									showConfirmButton:false	
								});
									mem_text = '';
									location.href = encodeURI("../projectmanager/task_detail.html?userToken="+userToken+"&id="+id+"&userId="+userId+"&userName="+userName);
							}
							else{
								swal({
									title:'修改任务失败!',
									timer:1000,
									showConfirmButton:false	
								});
							}
						}
					});
					}
					else{
						swal({
							title:'日期顺序错误！',
							timer:1000,
							showConfirmButton:false	
						});
					}
				})
				$.ajax({
			url:'index.php/web/Task/getStageList',
			type:'POST',
			data:{'projectId':id,userToken:userToken},
			success:function(data){
				var Data = JSON.parse(data);
					if(Data['statusCode']==000000){
						str = '';
					console.log(Data);
				 	for(var i=0;i<Data['stageList'].length;i++){
				 		str+= "<li class='each_stage'>"+Data['stageList'][i]['stageName']+"</li>";
				 	}
   					$('.selector_lay').html(str);
					}
			}
		});

		}

	    //点击事件
		stage_sel.click(function(e){
			e.stopPropagation();
			$('.selector_lay').toggle();
			
		});
		add_sel.click(function(e){
			e.stopPropagation();
			$('.add_men_lay').toggle();
		}).find('*').click(function(e){e.stopPropagation();});


		$(document).on('click',function(){
			$('.selector_lay').hide();
			$('.add_men_lay').hide();
			stage_sel.css('background-image','url(http://localhost/projectmanager/images/list.png)');
			add_sel.css('background-image','url(http://localhost/projectmanager/images/list.png)');

			
				all_person ='';
				$('.each_stage_men input').each(function(){
					if($(this).is(':checked')){
						all_person+=$(this).val()+',';
					}
					$('#add_men_text').val(all_person.substring(0,all_person.length-1))
				});

		});
		$('.selector_lay').on('click','.each_stage',function(){
				$("#stage_select_text").val($(this).html());
		});

		$('.add_men_lay').on('click','.each_stage_men',function(){
			if($(this).children('input').is(':checked')){
				$(this).children('input').prop('checked',false);
			}
			else{
				$(this).children('input').prop('checked','checked');
			}
		});
		$('.add_men_lay').on('click','.each_stage_men input',function(){
			if($(this).is(':checked')){
				$(this).prop('checked',false);
			}
			else{
				$(this).prop('checked','checked');
			}
		});


		if(info.length<=4){
				$('.each_men').html("暂无成员").css({'text-align':'center','line-height':'35px','color':'rgb(140, 135, 135)'});
				task_complete_lay.on('click',function(){
				var mem_text = '';
				$('.each_stage_men input').each(function(){
					if($(this).is(':checked')){
						mem_text+=$(this).data('id')+',';
					}
				});
				mem_text= mem_text.substring(0,mem_text.length-1);
			var stage_name_text = $('#stage_select_text').val(),
				import_task_name_text = $('#import_task_name_text').val(),
				add_men_text =mem_text;
				begin_time_lay = $('#begin_time_lay').html(),
				end_time_lay = $('#end_time_lay').html();
				if(!(stage_name_text && import_task_name_text  && begin_time_lay && end_time_lay)){
					swal({
							title:'请输入完整信息！',
							timer:1000,
							showConfirmButton:false	
						});
					return false;
				}
				var BT = new Date(begin_time_lay.replace("-", "/").replace("-", "/"));
					ET = new Date(end_time_lay.replace("-", "/").replace("-", "/"));
				if(BT<=ET){
					$.ajax({
					url:'index.php/web/Task/addTask',
					type:'POST',
					data:{'userToken':userToken,'projectId':id,'members':add_men_text,'taskName':import_task_name_text,'stageName':stage_name_text,'taskBegin':begin_time_lay,'taskEnd':end_time_lay},
					success:function(data){
						var Data = JSON.parse(data);
						if(Data['statusCode']==000000){
							location.href = encodeURI("../projectmanager/task_detail.html?userToken="+userToken+"&id="+id+"&userId="+userId+"&userName="+userName);
						}
					}
				});
				}
				else{
					swal({
							title:'日期顺序错误！',
							timer:1000,
							showConfirmButton:false	
						});
				}
				
		});

			var today = new Date();
				fullyear = today.getFullYear();
				fullMonth = today.getMonth()+1;
				fullday = today.getDate();
				if(fullMonth<10){
					fullMonth = '0'+fullMonth;
				}
			hold_time = fullyear+'-'+fullMonth+'-'+fullday;
			$('#begin_time_lay,#end_time_lay').html(hold_time);
			$.ajax({
			url:'index.php/web/Task/getStageList',
			type:'POST',
			data:{'projectId':id,userToken:userToken},
			success:function(data){
				var Data = JSON.parse(data);
					if(Data['statusCode']==000000){
						str = '';
				 	for(var i=0;i<Data['stageList'].length;i++){
				 		str+= "<li class='each_stage'>"+Data['stageList'][i]['stageName']+"</li>";
				 	}
   					$('.selector_lay').html(str);
					}
			}
		});
	}

		var all_person='';
		add_men_selector.on('click',function(){
			if($(this).css('background-image')=='url(http://localhost/projectmanager/images/listup.png)'){
				all_person ='';
				$('.each_stage_men input').each(function(){
					if($(this).is(':checked')){
						all_person+=$(this).val()+',';
					}
					$('#add_men_text').val(all_person.substring(0,all_person.length-1))
				});
			}
			if($('.add_men_lay').children().length>0){
							if($(this).css('background-image')=='url(http://localhost/projectmanager/images/list.png)'){
				$(this).css('background-image','url(http://localhost/projectmanager/images/listup.png)')
			}
			else{$(this).css('background-image','url(http://localhost/projectmanager/images/list.png)');}	
			}

		});
		
		$.ajax({
			url:'index.php/web/Project/getPartnerList',
			type:'POST',
			data:{'projectId':id,'userToken':userToken},
			success:function(data){
				var Data =JSON.parse(data),
					menstr = '';
				if(Data['statusCode'] == 240001){
					console.log(true)
					$('.stage_selector').css('display','none');
					$('#stage_select_text').css('width','312px')
				}
				if(Data['statusCode'] == 000000){
						taskUserId = taskUserId.split(",");
					for(var i =0,len = Data['partnerList'].length;i<len;i++){
						var judge = false;
							for(var j =0;j<taskUserId.length;j++){
								if(Data['partnerList'][i]['userId'] == taskUserId[j]){
									judge = true;
									continue;
								}
							}
						if(judge == false){
							menstr+="<li class='each_stage_men'><input type='checkbox' value='"+Data['partnerList'][i]['userName']+"'data-id= '"+Data['partnerList'][i]['userId']+"'>"+Data['partnerList'][i]['userName']+"</input></li>";
						}
					}
					$(".add_men_lay").html(menstr);
				}
			}
		});

	

	  $('.index').on('click',function(){
    	location.href = encodeURI("../projectmanager/index.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
    });
    $('.set_task').on('click',function(){
    	location.href =encodeURI("../projectmanager/set_project.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
    });
     $('.join_task').on('click',function(){
    	location.href = encodeURI("../projectmanager/join_project.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
    });
    $('.news').on('click',function(){
    	location.href =encodeURI("../projectmanager/news.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
    });
     $('.change_pas').on('click',function(){
    	location.href = encodeURI("../projectmanager/change_pas.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
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
});



 //计算天数差的函数，通用  
   function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式  
       var strSeparator = "-"; //日期分隔符 
var oDate1; 
var oDate2; 
var iDays; 
oDate1= sDate1.split(strSeparator); 
oDate2= sDate2.split(strSeparator); 
var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]); 
var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]); 
iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数 
return iDays ;
   }   
