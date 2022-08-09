// 옵션 선언
var _unitIsRatio = new Boolean(true); // 단위 기본값(퍼센트) 여부
var _measureIsDrag = new Boolean(true); // 제도방식 기본값(드래그) 여부
var _theme; // 테마

// 요소 축약
var $body = $('body');
var $axis_x = $('.axis.x');
var $axis_x_scale_small = $('.axis.x .scale.small');
var $axis_x_scale_big = $('.axis.x .scale.big');
var $axis_y = $('.axis.y');
var $axis_y_scale_small = $('.axis.y .scale.small');
var $axis_y_scale_big = $('.axis.y .scale.big');
var $canvas = $('#canvas');
var $overlay = $('#overlay');

// 전역 변수 선언
var axis_x_width,
	axis_y_height,
	cursor_x,
	cursor_y,
	guide_color,
	guide_color_active,
	guide_color_disabled,
	coord_start,
	coord_end,
	coord_gap,
	moving_map;

// 캔버스 초기화
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// 캔버스 상태값 정의
var canvasIsIdle = new Boolean(true); // 캔버스 유휴상태 여부
var drawable = new Boolean(true); // 맵 제도가능 여부
var isStable = new Boolean(true); // 맵 이동중 여부

// 이벤트 바인딩
$(window).on('load', init); // 초기화
$(document).on('mousemove', getPosition) // 커서 위치 반환
	.on('mousedown mouseup', '#overlay', drawMap) // 맵 제도
	.on('mousedown', '.map', grabMap) // 맵 이동
	.on('mouseup', release)
	.on('mouseenter mouseleave', '.map', hoverOnMap)
	.on('contextmenu mouseleave', '#overlay', hardCancel) // 우측 마우스 클릭시 하드 캔슬
	.on('click', 'button', buttonEvents) // 버튼 이벤트
	.on('change', 'input[type=radio]', radioEvents); // 라디오 이벤트

function buttonEvents(){
	var id = $(this).attr('id');
	
	switch(id){
	case 'btn-unit-toggle': // 단위 교체 버튼
		$('input[name=radio-unit]:checked').prop('checked', false);
		$('#radio-unit-'+ (_unitIsRatio ? 'pixel' : 'ratio')).click();
		break;
	}
}

function radioEvents(){
	var $this = $(this);
	var this_class = $this.attr('id').split('-').slice(1).join('-');
	var type = $this.attr('name').split('-')[1]; // 라디오 타입 반환
	var re = new RegExp(type+'[\\w-]*','g'); // 타입 포함 정규식
	var other_class = $body.attr("class").match(re)[0]; // 클래스 색인
	$body.removeClass(other_class).addClass(this_class); // 클래스 교체
	swapOption(type); // 옵션 변수 교체
}

function swapOption(type){
	switch(type){
	case 'unit':
		_unitIsRatio = !_unitIsRatio;
		axisInit(); // 축 눈금 재설정
		break;
	case 'measure':
		_measureIsDrag = !_measureIsDrag;
		break;
	}
}

function init(){	
	getOptions(); // 단위, 제도방식, 테마 반환
	axisInit(); // 축 눈금 삽입
}

function getOptions(){
	_unitIsRatio = $body.hasClass('unit-ratio'); // 단위 반환
	_measureIsDrag = $body.hasClass('measure-drag'); // 제도방식 반환
	_theme = $body.attr("class").match(/theme[\w-]*/g)[0].split('-')[1]; // 테마 반환
	
	setThemeColor(); // 테마 색상 참고
}

function setThemeColor(){
	guide_color = $('#hidden-guide-color').css('color');
	guide_color_active = $('#hidden-guide-color-active').css('color');
	guide_color_disabled = $('#hidden-guide-color-disabled').css('color');
}

function axisInit(){	
	$axis_x.children().empty(); // 눈금 초기화
	$axis_y.children().empty();
	
	axis_x_width = $axis_x.outerWidth();
	axis_y_height = $axis_y.outerHeight();
		
	$canvas.attr({ // 캔버스 속성 부여
		width: axis_x_width,
		height: axis_y_height
	});
	
	var scale_small = _unitIsRatio ? 5 : 10; // 작은 눈금자 단위
	var scale_big = _unitIsRatio ? 10 : 100; // 큰 눈금자 단위
	var scale_ratio = scale_big / scale_small; // 단위 비율
	var iteration_x = Math.floor((_unitIsRatio ? 100 : axis_x_width) / scale_small); // 반복 횟수 계산
	var iteration_y = Math.floor((_unitIsRatio ? 100 : axis_y_height) / scale_small);
	var unit = _unitIsRatio ? '%' : 'px';
	
	for (var i=0;i<iteration_x;i++){ // x축 생성
		$axis_x_scale_small.append('<i></i>'); // 작은 눈금자 삽입
		
		if (i%scale_ratio == 0)
			$axis_x_scale_big.append('<i><span>'+(i+scale_ratio)*scale_small+unit+'</span></i>'); // 큰 눈금자 삽입
	}
	
	for (var i=0;i<iteration_y;i++){ // y축 생성
		$axis_y_scale_small.append('<i></i>');
		
		if (i%scale_ratio == 0)
			$axis_y_scale_big.append('<i><span>'+(i+scale_ratio)*scale_small+unit+'</span></i>');
	}
}

