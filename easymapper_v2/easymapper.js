// 옵션
var _theme,
	_unit,
	_measure,
	_unitIsRatio = new Boolean(),
	_measureIsDrag = new Boolean();

// 축약
var $body = $('body'),
	$axis_x = { small: $('.axis.x .scale.small'), big: $('.axis.x .scale.big') },
	$axis_y = { small: $('.axis.y .scale.small'), big: $('.axis.y .scale.big') },
	$scale = $('.scale'),
	$canvas = $('#canvas'),
	$overlay = $('#overlay'),
	$dim = $('#dim'),
	$popup = $('.popup'),
    $total = $('#total');

// 전역 변수
var source = new Array(),
	cursor = new Array(),
	map_coord = new Array(),
    map_array = new Array(),
	isDrawing = false,
    isDrawable = true,
    map_id = 0,
    initialHtml;

// Canvas 선언
var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

// 이벤트 바인딩
$(window)
    .on('load', init);

$(document)
    .on('mousemove', getPos)
	.on('click', 'button', btnEvents)
	.on('change', '#menu input[type=radio]', optChange)
	.on('mousedown', '#overlay', drawStart)
	.on('mouseup', drawEnd)
    .on('contextmenu', drawCancel)
    .on('mouseenter mouseleave', '.map', drawStop)
    .on('click', '#dim', closePopup);

// 함수
function init(){ // 초기화
	getOptions();
	getProps();	
	initAxis();
}

function getOptions(){ // 옵션 레퍼런스
    _theme = $body.data('theme'),
    _unit = $body.data('unit'),
    _measure = $body.data('measure'),
    _unitIsRatio = _unit == 'ratio',
    _measureIsDrag = _measure == 'drag';
}

function getProps(){ // 소스 크기 반환
	source.width = $canvas.outerWidth(),
	source.height = $canvas.outerHeight();
	
	$canvas.attr({ width: source.width, height: source.height }); // 캔버스 제어시 attr 명시 필수
}

function initAxis(){ // 눈금 작도, 초기화
	var scale = { small: _unitIsRatio ? 5 : 10, big: _unitIsRatio ? 10 : 100 },
		scale_ratio = scale.big / scale.small,
		iteration = { x: Math.floor((_unitIsRatio ? 100 : source.width) / scale.small), y: Math.floor((_unitIsRatio ? 100 : source.height) / scale.small) },
		unit = _unitIsRatio ? '%' : 'px';

	$scale.empty();

	for (var i = 0; i < iteration.x; i++){
		$axis_x.small.append('<i></i>');

		if (i % scale_ratio == 0)
            $axis_x.big.append('<i><span>' + (i+scale_ratio) * scale.small + unit + '</span></i>');
	}

	for (var i = 0; i < iteration.y; i++){
		$axis_y.small.append('<i></i>');

		if (i % scale_ratio == 0)
            $axis_y.big.append('<i><span>' + (i+scale_ratio) * scale.small + unit + '</span></i>');
	}
}

function drawStart(e){ // 맵 작도 시작
    if (e.which == 1 && isDrawable){ // 마우스 좌클릭
        map_coord.start = { x: cursor.x, y: cursor.y }; // 시작 좌표 지정
        isDrawing = true;
    }
}

function drawEnd(e){ // 맵 작도 종료
    if (e.which == 1 && isDrawing){
        var end_coord = new Array();

        if (cursor.x > source.width)
            end_coord.x = source.width;
        else if (cursor.x < 0)
            end_coord.x = 0;
        else
            end_coord.x = cursor.x;

        if (cursor.y > source.height)
            end_coord.y = source.height;
        else if (cursor.y < 0)
            end_coord.y = 0;
        else
            end_coord.y = cursor.y;

        map_coord.end = { x: end_coord.x, y: end_coord.y }; // 종료 좌표 지정
        createMap(map_coord.start, map_coord.end); // 맵 생성
    }
}

function drawCancel(){ // 맵 작도 취소
    isDrawing = false;
    ctx.clearRect(0, 0, source.width, source.height);

    return false;
}

function drawStop(e){ // 맵 마우스오버
    if (e.type == 'mouseenter' && !isDrawing)
        isDrawable = false;
    else
        isDrawable = true;
}

function createMap(start_coord, end_coord){ // 새로운 맵 생성
    var new_map = new Array();
    new_map.id = map_id,
    new_map.start = { x: Math.min(start_coord.x, end_coord.x), y: Math.min(start_coord.y, end_coord.y) },
    new_map.end = { x: Math.max(start_coord.x, end_coord.x), y: Math.max(start_coord.y, end_coord.y) },
    new_map.width = new_map.end.x - new_map.start.x,
    new_map.height = new_map.end.y - new_map.start.y;

    if (new_map.width >= 30 && new_map.height >= 30){
        $overlay.append('<div data-mapid="' + new_map.id + '" class="map" style="top:' + new_map.start.y + 'px;left:' + new_map.start.x + 'px;width:' + new_map.width + 'px;height:' + new_map.height + 'px;"><button class="btn-map-link">&#128279;&#xFE0E;</button><button class="btn-map-delete">&#10005;</button></div>');
        updateMap('add', new_map);
    }

    drawCancel();
}

