$(function(){
	var $sel = $(".selector"),
		$operation = $(".operation"),
		$sel_list = $(".sel_list"),
		$operat_list = $(".operat_list");

	var show_time = true;
	var hide_time = true;
	function change(obj,tog){
		obj.on('mouseover',function(e){
			if(show_time){
				show_time = false;
				tog.show(); 

				setTimeout(function(){
					show_time = true;
				},200)
			}
			
		});
		obj.on('mouseout',function(e){
			if(hide_time){
				hide_time = false;
				tog.hide();

				setTimeout(function(){
					hide_time = true;
				},200)
			}
		});
	}

	change($sel,$sel_list);
	change($operation,$operat_list);
	change($('.sel_list li'),$sel_list);
	change($('.operat_list li'),$operat_list);
})