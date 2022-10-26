/* 전역 변수 선언 */
var unit = 'ratio', // 좌표 단위 옵션 / fixed
    draw = 'drag', // 매핑 방식 옵션 / click
    filepath, // 미디어 경로
    fakepath, // 미디어 가상 경로
    fileurl; // 미디어 URL

/* 마크업 저장소 선언 */
var _mediaItem, // 빈 미디어 컨트롤
    _mediaList, // 미디어 리스트
    _mediaInput, // 미디어 인풋 컨트롤
    _mediaInputUpload, // 빈 미디어 업로드 패널
    _mediaInputUrl; // 빈 미디어 URL 패널

/* 이벤트 바인딩 */
$(window).on('load', init); // SPA 초기화
$(document)
    .on('click', 'header nav button', navBtnEvent) // 헤더 - 버튼 이벤트
    .on('change', 'header nav input[type=radio]', navRadioEvent) // 헤더 - 라디오 이벤트
    .on('click', '.popup-close, .popup-discard', closePopup) // 팝업 - 닫기
    .on('click', '#media-add', addMedia) // 팝업: 미디어 관리 - 빈 미디어 컨트롤 추가
    .on('click', '.media-delete', removeMedia) // 팝업: 미디어 관리 - 미디어 삭제
    .on('click', '.media-upload, .media-url', setMediaPopup) // 팝업: 미디어 관리 - 미디어 소스 패널 열기
    .on('click', '.media-input-apply', setMediaApply) // 팝업: 미디어 관리 - 미디어 소스 등록
    .on('click', '.media-input-discard', setMediaDiscard) // 팝업: 미디어 관리 - 미디어 소스 등록 취소
    .on('click', '#popup-dashboard .popup-apply', applyMedia) // 팝업: 미디어 관리 - 미디어 목록 적용
    .on('change', 'input[type=file]', getFilepath) // 팝업: 미디어 관리 - 미디어 업로드
;

/* 공통 */
$.fn.turn = function(opt){ // active 클래스 제어
    if (opt == 'on') return this.addClass('active');
    else return this.removeClass('active');
}

$.fn.backup = function(html){ // 마크업 백업
    window[html] = this.html();
    return this; // 체이닝
}

function init(){ // SPA 초기화
    $('#media-list')
        .sortable({ containment: '#popup-load-dashboard', handle: '.media-handle' }) // 미디어 순서 정렬 모듈 초기화
        .backup('_mediaItem') // 빈 미디어 컨트롤 저장
        .backup('_mediaList') // 빈 미디어 리스트 저장
        .find('.media-input[type=media-upload]').backup('_mediaInputUpload') // 빈 미디어 업로드 패널
        .find('.media-input[type=media-url]').backup('_mediaInputUrl'); // 빈 미디어 URL 패널
    rulerInit(); // 눈금자 초기화
}

/* 헤더 */
function navBtnEvent(){ // 버튼 이벤트
    openPopup('popup-' + $(this).attr('id')); // 팝업 열기
}

function navRadioEvent(){ // 라디오 이벤트
    var key = $(this).attr('id').split('-')[1],
        value = $(this).attr('id').split('-')[2];

    window[key] = value; // 옵션 설정
    rulerInit(); // 눈금자 재정의
}

/* 팝업 */
function openPopup(id){ // 열기
    $('#dim, #' + id).turn('on');

    switch (id){
        case 'popup-load-dashboard':
            break;
        case 'popup-load-source':
            break;
    }
}

function closePopup(){ // 닫기, 변경 취소
    var id = $(this).parents('.popup').attr('id');

    $('#dim, .popup.active').turn('off');

    switch (id){
        case 'popup-load-dashboard':
            $('#media-list').html(_mediaList); // 미디어 리스트 복원
            break;
        case 'popup-load-source':
            break;
    }
}

/* 팝업: 미디어 관리 */
function addMedia(){ // 빈 미디어 컨트롤 추가
    $('#media-list').append(_mediaItem);
}

function removeMedia(){ // 미디어 삭제
    if ($('.media-item').length == 1) alert('한 개 이상의 미디어를 등록해야 합니다');
    else if (window.confirm('이 항목을 목록에서 삭제하시겠습니까?\n삭제된 미디어는 복구할 수 없습니다.')) $(this).parent().remove();
}

function setMediaPopup(){ // 미디어 소스 패널 열기
    var panetype = $(this).attr('class'), // 현재 패널 타입
        path = $(this).parent().attr('path'), // 소스 경로
        $pane = $(this).siblings('.media-input[type=' + panetype + ']'), // 등록 패널
        $input = $pane.find('input'); // 소스 인풋

    $('.popup.active').addClass('submerged'); // 팝업 딤 스크린 열기
    $pane
        .turn('on') // 패널 열기
        .backup('_mediaInput'); // 마크업 백업

    switch (panetype){
        case 'media-upload':
            if (!path) $input.click(); // 초기 업로드
            break;
        case 'media-url':
            $input.select(); // 블록 선택
            break;
    }
}

function setMediaApply(){ // 미디어 소스 등록
    var $pane = $(this).parent(),
        $other = $(this).parent().siblings('.media-input'),
        $input = $pane.find('input'),
        panetype = $pane.attr('type'),
        path,
        pathspan;

    $('.popup.active').removeClass('submerged'); // 팝업 딤 스크린 닫기

    switch (panetype){
        case 'media-upload':
            path = filepath;
            pathspan = fakepath;
            $other.html(_mediaInputUrl);
            break;
        case 'media-url':
            path = $input.val();
            pathspan = path;
            $other.html(_mediaInputUpload);
            break;
    }

    $pane.turn('off').parent().attr({ type: panetype, path: path }).find('.media-path').text(pathspan);
}

function setMediaDiscard(){ // 미디어 소스 등록 취소
    var $pane = $(this).parent();

    $pane.turn('off').html(_mediaInput);
    $('.popup').removeClass('submerged');
}

function applyMedia(){ // 미디어 목록 적용
    if ($('.media-item[path=""]').length > 0)
        alert('등록되지 않은 항목이 존재합니다.');
    else if (window.confirm('현재 미디어 목록을 적용하시겠습니까?\n변경된 이미지에 적용된 맵은 일괄 삭제됩니다.')){
        $('#media-list').backup('_mediaList');
    }
}

function getFilepath(e){ // 미디어 업로드
    var url = window.webkitURL || window.URL;

    if ($(this).val()){
        fakepath = $(this).val().replace('fakepath', '...');
        filepath = url.createObjectURL(e.target.files[0]);
        $(this).siblings('span').text(fakepath);
    }
}

/* 메인 */
function rulerInit(){ // 눈금자 초기화, 재정의
    // 코드 업데이트
}