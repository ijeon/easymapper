// Options
var _theme,
	_unit,
	_measure,
	_unitIsRatio = new Boolean(),
	_measureIsDrag = new Boolean();

// Shortens
var $body = $('body'),
	$axis_x = { small: $('.axis.x .scale.small'), big: $('.axis.x .scale.big') },
	$axis_y = { small: $('.axis.y .scale.small'), big: $('.axis.y .scale.big') },
	$scale = $('.scale'),
	$canvas = $('#canvas'),
	$overlay = $('#overlay'),
	$dim = $('#dim'),
	$popup = $('.popup');

// Global Variables
var source = new Array(),
	cursor = new Array(),
	map_coord = new Array()
	drawing = false;

// Canvas
var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

// Events
$(window).on('load', init);
$(document).on('mousemove', getPos)
	.on('click', 'button', btnEvents)
	.on('click', '#dim', closePopup)
	.on('change', 'input[type=radio]', radioEvents)
	.on('mousedown', '#overlay', drawStart)
	.on('mouseup', drawEnd);

function drawStart(e){
	if (e.which == 1){
		map_coord.start = { x: cursor.x, y: cursor.y };
		drawing = true;
	}
}

function drawEnd(e){
	var end_coord = new Array();
	
	if (e.which == 1 && drawing == true){
		if (cursor.x >= source.width) end_coord.x = source.width;
		else if (cursor.x <= 0) end_coord.x = 0;
		else{ end_coord.x = cursor.x; }
		
		if (cursor.y >= source.height) end_coord.y = source.height;
		else if (cursor.y <= 0) end_coord.y = 0;
		else{ end_coord.y = cursor.y; }

		map_coord.end = { x: end_coord.x, y: end_coord.y };
		drawing = false;
		createMap();
	}
}

function createMap(){
	var new_coord = new Array();
	new_coord.start = { x: Math.min(map_coord.start.x,map_coord.end.x), y: Math.min(map_coord.start.y,map_coord.end.y) };
	new_coord.end = { x: Math.max(map_coord.start.x,map_coord.end.x), y: Math.max(map_coord.start.y,map_coord.end.y) };

	var map_width = new_coord.end.x - new_coord.start.x;
	var map_height = new_coord.end.y - new_coord.start.y;
	
	$overlay.append('<div class="map" style="top:'+new_coord.start.y+'px;left:'+new_coord.start.x+'px;width:'+map_width+'px;height:'+map_height+'px;"></div>');
}

function drawGuide(){
	var rect = { width: 0, height: 0 };
	
	if (cursor.x >= source.width) rect.width = source.width - map_coord.start.x - 0.5;
	else if (cursor.x <= 0) rect.width = -map_coord.start.x;
	else{ rect.width = cursor.x - map_coord.start.x; }
	
	if (cursor.y >= source.height) rect.height = source.height - map_coord.start.y - 0.5;
	else if (cursor.y <= 0) rect.height = -map_coord.start.y;
	else{ rect.height = cursor.y - map_coord.start.y; }
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'blue';
	
	ctx.clearRect(0, 0, source.width, source.height);
	ctx.beginPath();
	ctx.rect(map_coord.start.x + 0.5, map_coord.start.y + 0.5, rect.width, rect.height);
	ctx.stroke();
	ctx.closePath();
	
	console.log(cursor.x, cursor.y)
}

// Functions
function init(){
	getOptions();
	getProps();	
	initAxis();
}

function getOptions(){
	_theme = $body.data('theme'),
	_unit = $body.data('unit'),
	_measure = $body.data('measure'),
	_unitIsRatio = _unit == 'ratio',
	_measureIsDrag = _measure == 'drag';	
}

function getProps(){
	source.width = $canvas.outerWidth(),
	source.height = $canvas.outerHeight();
	
	$canvas.attr({ width: source.width, height: source.height });
}

function setOptions(type, value){
	$body.data(type, value).attr('data-'+type, value);
	
	getOptions();
	initAxis();
}

function initAxis(){	
	var scale = { small: _unitIsRatio ? 5 : 10, big: _unitIsRatio ? 10 : 100 },
		scale_ratio = scale.big / scale.small,
		iteration = { x: Math.floor((_unitIsRatio ? 100 : source.width) / scale.small), y: Math.floor((_unitIsRatio ? 100 : source.height) / scale.small) },
		unit = _unitIsRatio ? '%' : 'px';

	$scale.empty();
	
	for (var i = 0; i < iteration.x; i++){
		$axis_x.small.append('<i></i>');
		if (i % scale_ratio == 0) $axis_x.big.append('<i><span>' + (i+scale_ratio) * scale.small + unit + '</span></i>');
	}	
	for (var i = 0; i < iteration.y; i++){
		$axis_y.small.append('<i></i>');
		if (i % scale_ratio == 0) $axis_y.big.append('<i><span>' + (i+scale_ratio) * scale.small + unit + '</span></i>');
	}
}

function getPos(e){
	cursor = { x: e.pageX - $overlay.offset().left, y: e.pageY - $overlay.offset().top };
	if (drawing) drawGuide();
}

function btnEvents(){
	var hasId = $(this).is('[id]'),
		token = hasId ? $(this).attr('id') : $(this).attr('class'),
		name = token.split('btn-')[1];
	
	switch(name){
	case 'unit-toggle':
		$('#radio-unit-' + (_unitIsRatio ? 'pixel' : 'ratio')).click();
		break;
	case 'info':
		openPopup();
		break;
	case 'settings':
		
		break;
	case 'popup-close':
		closePopup();
		break;
	}
}

function radioEvents(){
	var type = $(this).attr('name').split('-')[1],
		value = $(this).attr('id').split('-')[2];
	
	setOptions(type, value);
}

function openPopup(){
	$dim.add($popup).addClass('active');
}

function closePopup(){
	$dim.add($popup).removeClass('active');
}