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
	 		 
	var slideObj = this;

	$.extend(defaults, option);	 	 
	$.extend(this,{
		
		init: function (option){

			this.liWidth =  $(slideObj).children().first().outerWidth();
			this.liHeight = $(slideObj).children().first().outerHeight();	 		 
			
			this.nums = $(slideObj).children().length;

			this.$prevObj = $("#" + defaults.prevID);
			this.$nextObj = $("#" + defaults.nextID);
			this.$pageObj = $("#" + defaults.pageID);
				 	  		 		  	  		
			
			this.initSlide();

			this.setPosition();		
			
			this.resetSlider();

			this.createPage();
			
			this.bind();

			this.touch();
		},

		initSlide: function(){
			
			$(slideObj).css({
				position: "relative",
				height: this.liHeight + "px",
				width: this.liWidth + "px",
				overflow: "hidden"
			});

			$(slideObj).children().each(function(i){
				var _left = this.liWidth * i;

				$(this).css({
					position: "absolute",
					left: _left + "px",
					top: 0,
					height: this.liHeight + "px",
					width: this.liWidth + "px"
				});
			});

		},			

		/*  在展示区域外包裹一个父元素，设置父元素宽度和overflow等于hidden，
			实现只显示当前页，隐藏其他页的功能
		*/
		wrap: function(){
			var wrapObj = $('<div class = "firstMenuAll"></div>');
			$(wrapObj).css({
				"overflow": "hidden",
				"height": this.liHeight + "px",
				"width": this.liWidth + "px",
				'float': "left"
			});
			$(slideObj).wrapAll(wrapObj);	      		
			$(slideObj).css({
				'width': this.liWidth * 2 + "px",
				'height': this.liHeight + "px"
			});
		}
	});
	
	$.extend(this, {		
		/* 创建页码 */
		createPage: function(){
			var html = "";
			for(var i = 0; i < this.nums; i++){
				html += '<a href="#"></a>';
			}
			this.$pageObj.html(html);
			this.changeClass(this.nowPos);
		},
		/* 改变翻页的class */
		changeClass: function(nowPos){
			this.$pageObj.children().removeClass(defaults.currentClass);
			this.$pageObj.children().eq(nowPos - 1).addClass(defaults.currentClass);
		},
		/* 绑定向前、向后、和圆点的点击事件*/
		bind: function(){
			var _this = this;			
			if (this.nums <=  1) {					  						
				this.$prevObj.css("display","none");	
				this.$nextObj.css("display","none");			
				return false;
			}  
			this.$prevObj.bind('click', function (e) {	
				_this.toPrev(e);
			});

			this.$nextObj.bind('click', function (e) {		   			
				_this.toNext(e);
			});

			this.$pageObj.children().each(function(i){
				$(this).click(function(e){
					if(_this.moving){
						return false;
					}							
					_this.nowPos = i + 1;				
					var step = _this.nowPos > _this.oldPos ? 1 : -1; 				
					if(step == 1){
						_this.curPosArray = [-100, _this.oldPos, _this.nowPos];
					}else{
						_this.curPosArray = [_this.nowPos, _this.oldPos, -100];						
					}		
					_this.resetSlider();
					_this.move(e, step);

				});
			});
		},
		//绑定鼠标拖动事件
		touch: function(){
			if(!defaults.isTouch) return false;

			var touchstart = "onmousedown" in window ? "mousedown" : "touchstart",
			touchmove = "onmousemove" in window ? "mousemove" : "touchmove",
			touchend = "onmouseup" in window ? "mouseup" : "touchend";

			var _this = this; 

			var _startPos = 0,
			_currentPos = 0,
			_draging = 0;

			$(slideObj).find("img").bind("dragstart", function(e){
	  			e.preventDefault();
				return false;
			});


			$(slideObj).bind("mousedown", function(e){
				if(_this.moving) return false;
				_draging = 1;
				_startPos = e.clientX;
				_currentPos = 0;
			});

			$(slideObj).bind("mousemove", function(e){
				if(!_draging) return false;			
				for(var i = 0; i < _this.curPosArray.length; i++){				
					var curObj = $(slideObj).children().eq(_this.curPosArray[i] - 1);
					_currentPos = _currentPos ? _currentPos : _startPos;
					var _left = parseInt(curObj.css("left"));
					_left = _left + e.clientX - _currentPos;
					curObj.css("left", _left + "px");								
				}
				_currentPos = e.clientX;
			});

			$(document).bind("mouseup", function(e){
				if(!_draging) return false;
				_draging = 0;
				_currentPos = e.clientX;
							
				if(Math.abs(_currentPos - _startPos) < 10){
					_startPos = 0;
					_currentPos = 0;
					_this.move(e, 0);
					return false;
				}

				if(_currentPos > _startPos){
					_this.toPrev(e);
				}else{
					_this.toNext(e);
				}

			});
			return false;
		}
	});

	$.extend(this, {
		
		moving: 0,
		
		curPosArray: [],

		nowPos: 1,

		oldPos: 1,

		//设置上一页，当前页，下一页位置
		setPosition: function(){
			var _nowPos = this.nowPos, 
			_nextPos = _nowPos + 1,
			_prevPos = _nowPos - 1;
			if(_nextPos > this.nums){
				_nextPos = defaults.loop == 1 ? 1 : -1000;
			}
			if(_prevPos < 1){
				_prevPos = defaults.loop == 1 ? this.nums : -1000;
			}
			this.curPosArray = [_prevPos, _nowPos, _nextPos];
		},
		//初始化三个页面，上一页、当前页、下一页
		resetSlider: function(){
			var listSonObj = $(slideObj).children();
			listSonObj.hide();
			for(var i = 0; i < this.curPosArray.length; i++){			
				listSonObj.eq(this.curPosArray[i] - 1).css("left", (i - 1) * this.liWidth + "px").show();	
			};
		},	
		toPrev: function(e){
			if(this.moving){
				return false;
			}	
			if (this.nowPos <= 1) {
				if(defaults.loop){
					this.nowPos = this.nums;
					this.move(e, -1);								
				}else{
					this.move(e, 0);
				}
				return true;					
			}
			this.nowPos--;
			this.move(e, -1);
		},

		toNext: function (e){
			if(this.moving){
				return false;
			}
			if (this.nowPos >= this.nums) {
				if(defaults.loop){	
					this.nowPos = 1;
					this.move(e, 1);							
				}else{
					this.move(e, 0);
				}
				return true;					
			}		
			this.nowPos++;
			this.move(e, 1);
		},

		move: function(e, step){
			var _this = this;
			defaults.startCallBack(e, _this.nowPos);		
			this.moving = 1;
			for(var i = 0; i < this.curPosArray.length; i++){	
				var curObj = $(slideObj).children().eq(this.curPosArray[i] - 1);
				var _left = (i - 1 - step) * this.liWidth;		
				curObj.animate({
					'left': _left + "px"
				}, defaults.speed, function(){					
					
					_this.setPosition();
					_this.resetSlider();
					_this.changeClass(_this.nowPos);					
					_this.moving = 0;
					_this.oldPos = _this.nowPos;
					
					defaults.endCallback(e, _this.nowPos);
				});			
			}
		}		
	});
				
	this.init();
	return slideObj;
}