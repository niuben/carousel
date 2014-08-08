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
		//阻尼效果
		isBuffer: 1,
		//滑动事件
		speed: 300,
		//支持鼠标拖动翻页
		isTouch: 1,
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

	var slideObj = this,
	listSonObj = $(slideObj).children();
	
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

	//存上一页、当前页、下一页位置的数组
	var curPosArray = [];

	//滑动的指针
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

		createPage();
		
		initSlide();

		setPosition();		
		// wrap();
		bind();
	};

	function initSlide(){
		
		$(slideObj).css({
			position: "relative",
			height: liHeight + "px",
			width: liWidth + "px",
			overflow: "hidden"
		});

		$(slideObj).children().each(function(i){
			var _left = liWidth * i;
			$(this).css({
				position: "absolute",
				left: _left + "px",
				top: 0,
				height: liHeight + "px",
				width: liWidth + "px"
			});
		});

	}

	//设置上一页，当前页，下一页位置
	function setPosition(){
		var _nextPos = nowPos + 1,
		_prevPos = nowPos - 1;
		if(_nextPos > nums){
			_nextPos = defaults.loop == 1 ? 1 : -1000;
		}
		if(_prevPos < 1){
			_prevPos = defaults.loop == 1 ? nums : -1000;
		}
		curPosArray = [_prevPos, nowPos, _nextPos];
		resetSlider();
	};

	//初始化三个页面，上一页、当前页、下一页
	function resetSlider(){
		var listSonObj = $(slideObj).children();
		listSonObj.hide();
		for(var i = 0; i < curPosArray.length; i++){			
			listSonObj.eq(curPosArray[i] - 1).css("left", (i - 1) * liWidth + "px").show();	
		};
	}

	/* 创建页码 */
	function createPage(){
		var html = "";
		for(var i = 0; i < nums; i++){
			html += '<a href="#"></a>';
		}
		$(pageObj).html(html);
		changeClass(nowPos);
	}

	/*  在展示区域外包裹一个父元素，设置父元素宽度和overflow等于hidden，
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
				var step = nowPos > oldPos ? 1 : -1; 				
				if(step == 1){
					curPosArray = [-100, oldPos, nowPos];
				}else{
					curPosArray = [nowPos, oldPos, -100];						
				}		
				resetSlider();
				move(e, step);

			});
		});

		if(!defaults.isTouch) return false;

		var touchstart = "onmousedown" in window ? "mousedown" : "touchstart",
		touchmove = "onmousemove" in window ? "mousemove" : "touchmove",
		touchend = "onmouseup" in window ? "mouseup" : "touchend";

		var startPos = 0,
		currentPos = 0,
		draging = 0;

		$(slideObj).find("img").bind("dragstart", function(e){
  			e.preventDefault();
			return false;
		});


		$(slideObj).bind("mousedown", function(e){
			if(moving) return false;
			draging = 1;
			startPos = e.clientX;
			currentPos = 0;
		});

		$(slideObj).bind("mousemove", function(e){
			if(!draging) return false;			
			for(var i = 0; i < curPosArray.length; i++){				
				var curObj = $(slideObj).children().eq(curPosArray[i] - 1);
				currentPos = currentPos ? currentPos : startPos;
				var _left = parseInt(curObj.css("left"));
				_left = _left + e.clientX - currentPos;
				curObj.css("left", _left + "px");								
			}
			currentPos = e.clientX;
		});

		$(document).bind("mouseup", function(e){
			// alert(draging);
			if(!draging) return false;
			draging = 0;
			currentPos = e.clientX;			
			if(Math.abs(currentPos - startPos) < 10){
				startPos = 0;
				currentPos = 0;
				move(e, 0);			
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

	// function set
	function toPrev(e){
		if(moving){
			return false;
		}	
		if (nowPos <= 1) {
			if(defaults.loop){
				nowPos = nums;
			}
			move(e, -1);			
			return true;					
		}
		nowPos--;
		move(e, -1);
	}

	function toNext(e){
		if(moving){
			return false;
		}
		if (nowPos >= nums) {
			if(defaults.loop){
				nowPos = 1;
			}
			move(e, 1);							
			return true;					
		}		
		nowPos++;
		move(e, 1);
	}

	//设置显示区域margin-left属性，实现滑动功能
	// function move(e, nowPos, direction){		
	// 	var step;
	// 	if(direction == "next"){
	// 		step = -1;
	// 	}else{
	// 		step = 1;
	// 	}
	// 	animate(e, step);
		
	// };



	function move(e, step){
		
		defaults.startCallBack(e,nowPos);		
		moving = 1;

		for(var i = 0; i < curPosArray.length; i++){	
			var curObj = $(slideObj).children().eq(curPosArray[i] - 1);
			var _left = (i - 1 - step) * liWidth;		
			curObj.animate({
				'left': _left + "px"
			}, defaults.speed, function(){					
				setPosition();																
				changeClass(nowPos);
				defaults.endCallback(e, nowPos);
				moving = 0;
				oldPos = nowPos;
			});			
		}
	}

	/* 改变翻页的class */
	function changeClass(nowPos){
		$(pageObj).children().removeClass(defaults.currentClass);
		$(pageObj).children().eq(nowPos - 1).addClass(defaults.currentClass);
	};
				
	install();
	return slideObj;
}