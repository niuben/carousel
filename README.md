carousel
========

### 一个轮播图插件

  插件介绍：用户同一时间只能看到一块内容，可以通过点击翻页元素，或者滑动鼠标，查看其他的内容。
  
  运用场景：相似内容很多，显示区域有限，比如网站首页。
  
  引用文件： _jquery.carousel.js

API
---
**参数**

<pre>
参数名称      默认值  	描述
prevID        null    	上一页按钮ID
nextID        null    	下一页按钮ID
pageID        null    	页码列表ID（显示为小圆点）
currentClass  "current" 当前页码加载的样式
loop          1       	是否可以连续滑动
speed         300     	滑动需要时间，单位为ms。数值越小，速度越快。
startCallback fun     	滑动开始触发,会传入event和当前页数
endCallback   fun     	滑动结束触发,会传入event和当前页数
</pre>


代码示例
---------
 **Html**
 <pre>
&lt;div class="bar"&gt;
  &lt;a href="javascript:void(0);" id="prev" class="prev"&gt;&lt;/a&gt;
  &lt;div id="page" class="page"&gt;
  &lt;/div&gt;
  &lt;a href="javascript:void(0);" id="next" class="next"&gt;&lt;/a&gt;
&lt;/div&gt;
&lt;ul class="clearfix carousel"&gt;
  &lt;li&gt;1&lt;/li&gt;
  &lt;li&gt;2&lt;/li&gt;
  &lt;li&gt;3&lt;/li&gt;
  &lt;li&gt;4&lt;/li&gt;
  &lt;li&gt;5&lt;/li&gt;
&lt;/ul&gt;
 </pre>
 
**Css**
<pre>
.bar {
	position: absolute;
	top: 195px;
	left: 400px;
	margin-left: -100px;
	height: 18px; 
}
.bar .prev,
.bar .next {
	float: left;
	width: 18px;
	height: 18px;
	display: block;
	outline: none;
	background-image: url(navigator.png);
	background-repeat: no-repeat;
}
.bar .prev {
	margin-right: -1px;
	background-position: -40px 0;
}
.bar .next { 
	background-position: -17px 0; 
}
.bar .prev: hover {
	text-decoration: none;
	background-position: 0 0;
}
.bar .next: hover {
	text-decoration: none;
	background-position: -57px 0;
}
	
.page { 
	float: left; 
	margin-left: 10px;
	margin-right: 10px; 
}
.page a {
	display: inline-block;
	width: 6px;
	height: 6px;
	margin: 6px 5px 0 0;
	font-size: 0px;
	color: #70B2D5;
	background: url(navigator.png) -80px -10px no-repeat;
	outline: none;
	overflow: hidden;
}
.page a.current,.page a:hover{
	color: #CACACA;
	background: url(navigator.png) -80px 0 no-repeat;
}

.carousel{
	list-style: none;
	padding: 0;
	margin: 0;
}
.carousel li {
	padding: 0;
	margin: 0;
	float: left;
	width: 800px;
	height: 210px;
	line-height: 210px;
	text-align: center;
	font-size: 16px;
	font-weight: bold;
	border: 1px solid #ccc;
	-moz-border-radius: 4px;
	-webkit-border-radius: 4px;
}
</pre>
 
**Javascript**
<pre>
$(".carousel").carousel({
    prevID: "prev",    
    nextID: "next",
    pageID: "page",
    currentClass: "current"
	});  
</pre>

版本历史
--------
v 0.0.1     beta    2014-8-1    插件建立

v 0.0.2     beta    2014-8-7    增加鼠标左右滑动功能
