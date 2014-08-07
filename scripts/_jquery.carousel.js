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
		speed: 400,
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
	
	var liWidth = 0,
	liHeight = 0;

	//列表的数目	
	var nums = 0;

	var prevObj = $("#" + defaults.prevID),
	nextObj = $("#" + defaults.nextID),
	pageObj = $("#" + defaults.pageID);

	//记录滑动时的位置
	var nowPos = 1,
	oldPos = 1;

	//滑动的指针
	var moving = 0;

	//将第一个元素放在最后,或将最后一个元素放在第一个
	var isToEnd = 0,
	isToFirst = 0;

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

	/* 创建页码 */
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
			'width': liWidth * 2 + "px",
			'height': liHeight + "px"
		});

	}

	/* 绑定向前、向后、和圆点的点击事件*/
	function bind(){
				  		  		
		$(prevObj).bind('click', function (e) {	
			toPrev(e);			
		});

		$(nextObj).bind('click', function (e) {		   			
			toNext(e);
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

		var touchstart = "onmousedown" in window ? "mousedown" : "touchstart",
		touchmove = "onmousemove" in window ? "mousemove" : "touchmove",
		touchend = "onmouseup" in window ? "mouseup" : "touchend";

		var startPos = 0,
		currentPos = 0,
		draging = 0;

		$(slideObj).bind(touchstart, function(e){
			draging = 1;
			startPos = e.clientX;
		});

		$(slideObj).bind(touchmove, function(e){
			if(!draging) return false;
			currentPos = e.clientX;
			if(currentPos > startPos ){
				var prevPos = nowPos - 2;
				prevPos	= prevPos > 0 ? prevPos : nums - 1; 
				if(!isToFirst){
					isToFirst = 1;
					toFirst();
				}				
				$(listSonObj).eq(prevPos).show();
				$(slideObj).css("marginLeft", -liWidth + currentPos - startPos + "px");
			}else{
				var nextPos = nowPos < nums ? nowPos : 0;
				if(!isToEnd){
					isToEnd = 1;
					toEnd();
				}
				$(listSonObj).eq(nextPos).show();
				$(slideObj).css("marginLeft", currentPos - startPos + "px");
			}
		});

		$(slideObj).bind(touchend, function(e){
			draging = 0;
			currentPos = e.clientX;
			if(Math.abs(currentPos - startPos) < 10){
				return false;
			}

			if(currentPos > startPos){
				toPrev(e);
			}else{
				toNext(e);
			}
		});

		return false;
	}

	function toPrev(e){
		if(moving){
			return false;
		}
		if (nowPos <= 1) {
			if(defaults.loop){
				nowPos = nums;
				isToFirst = 1;				
				toFirst();
				move(e, nowPos, "prev");
			}
			return true;					
		}
		nowPos--;
		move(e, nowPos, "prev");
	}

	function toNext(e){
		if(moving){
			return false;
		}
		if (nowPos >= nums) {
			if(defaults.loop){
				nowPos = 1;
				isToEnd = 1;				
				toEnd();
				move(e, nowPos, "next");			
			}				
			return true;					
		}		
		nowPos++;
		move(e, nowPos, "next");
	}

	function toEnd(){
		var firstObj = $(slideObj).children().first();
		$(slideObj).append(firstObj);
	}

	function toFirst(){
		var lastObj = $(slideObj).children().last();
		$(slideObj).prepend(lastObj);
	}

	//设置显示区域margin-left属性，实现滑动功能
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
			// var _marginLeft = parseInt($(slideObj).css("marginLeft"));
			// _marginLeft = _marginLeft ? _marginLeft : -liWidth; 
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
			
			if(isToEnd){
				isToEnd = 0;
				toFirst();
			}
			if(isToFirst){
				isToFirst = 0;
				toEnd();
			}

			moving = 0;
			oldPos = nowPos;
		});
	};

	/* 改变翻页的class */
	function changeClass(nowPos){
		$(pageObj).children().removeClass(defaults.currentClass);
		$(pageObj).children().eq(nowPos - 1).addClass(defaults.currentClass);
	};
				
	install();
	return slideObj;
}