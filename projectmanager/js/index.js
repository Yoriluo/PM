$(function(){
    var url =decodeURI( window.location.href),
      param = url.substring(url.indexOf('?')+1,url.length),
      info = param.split('&');
      userToken = info[0].substring(10,info[0].length);
      userId = info[1].substring(7,info[1].length);
      userName = info[2].substring(9,info[2].length);
    	set =$('.set_task'),
		join = $('.join_task'),
		change_pas = $('.change_pas'),
		exit = $('.exit'),
		join_pro = $('.subnav_join_task'),
		news = $('.news');
    height = $(document).height();
    $('.body').css('height',height);
          $.ajax({
    url:'index.php/web/Project/getProjectInfo',
    type:'POST',
    data:{'projectId':11,'userToken':userToken},
    success:function(data){
        var Data = JSON.parse(data);
    }
  });
  $('.user_name').html(userName);
	$(".subnav_set_task").on('click',function(){
		location.href =location.href = encodeURI("../projectmanager/set_project.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	set.on('click',function(){
		location.href = encodeURI("../projectmanager/set_project.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
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
  join_pro.on('click',function(){
      var alpCode = $('.subnav_invite_code').val();
      console.log(alpCode)
      if(!alpCode){
        swal({
        title:'请输入邀请码！',
        timer:1000,
        showConfirmButton:false 
      });
      return false;
      }
      $.ajax({
        url:'index.php/web/Project/joinProject',
        type:'POST',
        data:{'inviteNumber': alpCode,'userToken':userToken},
        success:function(data){
          var Data = JSON.parse(data);
          if(Data['statusCode'] == 000000){
            swal({
              title:'申请加入项目成功！',
              timer:1000,
              showConfirmButton:false 
            });
            $('.subnav_invite_code').val('');
          }
          else{
            swal({
              title:'申请加入项目失败！',
              timer:1000,
              showConfirmButton:false 
            });
          }
        }
      });
    });

	news.on('click',function(){
		location.href = encodeURI("../projectmanager/news.html?userToken="+userToken+"&userId="+userId+"&userName="+userName);
	});
	//创建的项目
	$.ajax({
		url:'index.php/web/Project/getProjectList',
		type:'POST',
		data:{'userToken':userToken},
		success:function(data){
			var Data = JSON.parse(data);
      console.log(Data);
      if(Data['statusCode']==000000){
        var setlist =[],
        joinlist=[],
        color={
          1:'images/line_one.png',
          2:'images/line_two.png',
          3:'images/line_three.png',
          0:'images/line_four.png'
        }

        var arr_one = [],
            arr_two =  [],
            arr_third = [],
            arr_four = [];
        for(var i=0,len = Data['myProject'].length;i<len;i++){
          if(Data['myProject'][i]['status'] == 0){
            arr_one.push(Data['myProject'][i]);
         
            }
          else if(Data['myProject'][i]['status'] == 1){
            arr_two.push(Data['myProject'][i]);
          }
        }
         for(var i=0,len = Data['partProject'].length;i<len;i++){
          if(Data['partProject'][i]['status'] == 0){
            arr_third.push(Data['partProject'][i]);
         
            }
          else if(Data['partProject'][i]['status'] == 1){
            arr_four.push(Data['partProject'][i]);
          }
        }

        setlist=$.merge(arr_one.reverse(),arr_two.reverse());
        joinlist=$.merge(arr_third.reverse(),arr_four.reverse());
        
    var each = 
            all='';
            join_str='';
            some='';
            m=4;
            if(setlist.length>0){
              if(setlist.length<=m){
              var  line='';
              m=setlist.length; 
            for(var i=1;i<=m;i++){
              if(setlist[i-1]['status']==1){
                line+="<div class='each_task uk-float-left' data-id="+setlist[i-1]['projectId']+">"+
                "<div class='each_task_left_one'>"+
                  "<p class='each_task_name'>"+setlist[i-1]['projectName']+"</p>"+
                  "<div class='each_task_time'><div style='width:100%'>创建于</div>"+setlist[i-1]['createTime'].substring(0,10)+"</div>"+
                "</div>"+
                            "<div class='each_task_right' style='background:url("+color[i%4]+"); background-size:110px 120px'></div></div>";
              }
              else{
                line+="<div class='each_task uk-float-left' data-id="+setlist[i-1]['projectId']+">"+
                "<div class='each_task_left_one'>"+
                  "<p class='each_task_name'>"+setlist[i-1]['projectName']+"</p>"+
                  "<div class='each_task_time'><div style='width:100%'>创建于</div>"+setlist[i-1]['createTime'].substring(0,10)+"</div>"+
                "</div>"+
                            "<div class='each_task_right'></div></div>";
              }
              }
              all="<div class='all_task_detail_line'>"+line+"</div>";
            }
            //大于四个项目
            if(setlist.length>m){
              var  line='';
              for(var i=m-3,j=0;i<=m;i++,j++){
                if(setlist[i-1]['status']==1){
                line+="<div class='each_task uk-float-left' data-id="+setlist[i-1]['projectId']+">"+
                "<div class='each_task_left_one'>"+
                  "<p class='each_task_name'>"+setlist[i-1]['projectName']+"</p>"+
                   "<div class='each_task_time'><div style='width:100%'>创建于</div>"+setlist[i-1]['createTime'].substring(0,10)+"</div>"+
                "</div>"+
                            "<div class='each_task_right' style='background:url("+color[i%4]+"); background-size:110px 120px'></div></div>";
                }
                  else{
                    line+="<div class='each_task uk-float-left' data-id="+setlist[i-1]['projectId']+">"+
                    "<div class='each_task_left_one'>"+
                      "<p class='each_task_name'>"+setlist[i-1]['projectName']+"</p>"+
                      "<div class='each_task_time'><div style='width:100%'>创建于</div>"+setlist[i-1]['createTime'].substring(0,10)+"</div>"+
                    "</div>"+
                               "<div class='each_task_right'></div></div>";
                  }
                  if(!(i%4)){
                    some+="<div class='all_task_detail_line'>"+line+"</div>";
                    m+=4; 
                    line='';
                        if(setlist.length<=m){
                          var  line='';
                          m=m-3;  
                        for(var i=m;i<=setlist.length;i++){
                          if(setlist[i-1]['status']==1){
                            line+="<div class='each_task uk-float-left' data-id="+setlist[i-1]['projectId']+">"+
                            "<div class='each_task_left_one'>"+
                              "<p class='each_task_name'>"+setlist[i-1]['projectName']+"</p>"+
                              "<div class='each_task_time'><div style='width:100%'>创建于</div>"+setlist[i-1]['createTime'].substring(0,10)+"</div>"+
                            "</div>"+
                                       "<div class='each_task_right' style='background:url("+color[i%4]+"); background-size:110px 120px'></div></div>";
                          }
                          else{
                            line+="<div class='each_task uk-float-left' data-id="+setlist[i-1]['projectId']+">"+
                            "<div class='each_task_left_one'>"+
                              "<p class='each_task_name'>"+setlist[i-1]['projectName']+"</p>"+
                              "<div class='each_task_time'><div style='width:100%'>创建于</div>"+setlist[i-1]['createTime'].substring(0,10)+"</div>"+
                            "</div>"+
                                       "<div class='each_task_right'></div></div>";
                          }
                          }
                          some+="<div class='all_task_detail_line'>"+line+"</div>";
                        }
                  }
              }
              all+=some;
            }
            }
  $('.index_all_task_detail').html(all);
          if(joinlist.length>0){
            if(joinlist.length<=m){
              var  line='';
              m=joinlist.length;  
            for(var i=1;i<=m;i++){
              if(joinlist[i-1]['status']==1){
                line+="<div class='join_each_task uk-float-left' data-id="+joinlist[i-1]['projectId']+">"+
                "<div class='each_task_left_one'>"+
                  "<p class='each_task_name'>"+joinlist[i-1]['projectName']+"</p>"+
                  "<div class='each_task_time'><div style='width:100%'>创建于</div>"+joinlist[i-1]['createTime'].substring(0,10)+"</div>"+
                "</div>"+
                            "<div class='each_task_right' style='background:url("+color[i%4]+"); background-size:110px 120px'></div></div>";
              }
              else{
                line+="<div class='join_each_task uk-float-left' data-id="+joinlist[i-1]['projectId']+">"+
                "<div class='each_task_left_one'>"+
                  "<p class='each_task_name'>"+joinlist[i-1]['projectName']+"</p>"+
                  "<div class='each_task_time'><div style='width:100%'>创建于</div>"+joinlist[i-1]['createTime'].substring(0,10)+"</div>"+
                "</div>"+
                            "<div class='each_task_right'></div></div>";
              }
              }
              join_str="<div class='all_task_detail_line'>"+line+"</div>";
            }
            else if(joinlist.length>=m){
              var  line='';
              for(var i=m-3,j=0;i<=m;i++,j++){
                if(joinlist[i-1]['status']==1){
                line+="<div class='join_each_task uk-float-left' data-id="+joinlist[i-1]['projectId']+">"+
                "<div class='each_task_left_one'>"+
                  "<p class='each_task_name'>"+joinlist[i-1]['projectName']+"</p>"+
                   "<div class='each_task_time'><div style='width:100%'>创建于</div>"+joinlist[i-1]['createTime'].substring(0,10)+"</div>"+
                "</div>"+
                            "<div class='each_task_right' style='background:url("+color[i%4]+"); background-size:110px 120px'></div></div>";
                }
                  else{
                    line+="<div class='join_each_task uk-float-left' data-id="+joinlist[i-1]['projectId']+">"+
                    "<div class='each_task_left_one'>"+
                      "<p class='each_task_name'>"+joinlist[i-1]['projectName']+"</p>"+
                      "<div class='each_task_time'><div style='width:100%'>创建于</div>"+joinlist[i-1]['createTime'].substring(0,10)+"</div>"+
                    "</div>"+
                               "<div class='each_task_right'></div></div>";
                  }
                  if(!(i%4)){
                    some+="<div class='joined_task_detail_line'>"+line+"</div>";
                    m+=4; 
                        if(joinlist.length<=m){
                          var  line='';
                          m=m-3;  
                        for(var i=m;i<=joinlist.length;i++){
                          if(joinlist[i-1]['status']==1){
                            line+="<div class='join_each_task uk-float-left' data-id="+joinlist[i-1]['projectId']+">"+
                            "<div class='each_task_left_one'>"+
                              "<p class='each_task_name'>"+joinlist[i-1]['projectName']+"</p>"+
                              "<div class='each_task_time'><div style='width:100%'>创建于</div>"+joinlist[i-1]['createTime'].substring(0,10)+"</div>"+
                            "</div>"+
                                       "<div class='each_task_right' style='background:url("+color[i%4]+"); background-size:110px 120px'></div></div>";
                          }
                          else{
                            line+="<div class='join_each_task uk-float-left' data-id="+joinlist[i-1]['projectId']+">"+
                            "           <div class='each_task_left_one'>"+
                              "<p class='each_task_name'>"+joinlist[i-1]['projectName']+"</p>"+
                              "<div class='each_task_time'><div style='width:100%'>创建于</div>"+joinlist[i-1]['createTime'].substring(0,10)+"</div>"+
                            "</div>"+
                                       "<div class='each_task_right'></div></div>";
                          }
                          }
                          some+="<div class='joined_task_detail_line'>"+line+"</div>";
                        }
                  }
              }
              join_str+=some;
            }
            $('.index_joined_task_detail').html(join_str);
           }
    }
      }
	});
      $(document).on('click','.each_task',function(){
        var id = $(this).data('id');
        console.log(id)
        location.href =encodeURI("../projectmanager/task_detail.html?userToken="+userToken+"&id="+id+"&userId="+userId+"&userName="+userName);
      });
      $(document).on('click','.join_each_task',function(){
        var id = $(this).data('id');
        console.log(id)
        location.href =encodeURI("../projectmanager/finish_task.html?userToken="+userToken+"&id="+id+"&userId="+userId+"&userName="+userName);
      });

      //未读消息的显示
      $.ajax({
        url:'index.php/web/News/getNewNewsNumber',
        type:'POST',
        data:{'userToken':userToken},
        success:function(data){
          var Data = JSON.parse(data);
          if(Data['newNewsNumber']['COUNT(*)']>0){
            $('.news_num').html(Data['newNewsNumber']['COUNT(*)']);
            $('.news_num').css('display','block');
          }
        }
      });

      if(!($('.index_all_task_detail').html())){
        $('.index_all_task_detail').html("<section class='tip'>暂无创建项目</section>");
      }
      if(!($('.index_joined_task_detail').html())){
        $('.index_joined_task_detail').html("<section class = 'tip'>暂无参与项目</section>");
      }
})