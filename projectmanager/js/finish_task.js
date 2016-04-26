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
    $('.set_task_btn').on('click',function(){
    	location.href =encodeURI("../projectmanager/mission_edit.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
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

     //项目是否完成的判断
      var bool = true;
      $.ajax({
		url:'index.php/web/Project/getProjectList',
		type:'POST',
		async:false,
		data:{'userToken':userToken},
		success:function(data){
			var Data = JSON.parse(data);
    		for(var i=0;i<Data['partProject'].length;i++){
    			if(id == Data['partProject'][i]['projectId']){
    				if(Data['partProject'][i]['status'] == 1){
    					bool = false;
    				}
    			}
    		}
	
		}
	});

    var stage_list = [];
    data_do();
	function data_do(){
		$.ajax({
		url:'index.php/web/Project/getProjectInfoByTime',
		type:'POST',
		data:{'projectId':id,'userToken':userToken},
		success:function(data){
			var Data =JSON.parse(data);
			var num =[];
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
				var all='';
				var each_stage= '';
					mask = '';
					// for(var i= 0;i<each_task.length;i++){
					// each_stage='';
					// for(var j =0;j<each_task[i].length;j++){
					// 	if(j+1!=each_task[i].length){
					// 		if(each_task[i][j]['taskId'] == each_task[i][j+1]['taskId']){
					// 		each_task[i][j+1]['userId']=each_task[i][j+1]['userId']+','+each_task[i][j]['userId'];
					// 		each_task[i][j+1]['userName']=each_task[i][j+1]['userName']+' '+each_task[i][j]['userName'];
					// 		mask = each_task[i][j]['taskId'];
					// 		continue;
					// 	    }
					// 	    if(mask == each_task[i][j+1]['taskId']){
					// 		each_task[i][j+1]['userId']=each_task[i][j+1]['userId']+','+each_task[i][j]['userId'];
					// 		each_task[i][j+1]['userName']=each_task[i][j+1]['userName']+' '+each_task[i][j]['userName'];
					// 		continue;
					// 	    }
					// 	}
					// }
				// }
				//侧边栏项目的显示
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
						if(bool == true){
							if(judge == true){
							if(each_task[i][j]['status'] == 0){
								each_stage+="<li class='each_list'><div class='sidebar_task_name'>"+each_task[i][j]['taskName']+"</div><div class='finish_task finish_task_style' style='color:"+color[i]+"' data-taskId ='"+each_task[i][j]['taskId']+"'><input type='checkbox' class='finish' style='float: left;''><div class='fi_txt' style ='float: left;'>完成</div></div></li>";
							}
							else if(each_task[i][j]['status'] == 1){
								each_stage+="<li class='each_list'><div class='sidebar_task_name'>"+each_task[i][j]['taskName']+"</div><div class='finish_task finish_task_style' style='color:"+color[i]+"' data-taskId ='"+each_task[i][j]['taskId']+"'><input type='checkbox' class='finish' style='float: left; display:none''><div class='fi_txt' style ='float: left;margin-left:26px;'>完成</div></div></li>";
							}
						}
						else{
							each_stage+="<li class='each_list'><div class='sidebar_task_name'>"+each_task[i][j]['taskName']+"</div><div class='finish_task finish_task_style' style='color:"+color[i]+"' data-taskId ='"+each_task[i][j]['taskId']+"'></div></li>";
							}
						}
						else{
							each_stage+="<li class='each_list'><div class='sidebar_task_name'>"+each_task[i][j]['taskName']+"</div><div class='finish_task finish_task_style' style='color:"+color[i]+"' data-taskId ='"+each_task[i][j]['taskId']+"'></div></li>";
							}
					}
					each_stage=	"<ul class='stage_one_content'>"+each_stage+"</ul><ul class='clr'></ul>";
					each_stage ="<div class='stage_title_num' style='background:"+color[i]+"'>"+(i+1)+"</div><ul class='stage_title_txt'>"+stage_list[i]+"</ul><ul class='clr'></ul>"+each_stage;
					all+=each_stage;
				}
				$('#sidebar_main_lay').html(all);
				//相同taskid的任务的重合
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
					var data_else = Data;
					//甘特图时间的显示
					var Time_len = Gan_Time(Data,each_task);

					//甘特图内容的显示
					Show_Gan(Data,each_task,Time_len);

					//甘特图任务省略内容的显示
					Show_Task();

				
				// console.log(Data);
				// //甘特图的时间的显示
				// var task_time='';
				// 		all_width=0;
				// 		each_width=[];
				// for(var i =0,len =Data['projectInfo']['task'].length ;i<len;i++){
				// 	//每个任务时间框长度的计算
				// 	var arr=[];
				// 	if(String(Data['projectInfo']['task'][i]['userId']).indexOf(',')>0){
				// 		arr = Data['projectInfo']['task'][i]['userId'].split(',');
				// 	}
				// 	if(arr.length>2){
				// 		var width = Number(arr.length*55);
				// 	}
				// 	else{var width = 120;}
				// 	each_width.push(width);
				// 	all_width+=width;
				// 	//任务时间的的写入
				// 	if(i==len-1&&i!=0 && Data['projectInfo']['task'][i]['taskBegin'].substring(0,4)==Data['projectInfo']['task'][0]['taskBegin'].substring(0,4)){
				// 		task_time+="<dt style='width:"+width+"px'><div>"+Data['projectInfo']['task'][i]['taskBegin'].substring(5,10)+"</div><div>"+Data['projectInfo']['task'][i]['taskEnd'].substring(5,10)+"</div></dt>";
				
				// 	}
				// 	else if(i>=1 &&i!=len-1 && Data['projectInfo']['task'][i]['taskBegin'].substring(0,4)==Data['projectInfo']['task'][0]['taskBegin'].substring(0,4)){
				// 		task_time+="<dt style='width:"+width+"px'>"+Data['projectInfo']['task'][i]['taskBegin'].substring(5,10)+"</dt>";
				// 		}
				// 	else if(i==len-1&&i==0 && Data['projectInfo']['task'][i]['taskBegin'].substring(0,4)==Data['projectInfo']['task'][0]['taskEnd'].substring(0,4)){
				// 		task_time+="<dt style='width:"+width+"px'><div>"+Data['projectInfo']['task'][i]['taskBegin'].substring(0,10)+"</div><div>"+Data['projectInfo']['task'][i]['taskEnd'].substring(5,10)+"</div></dt>";
				// 	}
				// 	else{task_time+="<dt style='width:"+width+"px's>"+Data['projectInfo']['task'][i]['taskBegin'].substring(0,10)+"</dt>";}
				// }
				// $(".task_time").html(task_time);
				// $("#main_task_content_lay").css('width',all_width+'px');


				// //甘特图内容的显示
				// //甘特图内容的显示
				// var time_task='',
				// 	all_time_task='';
				// for(var i =0,z=0;i<Data['projectInfo']['task'].length;i++,z++){
				// 	for(var j =0;j<Data['projectInfo']['task'].length;j++){
				// 		if(i==j){
				// 			var begin_lay  =Data['projectInfo']['task'][i]['taskBegin'];
				// 				end_lay = Data['projectInfo']['task'][i]['taskEnd'];
				// 				begin = begin_lay.substring(0,10);
				// 				end = end_lay.substring(0,10);
				// 			 var date = DateDiff(begin,end);
				// 			 	if(Data['projectInfo']['task'][i]['userName']==null){
				// 			 		time_task+="<dt style=width:"+each_width[j]+"px;background:"+color_two[Data['projectInfo']['task'][i]['status']]+">"+Number(date+1)+"天</dt>";
				// 			 	}
				// 				else{time_task+="<dt style=width:"+each_width[j]+"px;background:"+color_two[Data['projectInfo']['task'][i]['status']]+">"+Data['projectInfo']['task'][i]['userName']+'&nbsp;'+Number(date+1)+"天</dt>";}
				// 		}
				// 		else{
				// 			time_task+="<dt style=width:"+each_width[j]+"px></dt>";
				// 		}
	
				// 	}
				// 	box_width =Number(all_width)+Number(Data['projectInfo']['task'].length);
				// 	if(Number(all_width)+Number(Data['projectInfo']['task'].length)<670){
				// 		box_width=670;
				// 	}
				// 	if(i<=Data['projectInfo']['task'].length-2){
				// 		if(Data['projectInfo']['task'][i]['stageName']!=Data['projectInfo']['task'][i+1]['stageName']){
				// 		time_task="<dl class='task_line' style=width:"+box_width+"px;>"+time_task+"</dl><dl class='task_line' style=width:"+box_width+"px;border-bottom:1px solid #DDD;height:26px;></dl><dl class='task_line' style='width:"+box_width+"px;border-bottom:1px solid #DDD;height:16px;'></dl>";
				// 		}
				// 		else{time_task="<dl class='task_line' style=width:"+box_width+"px;>"+time_task+"</dl>";
				// 		}
				// 	}
				// 	else{time_task="<dl class='task_line' style=width:"+box_width+"px;>"+time_task+"</dl>";
				// 		}
				// 	all_time_task+=time_task;
				// 	time_task='';
				// }

				// $(".task_line_box").css('width',box_width+'px');
				// $('.task_line_box').html(all_time_task);
				// console.log(each_task);
			}	
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

			var margin_left = (DateDiff(Data['projectInfo']['task'][0]['taskBegin'].substring(0,10),Data['projectInfo']['task'][i]['taskBegin'].substring(0,10)))*26;
				task_len = (DateDiff(Data['projectInfo']['task'][i]['taskBegin'].substring(0,10),Data['projectInfo']['task'][i]['taskEnd'].substring(0,10))+1)*26;
				date_len=	DateDiff(Data['projectInfo']['task'][i]['taskBegin'].substring(0,10),Data['projectInfo']['task'][i]['taskEnd'].substring(0,10));
				if(Data['projectInfo']['task'][i]['status'] == 1){
					hold_str += "<div class='line'>"+asi+"<div class='task_finish' style='left:"+margin_left+"px;width:"+task_len+"px; top:"+-k+"px'>"+Data['projectInfo']['task'][i]['userName']+'&nbsp;'+Number(date_len+1)+"天</div></div>";
				}
				else{
					hold_str += "<div class='line'>"+asi+"<div class='task' style='left:"+margin_left+"px;width:"+task_len+"px; top:"+-k+"px'>"+Data['projectInfo']['task'][i]['userName']+'&nbsp;'+Number(date_len+1)+"天</div></div>";
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
		if($(this).html().length*8.5>$(this).css('width').substring(0,$(this).css('width').length-2)){
			var top_title = "<div id='top_title'>"+$(this).html()+"</div>";
			$('body').append(top_title);
			$('#top_title').css({'top':(e.pageY-40)+'px','left':(e.pageX-93)+'px'}).show();
		}
	});

	$(document).on('mouseout','.task,.task_finish',function(){
		$('#top_title').remove();
	});
}


	
	$('.finish_task_btn').on('click',function(){
		$.ajax({
			url:'index.php/web/Project/finishProject',
			type:'POST',
			data:{'projectId':id},
			success:function(data){
				var Data = JSON.parse(data);
			}
		});
	});
	$(document).on('click','.finish',function(){
		var taskId = $(this).parent().data('taskid');
		if($(this).is(':checked')){
			$(this).next().css('margin-left','26px')
			$(this).hide();
			$.ajax({
				url:'index.php/web/Task/finishTask',
				type:'POST',
				data:{'taskId':taskId,'userToken':userToken},
				success:function(data){
					var Data = JSON.parse(data);
					if(Data['statusCode'] == 000000){
						data_do();
					}
				}
			});
		}

	});
	$(document).on('click','.fi_txt',function(){
		var taskId = $(this).parent().data('taskid');
			$this = $(this);
		if($(this).html() == '取消完成'){
			$.ajax({
				url:'index.php/web/Task/cancelFinishTask',
				type:'POST',
				data:{'taskId':taskId,'userToken':userToken},
				success:function(data){
					var Data = JSON.parse(data);
					if(Data['statusCode'] == 000000){
						$this.parent().html("<input type='checkbox' class='finish' style='float: left;''><div class='fi_txt' style ='float: left;'>完成</div></div></li>");	
						data_do();
					}
				}
			});	
		}
		else if($(this).html() == '完成'){
		var taskId = $(this).parent().data('taskid');
		console.log(true);
			$(this).css('margin-left','26px')
			$(this).prev().hide();
			$.ajax({
				url:'index.php/web/Task/finishTask',
				type:'POST',
				data:{'taskId':taskId,'userToken':userToken},
				success:function(data){
					var Data = JSON.parse(data);
					if(Data['statusCode'] == 000000){
						data_do();
					}
				}
			});
		}
	});

	$(document).on('mouseover','.finish_task_style',function(){
		if($(this).children('input').css('display') == 'none' && $(this).children('div').html() =='完成'){
			 $(this).children('div').css('margin-left','0px');
			$(this).children('div').html('取消完成');
			$(this).children('div').css('text-decoration','underline');
		}
	});
	$(document).on('mouseout','.finish_task_style',function(){
		if($(this).children('input').css('display') == 'none'){
			$(this).children('div').css('margin-left','26px');
			$(this).children('div').css('text-decoration','none');
			$(this).children('div').html('完成');
		}
	});
});
  //计算天数差的函数，通用  
   function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2006-12-18格式  
       var  aDate,  oDate1,  oDate2,  iDays  
       aDate  =  sDate1.split("-")  
       oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]) //转换为12-18-2006格式  
       aDate  =  sDate2.split("-")  
       oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  
       iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24) //把相差的毫秒数转换为天数  
       return  iDays  
   }   