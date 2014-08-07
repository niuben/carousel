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
		//支持鼠标滑动拖动
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
	nextPos = 0,
	prevPos = 0,
	oldPos = 1;

	var curPosArray = [];

	//滑动的指针
	var moving = 0;

	//将第一个元素放在最后,或将最后一个元素放在第一个
	var isToEnd = 0,
	isToFirst = 0;

	//阻尼距离
	var bufferNum = 80;

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
		initSlide()
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

		// listSonObj.hide().first().show();
		setPosition();
	}

	//设置当前页的左右位置
	function setPosition(){
		nextPos = nowPos + 1,
		prevPos = nowPos - 1;
		if(nextPos > nums){
			nextPos = defaults.loop == 1 ? 1 : -1000;
		}
		if(prevPos < 1){
			prevPos = defaults.loop == 1 ? nums : -1000;
		}
		curPosArray = [prevPos, nowPos, nextPos];
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
				var direction = nowPos > oldPos ? "next" : "prev"; 				
				if(direction == "next"){
					curPosArray = [-100, oldPos, nowPos];
				}else{
					curPosArray = [nowPos, oldPos, -100];						
				}		
				resetSlider();
				move(e, nowPos, direction);

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
			currentPos = e.clientX;
			if(Math.abs(currentPos - startPos) < 10){
				startPos = 0;
				currentPos = 0;
				return false;
			}
			if(currentPos > startPos){
				toPrev(e);
			}else{
				toNext(e);
			}
			draging = 0;
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
			move(e, nowPos, "prev");			
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
			}
			move(e, nowPos, "next");							
			return true;					
		}		
		nowPos++;
		move(e, nowPos, "next");
	}

	//设置显示区域margin-left属性，实现滑动功能
	function move(e, nowPos, direction){		
		if(nowPos == oldPos){
			moving = 1;
			$(slideObj).children().eq(nowPos - 1).animate({
				'left': "0px"
			}, defaults.speed, function(){
				moving = 0;
				setPosition();
			});
			return false;
		}
		defaults.startCallBack(e,nowPos);
		
		if(direction == "next"){
			marginLeft = -1;
		}else{
			marginLeft = 1;
		}

		moving = 1;
		for(var i = 0; i < curPosArray.length; i++){	
			var curObj = $(slideObj).children().eq(curPosArray[i] - 1);
			var _left = (i - 1) * liWidth + marginLeft * liWidth;
			var _bufferLeft = (i - 1) * liWidth + (liWidth + bufferNum) * marginLeft;
			
			(function(curObj, _left){
				curObj.animate({
					'left': _left + "px"
				}, defaults.speed, function(){
					
					// $(curObj).animate({
					// 	'left': _left + "px"
					// }, 300, function(){
					// 	setPosition();						
					// });

					setPosition();						
					changeClass(nowPos);
					defaults.endCallback(e, nowPos);
					moving = 0;
					oldPos = nowPos;
				});
			})(curObj, _left);
		}
	};

	/* 改变翻页的class */
	function changeClass(nowPos){
		$(pageObj).children().removeClass(defaults.currentClass);
		$(pageObj).children().eq(nowPos - 1).addClass(defaults.currentClass);
	};
				
	install();
	return slideObj;
}