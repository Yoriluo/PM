$(function(){

		all ='';
	var url =decodeURI( window.location.href),
      param = url.substring(url.indexOf('?')+1,url.length),
      info = param.split('&');
      userToken = info[0].substring(10,info[0].length);
      userId = info[1].substring(7,info[1].length);
      userName = info[2].substring(9,info[2].length);
      $('.user_name').html(userName);
      $.ajax({
           		url:'index.php/web/News/getNewsList',
				type:'POST',
				data:{'userToken':userToken},
				success:function(data){
					var Data = JSON.parse(data);
					for(var i=0;i<Data['newsList'].length;i++){

					}
				}
			});
	// $.ajax({
	// 	url:'index.php/web/News/getNewsList',
	// 	type:'POST',
	// 	data:{'userToken':userToken},
	// 	success:function(data){
	// 		var Data = JSON.parse(data);
            

	// 	}
	// });
	//展示页面所有信息
	function showNews(Data_lay,page){
		var str='';	
			end = (page*5)>Data_lay['newsList'].length?Data_lay['newsList'].length:(page*5);
			if(end!=0){}
        for(var i =((page-1)*5);i<end;i++){
        	if(Data_lay['newsList'][i]['flag']==0){
        		str+="<li class='news_line'>"+
            		"<p class='main_content'>"+Data_lay['newsList'][i]['content']+"</p>"+
            		"<div class='main_time'>"+Data_lay['newsList'][i]['createTime'].substring(0,10)+"</div>"+
            		"<div class='main_operate'>"+
            			"<div class='agree' data-newsid='"+Data_lay['newsList'][i]['newsId']+"'data-proid='"+Data_lay['newsList'][i]['projectId']+"'data-proname='"+Data_lay['newsList'][i]['projectName']+"'data-proposerId='"+Data_lay['newsList'][i]['proposerId']+"'>同意</div>"+
            			"<div class='disagree'data-newsid='"+Data_lay['newsList'][i]['newsId']+"'data-proid='"+Data_lay['newsList'][i]['projectId']+"'data-proname='"+Data_lay['newsList'][i]['projectName']+"'data-proposerId='"+Data_lay['newsList'][i]['proposerId']+"'>不同意</div>"+
            		"</div>"+
            		"<div class='clr'></div>"+
            	"</li>";
        	}
        	else if(Data_lay['newsList'][i]['flag']==1){
        		str+="<li class='news_line'>"+
            		"<p class='main_content'>"+Data_lay['newsList'][i]['content']+"</p>"+
            		"<div class='main_time'>"+Data_lay['newsList'][i]['createTime'].substring(0,10)+"</div>"+
            		"<div class='main_operate'>"+
            			"<div class='has_agree'>已同意</div>"+
            		"</div>"+
            		"<div class='clr'></div>"+
            	"</li>";
        	}
        	else if(Data_lay['newsList'][i]['flag']==2){
        		str+="<li class='news_line'>"+
            		"<p class='main_content'>"+Data_lay['newsList'][i]['content']+"</p>"+
            		"<div class='main_time'>"+Data_lay['newsList'][i]['createTime'].substring(0,10)+"</div>"+
            		"<div class='main_operate'>"+
            			"<div class='has_disagree'>已拒绝</div>"+
            		"</div>"+
            		"<div class='clr'></div>"+
            	"</li>";
        	}  
        	else if(Data_lay['newsList'][i]['flag']==3){
        		str+="<li class='news_line'>"+
            		"<p class='main_content'>"+Data_lay['newsList'][i]['content']+"</p>"+
            		"<div class='main_time'>"+Data_lay['newsList'][i]['createTime'].substring(0,10)+"</div>"+
            		"<div class='clr'></div>"+
            	"</li>";
        	}  
        }
        $('.news_main').html(str);
	}
	//展示页数
	function showPage(page){
           	$.ajax({
           		url:'index.php/web/News/getNewsList',
				type:'POST',
				data:{'userToken':userToken},
				success:function(data){
					var str='';
						Data = JSON.parse(data);
						if(Data['newsList']){
							all=page_all = Math.ceil(Data['newsList'].length/5);
						showNews(Data,1)
						if(page_all>=2){
							if(page_all>5){
								for(var i=1;i<=5;i++){
								if(i==1){
									str+="<div class='page_num active flag'>"+i+"</div>";
								}
								else if(i==5){
									str+="<div class='page_num'>"+i+"</div>";
								}
								else{str+="<div class='page_num'>"+i+"</div>";}
								}
							}
							else if(page_all>=2&&page_all<=4){
								all_page=page_all;
								for(var i=1;i<=all_page;i++){
								if(i==1){
									str+="<div class='page_num active'>"+i+"</div>";
								}
								else{str+="<div class='page_num'>"+i+"</div>";}
							}
							}
							str="<div class='last_page'><</div>"+str+"<div class='next_page'>></div>";
						}
						$('.footer_lay').html(str);
						//页数分页
						$('.next_page').on('click',function(){
							if($('.active').html()!=page_all){
								var page = Number($('.active').html())+1;
								showNews(Data,page);
								if($('.active').html()<3||$('.active').html()>=(page_all-2)){
								var num =$('.active').index();
								$('.active').removeClass('active');
								$('.page_num').eq(num).addClass('active');
							}
							else{
								var act_num = Number($('.active').html());
								$('.active').html(act_num+1);
								$('.active').prev().html(act_num);
								$('.active').prev().prev().html(act_num-1);
								$('.active').next().html(act_num+2);
								$('.active').next().next().html(act_num+3);
							}
							}
						});
						$('.last_page').on('click',function(){
							if($('.active').html()!=1){
								var page = Number($('.active').html())-1;
								showNews(Data,page);
								if($('.active').html()<4||$('.active').html()>=(page_all-1)){
								var num =$('.active').index();
								$('.active').removeClass('active');
								$('.page_num').eq(num-2).addClass('active');
							}
							else{
								var act_num = Number($('.active').html());
								$('.active').html(act_num-1);
								$('.active').prev().html(act_num-2);
								$('.active').prev().prev().html(act_num-3);
								$('.active').next().html(act_num);
								$('.active').next().next().html(act_num+1);
							}
							}
						});
						}
						
   				}
   					//点击页数
					
           	});
	}
	showPage(1);
		$('.footer_lay').on('click','.page_num',function(){
			var index = Number($(this).index());
				html =Number( $(this).html());
				if(index==1 || index == 5){
							if(html>2 && html<=all-2){
					
								$('.page_num').eq(2).html($(this).html());
								$('.page_num').eq(1).html(Number(html)-1);
								$('.page_num').eq(0).html(Number(html)-2);
								$('.page_num').eq(3).html(Number(html)+1);
								$('.page_num').eq(4).html(Number(html)+2);
								$('.page_num').removeClass('active');
								$('.page_num').eq(2).addClass('active');
							}
							if( html==all-1){
			
								$('.page_num').eq(2).html($(this).html()-1);
								$('.page_num').eq(1).html(Number(html)-2);
								$('.page_num').eq(0).html(Number(html)-3);
								$('.page_num').eq(3).html(Number(html));
								$('.page_num').eq(4).html(Number(html)+1);
							}
							if( html==2){
					
								$('.page_num').eq(2).html(html+1);
								$('.page_num').eq(1).html(Number(html));
								$('.page_num').eq(0).html(Number(html)-1);
								$('.page_num').eq(3).html(Number(html)+2);
								$('.page_num').eq(4).html(Number(html)+3);
							}
							if(html==all||html==1){
								$('.page_num').removeClass('active');
								$(this).addClass('active');
							}
						}
				else if(index ==2 || index == 4){
					
					if(html>2 && html<=all-2){
						$('.page_num').eq(2).html(html);
						$('.page_num').eq(1).html(Number(html)-1);
						$('.page_num').eq(0).html(Number(html)-2);
						$('.page_num').eq(3).html(Number(html)+1);
						$('.page_num').eq(4).html(Number(html)+2);
						$('.page_num').removeClass('active');
						$('.page_num').eq(2).addClass('active');
					}
					else if(html==2||html ==all-1){
						$('.page_num').removeClass('active');
						$(this).addClass('active');	
						}
					}
					else{
						$('.page_num').removeClass('active');
						$(this).addClass('active');	
					}
							
				 	$.ajax({
           		url:'index.php/web/News/getNewsList',
				type:'POST',
				data:{'userToken':userToken},
				success:function(data){
					var Data = JSON.parse(data);
						act = Number($('.active').html());
						showNews(Data,act);
					}
				});			
		});


	//消息操作
	$('.news_main').on('click','.agree',function(){
		var newsid = $(this).data('newsid'),
			projectid = $(this).data('proid'),
			projectname = $(this).data('proname'),
			proposerId = $(this).data('proposerid');
			judge = true;
		$.ajax({
			url:'index.php/web/News/updateNews',
			type:'POST',
			async : false,
			data:{'newsId':newsid,'flag':1,'projectId':projectid,'projectName':projectname,'proposerId':proposerId,'userToken':userToken},
			success:function(data){
				var Data = JSON.parse(data);
				if(Data['statusCode']==000000){
					judge = false;
				}
			}
		});
		if(!judge){
			var str ="<div class='has_agree'>已同意</div>";
			$(this).parent().html(str);
		}
	});

	$('.news_main').on('click','.disagree',function(){
			judge = true;
		var newsid = $(this).data('newsid'),
			projectid = $(this).data('proid'),
			projectname = $(this).data('proname'),
			proposerId = $(this).data('proposerid');

		$.ajax({
			url:'index.php/web/News/updateNews',
			type:'POST',
			async : false,
			data:{'newsId':newsid,'flag':2,'projectId':projectid,'projectName':projectname,'proposerId':proposerId,'userToken':userToken},
			success:function(data){
				var Data = JSON.parse(data);
				if(Data['statusCode']==000000){
					judge = false;
				}
			}
		});
		if(!judge){
			var str ="<div class='has_disagree'>已拒绝</div>";
					$(this).parent().html(str);
		}
	});


	var index = $(".index");
		join = $('.join_task');
		change_pas = $('.change_pas');
		exit = $('.exit');
		set =$('.set_task'),
	index.on('click',function(){
		location.href =encodeURI("../projectmanager/index.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	join.on('click',function(){
		location.href = encodeURI("../projectmanager/join_project.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	change_pas.on('click',function(){
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
	set.on('click',function(){
		location.href = encodeURI("../projectmanager/set_project.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});



})