function getPosition(e){
	cursor_x = e.pageX - $overlay.offset().left;
	cursor_y = e.pageY - $overlay.offset().top;
	
	if(!isStable){ // 맵 이동중
		moveMap();
	} else{
		drawGuide(); // 가이드 출력
	}
}

function grabMap(){
	var coord_x = parseInt($(this).css('left'));
	var coord_y = parseInt($(this).css('top'));
	
	$(this).addClass('moving');
	moving_map = { width: parseInt($(this).css('width')), height: parseInt($(this).css('height')) };		
	coord_gap = { x: cursor_x-coord_x, y: cursor_y-coord_y };
	
	isStable = false;
}

function release(){
	if (!isStable){
		$(this).removeClass('moving');
		isStable = true;
	}
	
	return false;
}

function moveMap(){
	var coord_moving = { x: cursor_x - coord_gap.x, y: cursor_y - coord_gap.y };
	
	if (coord_moving.x >= 0 && coord_moving.x <= axis_x_width - moving_map.width){
		$('.map.moving').css({
			left: coord_moving.x
		});
	}
	
	if (coord_moving.y >= 0 && coord_moving.y <= axis_y_height - moving_map.height){
		$('.map.moving').css({
			top: coord_moving.y
		});
	}
}

function drawMap(e){
	if (e.type == 'mousedown' && e.which == 1 && canvasIsIdle && drawable){
		canvasIsIdle = false;
		coord_start = { x: cursor_x, y: cursor_y };
	} else if(e.which == 1 && !canvasIsIdle && drawable){
		canvasIsIdle = true;
		coord_end = { x: cursor_x, y: cursor_y };
		createMap();
	} else{
		hardCancel(e);
	}
}

function createMap(){
	var map_coord_start = { x: Math.min(coord_start.x,coord_end.x), y: Math.min(coord_start.y,coord_end.y) };
	var map_coord_end = { x: Math.max(coord_start.x,coord_end.x), y: Math.max(coord_start.y,coord_end.y) };
	var map_width = map_coord_end.x - map_coord_start.x;
	var map_height = map_coord_end.y - map_coord_start.y;
	
	$overlay.append('<div class="map" style="top:'+map_coord_start.y+'px;left:'+map_coord_start.x+'px;width:'+map_width+'px;height:'+map_height+'px;"></div>');
}

function hardCancel(e){	
	if (e.type == 'mouseleave'){
		ctx.clearRect(0,0,axis_x_width,axis_y_height);
	}

	canvasIsIdle = true;
	
	return false;
}

function hoverOnMap(e){
	if (e.type == 'mouseenter'){
		drawable = false; // 2중 안전장치
	} else{
		drawable = true;
	}
}

function drawGuide(){
	ctx.lineWidth = 1; // 선 굵기
	ctx.strokeStyle = drawable ? (canvasIsIdle ? guide_color : guide_color_active) : guide_color_disabled; // 테마 색상

	ctx.clearRect(0,0,axis_x_width,axis_y_height); // 가이드 삭제
	
	if (canvasIsIdle && !drawable){
		
	} else{
		ctx.beginPath(); // x축 가이드 제도
		ctx.moveTo(0,cursor_y+0.5);
		ctx.lineTo(axis_x_width,cursor_y+0.5);
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath(); // y축 가이드 제도
		ctx.moveTo(cursor_x+0.5,0);
		ctx.lineTo(cursor_x+0.5,axis_y_height);
		ctx.stroke();
		ctx.closePath();
	}	
	
	if (!canvasIsIdle){
		ctx.strokeStyle = guide_color;
		ctx.beginPath();
		ctx.moveTo(0,coord_start.y+0.5);
		ctx.lineTo(axis_x_width,coord_start.y+0.5);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.moveTo(coord_start.x+0.5,0);
		ctx.lineTo(coord_start.x+0.5,axis_y_height);
		ctx.stroke();
		ctx.closePath();
	}
}