function updateMap(type, map){ // 맵 인터랙션
    var $map = $('.map[data-mapid=' + map.id + ']');

    switch(type) {
        case 'add': // 맵 추가
            map_array.push(map); // 맵 목록에 추가
            map_id++;
            $map // jQuery UI 드래그, 리사이즈
                .draggable({ containment: $overlay, stop: mapCollide })
                .resizable({ containment: $overlay, handles: "se", minWidth: 30, minHeight: 30, resize: mapMinimized, stop: mapCollide }); // (jQuery UI 보더(4px) 계산식 임의 추가)

            break;
        case 'delete': // 맵 삭제
            var idx = map_array.indexOf(map);

            if (idx > -1)
                map_array.splice(idx, 1); // 맵 목록에서 제거

            $map.draggable('destroy').resizable('destroy').remove();
            isDrawable = true;

            break;
        case 'edit':

            break;
    }

    mapCollide($map); // 맵 중첩 처리
    $total.text('Map Count: ' + map_array.length);
}

function mapCollide(){ // 맵 중첩 처리
    $('.map').each(function(){
        var $this = $(this),
            thisRect = $(this)[0].getBoundingClientRect();

        $this.removeClass('overlaping');

        for (var i = 0; i < map_array.length; i++){
            var $el = $('.map[data-mapid=' + map_array[i].id + ']'),
                elRect = $el[0].getBoundingClientRect();

            if (map_array[i].id != $this.data('mapid') && thisRect.top < elRect.bottom && thisRect.right > elRect.left && thisRect.bottom > elRect.top && thisRect.left < elRect.right)
                $this.add($el).addClass('overlaping');
        }
    });
}

function mapMinimized(){ // 맵 최소화
    var $link = $(this).find('.btn-map-link');

    if ($(this).outerWidth() < 45 && $(this).outerHeight() < 45)
        $link.addClass('minimized');
    else
        $link.removeClass('minimized');
}

function drawGuide(){ // 가이드 작도
    var rect = { width: 0, height: 0 },
        guideColor = getComputedStyle($body[0], null).getPropertyValue('--bd-guide'),
        guideColorDisabled = getComputedStyle($body[0], null).getPropertyValue('--bd-guide-disabled');

    if (cursor.x > source.width)
        rect.width = source.width - map_coord.start.x;
    else if (cursor.x < 0)
        rect.width = -map_coord.start.x;
    else
        rect.width = cursor.x - map_coord.start.x;

    if (cursor.y > source.height)
        rect.height = source.height - map_coord.start.y;
    else if (cursor.y < 0)
        rect.height = -map_coord.start.y;
    else
        rect.height = cursor.y - map_coord.start.y;

    ctx.lineWidth = 1;
    ctx.strokeStyle = Math.abs(rect.width) < 30 || Math.abs(rect.height) < 30 ? guideColorDisabled : guideColor;
    ctx.clearRect(0, 0, source.width, source.height);
    ctx.beginPath();
    ctx.rect(map_coord.start.x, map_coord.start.y, rect.width, rect.height);
    ctx.stroke();
    ctx.closePath();
}

function setOptions(type, value){ // 옵션 설정
    $body.data(type, value).attr('data-' + type, value);
    getOptions();
    initAxis();
}

function openPopup(id){ // 팝업 열기
    var $thisPopup = $('#popup-' + id);
    initialHtml = $thisPopup.html();

	$dim.add($thisPopup).addClass('active');
    $thisPopup.find('input, textarea').first().select();
}

function closePopup(){ // 팝업 닫기
    var $thisPopup = $('.popup.active');

	$dim.add($popup).removeClass('active');

    if($thisPopup.hasClass('clear'))
        $thisPopup.html(initialHtml);
}

function optChange(){ // 라디오 버튼
    var type = $(this).attr('name').split('-')[1],
        value = $(this).attr('id').split('-')[2];

    setOptions(type, value);
}

function getPos(e){ // 커서 상대위치 반환
    cursor = { x: e.pageX - $overlay.offset().left, y: e.pageY - $overlay.offset().top };

    if (isDrawing)
        drawGuide(); // 가이드 작도
}

function btnEvents(){ // 버튼 이벤트
    var hasId = $(this).is('[id]'),
        token = hasId ? $(this).attr('id') : $(this).attr('class'), // id가 없을 경우 class를 토큰으로 사용
        name = token.split('btn-')[1];

    switch(name){
        case 'unit-toggle': // 단위 토글
            $('#radio-unit-' + (_unitIsRatio ? 'pixel' : 'ratio')).click();

            break;
        case 'popup-close': // 팝업 닫기
        case 'cancel':
            closePopup();

            break;
        case 'map-delete': // 맵 삭제
            var mapid = $(this).parent().data('mapid'),
                map = map_array.find(item => item.id == mapid);

            updateMap('delete', map);

            break;
        case 'info': // 정보
        case 'settings': // 설정
        case 'map-link': // 맵 링크
            openPopup(name);
    
            break;
    }
}