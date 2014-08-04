/*
	verson: v.0.0.1
	author: niuben 
	date: 2014-7-31
*/
$.fn.carousel  =  function (option) {
	
	var defaults  =  {
		//绑定id
		id: ".nav",	     
		//左边箭头 		 
		prevID: "leftArrow",
		//右边箭头
		nextID: "rightArrow",		 
		//页面区域
		pageID: "",		
		//页面当前状态
		currentClass: "current",
		//是否循环
		loop: 1,
		//滑动事件
		speed: 300,
		//滑动开始时触发 
		startCallBack:function(e,nowPos){
			null;
		},
		//滑动结束时触发
		endCallback:function(e,nowPos){
			null;
		}
		  		  
	 }
	 		 
	$.extend(defaults, option);	 	 

	var slideObj = this;

	var listSonObj = $(slideObj).children();
	//单个的宽度
	var liWidth = 0;
	//单个列表高度	
	var liHeight = 0;	
	//列表的数目	
	var nums = 0;

	var prevObj = $("#" + defaults.prevID);	 
	var nextObj = $("#" + defaults.nextID);
	var pageObj = $("#" + defaults.pageID);

	var nowPos = 1;
	var oldPos = 1;

	var moving = 0;

	function install(option){
		  		 
		liWidth =  $(listSonObj).first().outerWidth();
		liHeight = $(listSonObj).first().outerHeight();	 		 
		nums = listSonObj.length;

		if (nums <=  1) {					  						
			$(prevObj).css("display","none");	
			$(nextObj).css("display","none");			
			return false;
		}  
			  		  		 		  	  		
		slideObj.move = function(nowPos){
			move(null, nowPos);
		}

		listSonObj.hide().first().show();
		createPage();
		wrap();
		bind();
	};

	/*
		创建页码
	*/
	function createPage(){
		var html = "";
		for(var i = 0; i < nums; i++){
			html += '<a href="#"></a>';
		}
		$(pageObj).html(html);
		changeClass(nowPos);
	}

	/*
		在展示区域外包裹一个父元素，设置父元素宽度和overflow等于hidden，
		实现只显示当前页，隐藏其他页的功能
	*/
	function wrap(){
		var wrapObj = $('<div class = "firstMenuAll"></div>');
		$(wrapObj).css({
			"overflow": "hidden",
			"height": liHeight + "px",
			"width": liWidth + "px",
			'float': "left"
		});
		$(slideObj).wrapAll(wrapObj);	      		
		$(slideObj).css({
			'width': liWidth * nums + "px",
			'height': liHeight + "px"
		});

	}

	/*
		绑定向前、向后、和圆点的点击事件	            		  	  		 	
	*/
	function bind(){
				  		  		
		$(prevObj).bind('click', function (e) {	
			if(moving){
				return false;
			}
			if (nowPos <= 1) {
				if(defaults.loop){
					nowPos = nums;
					var lastObj = $(listSonObj).last();
					$(slideObj).prepend(lastObj);
					move(e, nowPos, "prev");
				}
				return true;					
			}
			nowPos--;
			move(e, nowPos, "prev");    			
		});

		$(nextObj).bind('click', function (e) {		   			
			if(moving){
				return false;
			}
			if (nowPos >= nums) {
				if(defaults.loop){
					nowPos = 1;
					var firstObj = $(listSonObj).first();
					$(slideObj).append(firstObj);
					move(e, nowPos, "next");			
				}				
				return true;					
			}		
			nowPos++;
			move(e, nowPos, "next");
		});

		$(pageObj).children().each(function(i){
			$(this).click(function(e){
				if(moving){
					return false;
				}
				nowPos = i + 1;
				var direction = nowPos > oldPos ? "next" : "prev"; 
				move(e, nowPos, direction);
			});
		});
	}

	/*
		设置显示区域margin-left属性，实现滑动功能
	*/
	function move(e, nowPos, direction){
		
		if(nowPos == oldPos){
			return false;
		}
		defaults.startCallBack(e,nowPos);
		$(listSonObj).eq(nowPos - 1).show();		
		
		// var marginLeft;
		if(direction == "next"){
			marginLeft = -liWidth;
		}else{
			$(slideObj).css("marginLeft", -liWidth + "px");
			marginLeft = 0;
		}

		moving = 1;
		$(slideObj).animate({
			'marginLeft': marginLeft
		}, defaults.speed, function () {
			changeClass(nowPos);
			defaults.endCallback(e, nowPos);
			$(listSonObj).eq(oldPos - 1).hide();
			$(slideObj).css("marginLeft", 0);
			moving = 0;
			oldPos = nowPos;
		});
	};

	/*
		改变翻页的class
	*/
	function changeClass(nowPos){
		$(pageObj).children().removeClass(defaults.currentClass);
		$(pageObj).children().eq(nowPos - 1).addClass(defaults.currentClass);
	};
				
	install();
	return slideObj;
}