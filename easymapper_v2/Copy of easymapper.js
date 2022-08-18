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