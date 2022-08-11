// 옵션 선언
var _unitIsRatio = new Boolean(), // 단위 기본값(퍼센트) 여부
    _measureIsDrag = new Boolean(), // 제도방식 기본값(드래그) 여부
    _theme; // 테마

// 요소 축약
var $body = $('body'),
    $axis_x = $('.axis.x'),
    $axis_x_scale_small = $('.axis.x .scale.small'),
    $axis_x_scale_big = $('.axis.x .scale.big'),
    $axis_y = $('.axis.y'),
    $axis_y_scale_small = $('.axis.y .scale.small'),
    $axis_y_scale_big = $('.axis.y .scale.big'),
    $canvas = $('#canvas'),
    $overlay = $('#overlay');

/ 전역 변수 선언
var axis_x_width, // x축 길이
    axis_y_height, // y축 길이
    cursor_x, // 커서 x 위치
    cursor_y, // 커서 y 위치
    guide_color, // 가이드 색상
    guide_color_active,
    guide_color_disabled,
    coord_start,
    coord_end;