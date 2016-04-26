$(function(){
	var url = decodeURI(window.location.href),
	    param = url.substring(url.indexOf('?')+1,url.length),
	    info = param.split('&');
	    id = info[1].substring(3,info[1].length),
	    userId = info[2].substring(7,info[2].length),
	    userToken = info[0].substring(10,info[0].length);
		userName = info[3].substring(9,info[3].length);
	    $('.user_name').html(userName);
	    num_which = {
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
		var userAgent = navigator.userAgent.toLowerCase(); 
// Figure out what browser is being used 
jQuery.browser = { 
version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1], 
safari: /webkit/.test( userAgent ), 
opera: /opera/.test( userAgent ), 
msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ), 
mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ) 
}; 
      $('.set_task_btn').on('click',function(){
    	location.href =encodeURI("../projectmanager/mission_edit.html?userToken="+userToken+"&id="+id+"&userId="+userId+"&userName="+userName);
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

      // 判断项目是否完成
      var bool = true;
      $.ajax({
		url:'index.php/web/Project/getProjectList',
		type:'POST',
		async:false,
		data:{'userToken':userToken},
		success:function(data){
			var Data = JSON.parse(data);
    		for(var i=0;i<Data['myProject'].length;i++){
    			if(id == Data['myProject'][i]['projectId']){
    				if(Data['myProject'][i]['status'] == 1){
    					bool = false;
    					$('.set_task_btn').unbind('click').css('background','#C7C7C7');
    					$('.sidebar_main').unbind('click');
    					$('.finish_task_btn').unbind('click').css('background','#C7C7C7');
    				}
    			}
    		}
	
		}
	});
show_all();
 function show_all(){
   	var stage_list = [];
	$.ajax({
		url:'index.php/web/Project/getProjectInfoByTime',
		type:'POST',
		data:{'projectId':id,'userToken':userToken},
		success:function(data){
			var Data =JSON.parse(data);
			var num =[];
			console.log(Data);
			$('.sidebar_project_name').html(Data['projectInfo']['project'][0]['projectName']);
			$('.code').html(Data['projectInfo']['project'][0]['inviteNumber']);
			if(Data['projectInfo']['task'].length>0){
				num.push(Data['projectInfo']['task'][0]['stageName']);
			for(var i=0,len=Data['projectInfo']['task'].length;i<len;i++){
				boolen= false;
					if(i>0){
						for(var j=0;j<num.length;j++){
							if(Data['projectInfo']['task'][i]['stageName']==num[j]){
								boolen = true;
							}
							if(j==num.length-1 && boolen !=true){
								num.push(Data['projectInfo']['task'][i]['stageName']);
							}
						}
					}
			}
			stage_list = num;
			var each_task =[];
			for(var m=0;m<stage_list.length;m++){
				each_task[m]=[];
				for(var z=0,len=Data['projectInfo']['task'].length;z<len;z++){
						if(Data['projectInfo']['task'][z]['stageName'] == stage_list[m]){
							each_task[m].push(Data['projectInfo']['task'][z]);
						}
					}	
				}
				for(var i=0;i<each_task.length;i++){
					for(var j =0;j<each_task[i].length;j++){
						if(j+1!=each_task[i].length){
							// console.log(each_task[i][j]['userId']);
						}
					}
				}
				var color = {
					0:'#ff7568',
					1:'#4bcec6',
					2:'#897ccb',
					3:'#62ccf6'
					}
					color_two = {
						0:'#B5B6BB',
						1:'#4bcec6'
					}	
				show_sidebar(each_task,color,stage_list);
					//被多个id覆盖的id的删除
					for(var i=0;i<Data['projectInfo']['task'].length;i++){
					if(i+1!=Data['projectInfo']['task'].length){
						if(String(Data['projectInfo']['task'][i+1]['userId']).indexOf(',')!=-1){
							Data['projectInfo']['task'].splice(i,1);
							i=i-1;
						}
					}
				}

				//被多个id覆盖的id的删除
					for(var i=0;i<each_task.length;i++){
						for(var j=0;j<each_task[i].length;j++){
							if(j+1!=each_task[i].length){
								if(String(each_task[i][j+1]['userId']).indexOf(',')!=-1){
									each_task[i].splice(j,1);
									j=j-1;
								}
							}
						}
					}
					//甘特图时间的显示
					var Time_len =Gan_Time(Data,each_task);

					//甘特图内容的显示
					Show_Gan(Data,each_task,Time_len);

					//甘特图任务省略内容的显示
					Show_Task();
			}
		}
	});
   }
	if(bool == true){
		$(document).on('click','.sidebar_change',function(){
		var taskId = $(this).data('taskid'),
			userId_lay = $(this).data('task_userid');
			task_userId = userId_lay==null?'':userId_lay,
			taskName = $(this).data('taskname'),
			stageName= $(this).data('stagename'),
			taskBegin = $(this).data('taskbegin'),
			taskEnd = $(this).data('taskend'),
			which = $(this).data('which');
			url= encodeURI("../projectmanager/mission_edit.html?userToken="+userToken+"&id="+id+"&userId="+userId+"&userName="+userName+"&taskName="+taskName+"&stageName="+stageName+"&taskBegin="+taskBegin+"&taskEnd="+taskEnd+"&which="+which+"&taskId="+taskId+"&task_userId="+task_userId);
			location.href = url;

	});
	}
	
	$('.finish_task_btn').on('click',function(){
		if($(this).css('background-color') == 'rgb(199, 199, 199)'){
			return false;
		}
		else{
			swal({
       		   	title:'确认完成？',
       		   	type:'warning',
       		   	showCancelButton: true,   
       		   	confirmButtonColor: "#DD6B55",   
       		   	confirmButtonText: "确认", 
       		   	cancelButtonText:"取消",  
       		   	closeOnConfirm: false
       		   },
       		   function(){
       		   		$.ajax({
						url:'index.php/web/Project/finishProject',
						type:'POST',
						data:{'projectId':id,'userToken':userToken},
						success:function(data){
						var Data = JSON.parse(data);
						console.log(Data);
						if(Data['statusCode'] ==000000){
							 location.href=encodeURI("../projectmanager/index.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
				
						}
						else if(Data['statusCode']==250001){
						swal({
							title:'存在任务未完成或不存在任务！',
							timer:1000,
							showConfirmButton:false	
						});
						}		
					}
		});
        });

		}
	});
//侧边栏的切换
change_func();
function change_func(){
$(document).on('click','.cancel_comp',function(){
					var id = $(this).data('taskid');
					$.ajax({
						url:'index.php/web/Task/cancelFinishTask',
						type:'POST',
						data:{'taskId':id,'userToken':userToken},
						success:function(data){
							var Data = JSON.parse(data);
							if(Data['statusCode'] == 000000){
								show_all();
							}
						}
					});
				});
}

cancel_task_two_btn();
function cancel_task_two_btn(){
	$(document).on('click','.cancel_two_task',function(){
		var id =$(this).data('taskid');
		$.ajax({
			url:'index.php/web/Task/cancelTask',
			type:'POST',
			data:{'taskId':id,'userToken':userToken},
			success:function(data){
				var Data = JSON.parse(data);
				if(Data['statusCode'] == 000000){
					show_all();
				}
			}
		});
	});
}
cancel_task_btn();
function cancel_task_btn(){
	$(document).on('click','.cancel_task',function(){
		var id =$(this).data('taskid');
		$.ajax({
			url:'index.php/web/Task/cancelTask',
			type:'POST',
			data:{'taskId':id,'userToken':userToken},
			success:function(data){
				var Data = JSON.parse(data);
				if(Data['statusCode'] == 000000){
					show_all();
				}
			}
		});
	});
}
//完成任务
ok_task_btn();
function ok_task_btn(){
	if(bool == true){
		$(document).on('click','.ok_task',function(){
		var id =$(this).data('taskid');
		$.ajax({
			url:'index.php/web/Task/finishTask',
			type:'POST',
			data:{'taskId':id,'userToken':userToken},
			success:function(data){
				var Data = JSON.parse(data);
				if(Data['statusCode'] == 000000){
					show_all();
				}
			}
		});
	});
	}
}
//侧边栏任务的实现
function show_sidebar(each_task,color,stage_list){
		var all='';
			each_stage= '';
			mask = '';
	for(var i= 0;i<each_task.length;i++){
					each_stage='';
					for(var j =0;j<each_task[i].length;j++){
						if(j+1!=each_task[i].length){
							if(each_task[i][j]['taskId'] == each_task[i][j+1]['taskId']){
							each_task[i][j+1]['userId']=each_task[i][j+1]['userId']+','+each_task[i][j]['userId'];
							each_task[i][j+1]['userName']=each_task[i][j+1]['userName']+' '+each_task[i][j]['userName'];
							mask = each_task[i][j]['taskId'];
							continue;
						    }
						    if(mask == each_task[i][j+1]['taskId']){
							each_task[i][j+1]['userId']=each_task[i][j+1]['userId']+','+each_task[i][j]['userId'];
							each_task[i][j+1]['userName']=each_task[i][j+1]['userName']+' '+each_task[i][j]['userName'];
							continue;
						    }
						}
						var judge = false;
							if(String(each_task[i][j]['userId']).indexOf(userId)>=0){
								judge=true;
							}
						if(bool ==true){
							if(judge == true){
							if(each_task[i][j]['status'] == 0){	
							 each_stage+="<li class='each_list'><div class='sidebar_task_name'>"+each_task[i][j]['taskName']+"</div><ul class='sel_box' style='background:"+color[i]+"'><li class='sidebar_change' style='background:"+color[i]+"'data-task_userId ='"+each_task[i][j]['userId']+"' data-taskId ='"+each_task[i][j]['taskId']+"' data-members = '"+each_task[i][j]['userId']+"' data-taskName = '"+each_task[i][j]['taskName']+"' data-stageName = '"+each_task[i][j]['stageName']+"'data-taskBegin= '"+each_task[i][j]['taskBegin']+"' data-taskEnd = '"+each_task[i][j]['taskEnd']+"' data-which='"+num_which[i+1]+"'>修改</li><li class='sidebar_down'></li><li class='ok_task' data-taskId="+each_task[i][j]['taskId']+" style='background:"+color[i]+"'>完成任务</li><li class='cancel_task' data-taskId="+each_task[i][j]['taskId']+" style='background:"+color[i]+"'>删除任务</li></ul></li>";	
							}
							else if(each_task[i][j]['status'] == 1){
							each_stage+="<li class='each_list'><div class='sidebar_task_name'>"+each_task[i][j]['taskName']+"</div><ul class='sel_box' style='background:"+color[i]+"'><li class='cancel_comp' data-taskId="+each_task[i][j]['taskId']+" style='background:"+color[i]+"'>取消完成</li><li class='sidebar_down'></li><li class ='cancel_two_task' data-taskId="+each_task[i][j]['taskId']+" style='background:"+color[i]+"'>删除任务</li></ul></li>";		
							}
						}
						else{
							if(each_task[i][j]['status'] == 0){	
							 each_stage+="<li class='each_list'><div class='sidebar_task_name'>"+each_task[i][j]['taskName']+"</div><ul class='sel_box' style='background:"+color[i]+"'><li class='sidebar_change' style='background:"+color[i]+"'data-task_userId ='"+each_task[i][j]['userId']+"' data-taskId ='"+each_task[i][j]['taskId']+"' data-members = '"+each_task[i][j]['userId']+"' data-taskName = '"+each_task[i][j]['taskName']+"' data-stageName = '"+each_task[i][j]['stageName']+"'data-taskBegin= '"+each_task[i][j]['taskBegin']+"' data-taskEnd = '"+each_task[i][j]['taskEnd']+"' data-which='"+num_which[i+1]+"'>修改</li><li class='sidebar_down'></li><li class='cancel_task cancel_task_sec' data-taskId="+each_task[i][j]['taskId']+" style='background:"+color[i]+"'>删除任务</li></ul></li>";	
							}
							else if(each_task[i][j]['status'] == 1){
							each_stage+="<li class='each_list'><div class='sidebar_task_name'>"+each_task[i][j]['taskName']+"</div><ul class='sel_box' style='background:"+color[i]+"'><li class='cancel_comp' data-taskId="+each_task[i][j]['taskId']+" style='background:"+color[i]+"'>取消完成</li><li class='sidebar_down'></li><li class ='cancel_two_task' data-taskId="+each_task[i][j]['taskId']+" style='background:"+color[i]+"'>删除任务</li></ul></li>";		
							}
						}
						}
						else{
							each_stage+="<li class='each_list'><div class='sidebar_task_name'>"+each_task[i][j]['taskName']+"</div></li>";		
						}
					}
					each_stage=	"<ul class='stage_one_content'>"+each_stage+"</ul><ul class='clr'></ul>";
					each_stage ="<div class='stage_title_num' style='background:"+color[i]+"'>"+(i+1)+"</div><ul class='stage_title_txt'>"+stage_list[i]+"</ul><ul class='clr'></ul>"+each_stage;
					all+=each_stage;
				}
				$('#sidebar_main_lay').html(all);
				func();
}

//侧边栏的功能
var jd = true;
function func(){
	$(document).click(function(){
		$('.cancel_two_task').hide();
		$('.cancel_task').hide();
		$('.ok_task').hide();
		$('.sel_box').css({'border-radius':'5px','box-shadow':'none'});
	});
	$(document).on('click','.sidebar_down',function(e){
		if(jd == true){
			e.stopPropagation();
		e.preventDefault();
		var $this = $(this);
		console.log($this.next().css('display'));
		if($this.next().css('display') == 'list-item'){
			$this.next().hide();
			$this.next().next().hide();
			$this.parent().css({'border-radius':'5px','box-shadow':'none'});
		}
		else{
			$this.next().show();
		if(	$this.next().next()){
				$this.next().next().show();	
		}
		$this.parent().css({'border-radius':'5px 5px 0 0','box-shadow':'1px 0 6px #9E9A9A,-1px 0 6px #9E9A9A,0 -1px 6px #9E9A9A,0 -1px 1px #fff'});
		}
		
		jd = false;
		setTimeout(function(){
			jd = true;
		},200);
		}
	});
}
//甘特图时间的显示
function Gan_Time(Data,Array){
	var yearMonth = [];
 		year_str = '';
 		date_len = Math.ceil((DateDiff(Data['projectInfo']['task'][0]['taskBegin'].substring(0,10),Data['projectInfo']['task'][Data['projectInfo']['task'].length-1]['taskEnd'].substring(0,10))))+1;
 		yearMonth.push(Data['projectInfo']['task'][0]['taskBegin'].substring(0,7));
 		now_month = Data['projectInfo']['task'][0]['taskBegin'].substring(0,7);
 	//任务年月的储存
 	for(var i=0,len = Data['projectInfo']['task'].length;i<len;i++){
 		if(i>0 && Data['projectInfo']['task'][i]['taskBegin'].substring(0,7) !=now_month){
 			yearMonth.push(Data['projectInfo']['task'][i]['taskBegin'].substring(0,7));
 			now_month = Data['projectInfo']['task'][i]['taskBegin'].substring(0,7);
 		}
 		if(i==len-1){
 			if(yearMonth[yearMonth.length-1] != Data['projectInfo']['task'][i]['taskEnd'].substring(0,7)){
 				yearMonth.push(Data['projectInfo']['task'][i]['taskEnd'].substring(0,7));
 				console.log(true);
 			}
 		}
 	}

 	//二月份的判断以及各月的赋值
 	if(IsRunYear(yearMonth[0].substring(0,4))){
 		var MonthList = [31,29,31,30,31,30,31,31,30,31,30,31];
 	}
 	else{
 		var MonthList = [31,28,31,30,31,30,31,31,30,31,30,31];
 	}

 	//具体时间的显示
 	var date_all_str = '';
 		months_len =[];
 		begin = Data['projectInfo']['task'][0]['taskBegin'].substring(8,10)>10?Data['projectInfo']['task'][0]['taskBegin'].substring(8,10):Data['projectInfo']['task'][0]['taskBegin'].substring(9,10);
 		end = Data['projectInfo']['task'][Data['projectInfo']['task'].length-1]['taskEnd'].substring(8,10);
 	for(var i=0,len=yearMonth.length;i<len;i++){
 		var months = Number(yearMonth[i].substring(5,7));
 		if(i==0){
 			if(i == len-1){
 				for(var j=begin;j<=end;j++){
 					date_all_str+="<div class='task_all_style'>"+j+"</div>";
 					if(j==end){
 						months_len.push(j-begin+1);	
 					}
 				}	     
 			}
 			else{
 				for(var j=begin;j<=MonthList[months-1];j++){
 				date_all_str+="<div class='task_all_style'>"+j+"</div>";
 				if(j==MonthList[months-1]){
 					months_len.push(j-begin+1);	
 				}
 			}
 			}
 		}
 		else if(i==len-1){
 			for(var z=1;z<=end;z++){
 				date_all_str+="<div class='task_all_style'>"+z+"</div>";
 				if(z==end){
 					months_len.push(z);
 				}
 			}
		}
 		else{
 			for(var k=1;k<=MonthList[months-1];k++){
 				date_all_str+="<div class='task_all_style'>"+k+"</div>";
 				if(k==MonthList[months-1]){
 					months_len.push(k);
 				}
 			}
 		}
 	}

 	//任务年月的显示
 	var hole_yearmonth = '';
 	// console.log(months_len);
 	for(var i=0,len=months_len.length;i<len;i++){
 		hole_yearmonth+="<div class='yearmonth' style=width:"+(months_len[i]*26-1)+"px>"+yearMonth[i]+"</div>";
 	}
 	// console.log(hole_yearmonth);
 	$('.task_time').html(hole_yearmonth);
 	//任务具体日期的显示
 	$('.task_time_detail').html(date_all_str);
 	$('#main_task_content_lay').css('width',date_len*26+5+"px");

 	return date_len;
}
//甘特图内容的显示
function Show_Gan(Data,Arr,TimeLen){


	var asi = "<div class='asi'></div>";
	for(var z=0;z<TimeLen-1;z++){
		asi+= "<div class='asi'></div>";
	}
	var BeginTime = Data['projectInfo']['task'][0]['taskBegin'];
		hold_str = '';
		for(var i=0,len= Data['projectInfo']['task'].length,j=0,z=0,k=0;i<len;i++,k++){
			if($.browser.msie) { 
				var left_len = 26;
			} else if($.browser.safari) { 
				var left_len = 26;
			} else if($.browser.mozilla) { 
				var left_len = 25.8; 
			} else if($.browser.opera) { 
				var left_len = 26;
			} 
			var margin_left = (DateDiff(Data['projectInfo']['task'][0]['taskBegin'].substring(0,10),Data['projectInfo']['task'][i]['taskBegin'].substring(0,10)))*left_len;
				task_len = (DateDiff(Data['projectInfo']['task'][i]['taskBegin'].substring(0,10),Data['projectInfo']['task'][i]['taskEnd'].substring(0,10))+1)*26;
				date_len=	DateDiff(Data['projectInfo']['task'][i]['taskBegin'].substring(0,10),Data['projectInfo']['task'][i]['taskEnd'].substring(0,10));
				name = Data['projectInfo']['task'][i]['userName'] == null?'':Data['projectInfo']['task'][i]['userName'];
				if(Data['projectInfo']['task'][i]['status'] == 1){
					hold_str += "<div class='line'>"+asi+"<div class='task_finish' style='left:"+margin_left+"px;width:"+task_len+"px; top:"+-k+"px'>"+name+'&nbsp;'+Number(date_len+1)+"天</div></div>";
				}
				else{
					hold_str += "<div class='line'>"+asi+"<div class='task' style='left:"+margin_left+"px;width:"+task_len+"px; top:"+-k+"px'>"+name+'&nbsp;'+Number(date_len+1)+"天</div></div>";
				}
				//甘特图阶段间距
				if(j == Arr[z].length-1 &&z != Arr.length-1){
					hold_str+=	"<div class='space_line'>"+asi+"</div><div class='space_line'>"+asi+"</div>";
					j=0;
					z++;
					k=-1;
				}
				else{
					j++;
				}
		}

		$('.task_line_box').html(hold_str);

}

 //是否平年的判断
 function IsRunYear(year)
 {
    return(0 == year%4 && (year%100 !=0 || year%400 == 0));
 }

//甘特图任务省略内容的显示
function Show_Task(){
	$(document).on('mouseover','.task,.task_finish',function(e){
			var top_title = "<div id='top_title'>"+$(this).html()+"</div>";
			$('body').append(top_title);
			$('#top_title').css({'top':(e.pageY-40)+'px','left':(e.pageX-60)+'px'}).show();
	});

	$(document).on('mouseout','.task,.task_finish',function(){
		$('#top_title').remove();
	});
	$(document).on('mouseover','.yearmonth',function(e){
		if($(this).html().length*8.5>$(this).css('width').substring(0,$(this).css('width').length-2)){
			var top_title = "<div id='top_title'>"+$(this).html()+"</div>";
			$('body').append(top_title);
			$('#top_title').css({'top':(e.pageY-40)+'px','left':(e.pageX-60)+'px'}).show();
		}
	});

	$(document).on('mouseout','.yearmonth',function(){
		$('#top_title').remove();
	});
}


 	//甘特图内部div的移动
	var main_width = document.getElementById('main_task_content').offsetWidth;
	lay_width = document.getElementById('main_task_content_lay').offsetWidth;
     main_height = document.getElementById('main_task_content').offsetHeight;
    lay_height = document.getElementById('main_task_content_lay').offsetHeight;
	cha = lay_width-main_width;

	function small_down(e){
		var obig=document.getElementById("main_task_content");
		var osmall=document.getElementById("main_task_content_lay");
		var e=e||window.event;

		document.onmousemove=small_move;
		document.onmouseup=small_up;



        osmall.startX=e.clientX-osmall.offsetLeft;
		osmall.startY=e.clientY-osmall.offsetTop;
	}
	function small_move(e){
		var obig=document.getElementById("main_task_content");
		var osmall=document.getElementById("main_task_content_lay");
		var e=e||window.event;

        if(lay_width>=main_width){
            osmall.style.left=e.clientX-osmall.startX+"px";
        }
        if(lay_height>=main_height){
          osmall.style.top=e.clientY-osmall.startY+"px";  
        }

		

		if(e.clientX-osmall.startX>=0){ osmall.style.left=0+"px";}
		if(e.clientY-osmall.startY>=0){ osmall.style.top=0+"px";}
		if(e.clientX-osmall.startX<=cha){ osmall.style.left=cha+"px";}
		if(e.clientY-osmall.startY<=cha){ osmall.style.top=cha+"px";}
	}
	function small_up(){
		document.onmousemove="";
		document.onmouseup="";
	}

	
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
