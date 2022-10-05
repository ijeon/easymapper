/* Easy Mapper for HOMS/TIS (v20180220, Customized)
 * Author: Inpyo Jeon (inpyodev@gmail.com)
 * License: GPLv3 (Free Open Source License)
 * Browser Support: IE10+, Chrome (PC Only)
 * https://github.com/inpyodev/easymapper */

/* Global Variables */
var unit = '%'; // Ruler Unit (%, px)
var measure = 'drag'; // Measure Type (drag, click)
var imgWidth, imgHeight, filepath; // Source Image Properties
var isIE = false || !!document.documentMode; // IE Detection
var phase = 0; // Grid Drawing Phase (0: None, 1: Start, 2: End)
var editing = false; // Map Element Editing Status
var x, y; // Grid Position
var start, end; // Map Coords
var mapEl = []; // Map Elements Data
var clipboard = []; // Copied Map Element Data
var isImport = false; // Import Source Code Flag
var isPaste = false; // Paste Map Element Flag
var popup, shortcut, theme, language; // Preferences
var eventTarget = null;

/* Custom Preset */
popup = true;
shortcut = true;
theme = 'denim';
language = 'kor';

/* Event Bindings */
$(document)
    .on('click', '.btn-lb-open', openLightbox)
    .on('click', '.btn-lb-close', closeLightbox)
    .on('click', '.btn-lb-load', loadImage)
    .on('click', '.btn-lb-clear', clearWorkspace)
    .on('click', '.btn-lb-link', linkMap)
    .on('click', '.btn-select', selectUnitMeasure)
    .on('click', '#btn-toggle-unit', toggleUnit)
    .on('click', '.btn-lb-removemap', removeMap)
    .on('click', '.btn-clipboard', copyCode)
    .on('click', '.btn-lb-import', importCode)
    .on('click', '#input-link-url', linkCheck)
    .on('click', '#input-youtube-id', youtube)
    .on('click', '.radiolabel2 input', selectType)
    .on('dblclick', '.map', function(){ openLightbox('link'); return false; })
    .on('resizestop dragstop', '.map', editMap)
    .on('mouseenter mouseleave', '#imgwrap', toggleGrid)
    .on('mousemove', '#imgwrap', moveGrid)
    .on('mousedown', '.map', selectMap)
    .on('mousedown mouseup click', '#imgwrap', drawMap)
    .on('change', '#input-img-local', parsePath)
    .on('keydown', bindKeys);
$(window).on('load', setup); // Initialize

/* Functions */
/** Initializing Workspace **/
function langSelect(lang){ // Language Select
    if(typeof lang == 'string') var json = window[lang + '_navScript'];
    else var json = window[language + '_navScript'];

    $('.script').each(function(){
        var dat = $(this).data('script');
        $(this).text(json[dat]);
    });
}
function setup(){ // Setup Workspace
    // add.0604 이미지주소
    if($("[data-script=urlGenerate]").length == 0){
        $('#navbar ul').children().eq(3).after('<li><a class="btn-lb-open script" data-json="url" href="#" data-script="urlGenerate"></a></li>');
    }

    langSelect();
    clearWorkspace();

    var imgLarge = new Image();
    imgLarge.src = $('#imgwrap #img').attr("src");
    imgLarge.onload = function() {
        setTimeout(function(){
            imgWidth = $('#img').width();
            imgHeight = $('#img').height();

            $('.ruler.x').css({width: imgWidth});
            $('.ruler.y').css({height: imgHeight});
            $('#navbar').css({maxWidth: imgWidth + 20});
            drawRuler();
        }, 500);
    }
}
function clearWorkspace(){ // Clear Workspace
    $('#maps').empty();
    mapEl = [];
    tagScript = '';
    mapScript = '';
    closeLightbox();
    return false;
}
function drawRuler(){ // Draw Rulers
    $('.ruler').empty();
    $('#btn-toggle-unit').text(unit);
    if (unit == '%'){
        $('.ruler').removeClass('px').addClass('perc');
        for(var i=0; i<21; i++){
            if (i%2 == 0) $('.ruler').append('<li class="long"><span>'+ i*5 +'%</span></li>');
            else $('.ruler').append('<li></li>');
        }
    } else {
        $('.ruler').removeClass('perc').addClass('px');
        for(var i=0; i<imgWidth/10+1; i++){
            if (i%10 == 0) $('.ruler.x').append('<li class="long"><span>'+ i*10 +'px</span></li>');
            else $('.ruler.x').append('<li></li>');
        }
        for(var i=0; i<imgHeight/10+1; i++){
            if (i%10 == 0) $('.ruler.y').append('<li class="long"><span>'+ i*10 +'px</span></li>');
            else $('.ruler.y').append('<li></li>');
        }
    }
}
function loadImage(){ // Load Source Image
    var imgSrc = $(this).parents('#lightbox').hasClass('url') ? $('#input-img-url').val().trim() : filepath;
    $('#img').attr('src', imgSrc).on('load', setup);
    closeLightbox();
    return false;
}
function parsePath(e){ // Get Source Image Filepath
    var URL = window.webkitURL || window.URL;
    filepath = URL.createObjectURL(e.target.files[0]);
    $('#label-img-local > p').text('File loaded');
    $('#label-img-local').addClass('active');
}
function importCode(){ // Import Source Code
    $('#imported').html($('#input-code').val());
    var imgSrc = $('#imported').find('img').attr('src');
    var maps = [];
    $('#img').attr('src', imgSrc).on('load', importSetup);
    return false;
}
function importSetup(){ // Import Setup
    var isTag = $('#imported').find('a, div[data-youtube]').length > 0;
    var els = isTag ? $('#imported').find('a, div[data-youtube]') : $('#imported').find('area');
    setup();
    isImport = true;
    for(var i=0; i < els.length; i++){
        var el = els.eq(i);
        var coords = [];
        coords[0] = isTag ? parseInt(el.css('left')) : el.attr('coords').split(',')[0];
        coords[1] = isTag ? parseInt(el.css('top')) : el.attr('coords').split(',')[1];
        coords[2] = isTag ? parseInt(el.css('left')) + parseInt(el.css('width')) : el.attr('coords').split(',')[2];
        coords[3] = isTag ? parseInt(el.css('top')) + parseInt(el.css('height')) : el.attr('coords').split(',')[3];
        var link = el.attr('href');
        var youtube = el.attr('data-youtube');
        var target = el.attr('target');
        var type = el.attr('data-linktype');
        var start = { x: coords[0], y: coords[1] };
        var end = { x: coords[2], y: coords[3] };
        createMap(start, end);
        if (el.tagName === 'a' && link.indexOf('//') > 0) {
            mapEl[i][4] = link;
            $('.map').eq(i).addClass('linked');
        }
        mapEl[i][5] = target;
        mapEl[i][6] = type;
        mapEl[i][7] = youtube;
    }
    isImport = false;
}

/** Grid **/
function moveGrid(e){ // Move Grid
    x = e.pageX - 20;
    y = e.pageY - 54;
    setGrid();
    setCoords();
}
function toggleGrid(e){ // Show & Hide Grid
    if (e.type == 'mouseenter' && $('.ui-draggable-dragging').length + $('.ui-resizable-resizing').length == 0) $(this).addClass('active');
    else {
        $(this).removeClass('active');
        resetGrid();
    }
}
function setGrid(){ // Set Grid
    $('.axis.x.active').css({ left: x });
    $('.axis.y.active').css({ top: y });
}
function setCoords(){ // Set & Show Coords
    var xp = (x / imgWidth * 100).toFixed(2);
    var yp = (y / imgHeight * 100).toFixed(2);
    var coords = (unit == '%') ? xp +'%, '+ yp +'%' : x +'px, '+ y +'px';
    $('#coords').css({ left: x + 1, top: y + 1 }).text(coords);
    if (x + $('#coords').outerWidth() > imgWidth) $('#coords').css({ left: x - $('#coords').outerWidth() });
    if (y + $('#coords').outerHeight() > imgHeight) $('#coords').css({ top: y - $('#coords').outerHeight() });
}
function resetGrid(){ // Reset Grid
    $('.axis.a').addClass('active');
    phase = 0;
    setGrid();
    return false;
}

/** Map Elements **/
function drawMap(e){ // Drawing Map Element
    if (phase == 0){
        if ((measure == 'drag' && e.type == 'mousedown') || (measure == 'click' && e.type == 'click')){
            $('.map').removeClass('selected');
            start = { x: x, y: y };
            $('.axis.a').removeClass('active');
            phase = 1;
        }
    } else if (phase == 1){
        if ((measure == 'drag' && e.type == 'mouseup') || (measure == 'click' && e.type == 'click')){
            if (Math.abs(start.x - x) > 10 && Math.abs(start.y - y) > 10){ // Prevent False Clicking
                end = { x: x, y: y };
                $('.axis.a').addClass('active');
                phase = 0;
                createMap(start, end);
            } else resetGrid();
        }
    }
    return false;
}
function createMap(start, end){ // Create A New Map Element
    var mapId = mapEl.length;
    var width = Math.abs(start.x - end.x) - 1; // Box-Sizing Fix -1px
    var height = Math.abs(start.y - end.y) - 1;
    var top = Math.min(start.y, end.y);
    var left = Math.min(start.x, end.x);
    var el = '<li id="map_' +
        mapId + '" class="map unlinked" style="top:' +
        top + 'px; left:' +
        left + 'px; width:' +
        width + 'px; height:' +
        height + 'px"><span class="mapid">' +
        parseInt(mapId+1) + '</span><a class="btn-map-remove btn-lb-open" data-json="remove" href="#">×</a><a class="btn-map-resize" href="#">⤡</a><a class="btn-map-link btn-lb-open" data-json="link" href="#">🔗</a></li>';
    $('#maps').append(el);
    $('.map').removeClass('selected');
    $('#map_'+mapId).addClass('selected').draggable({ containment: '#canvas' }).resizable({ containment: '#canvas', minWidth: 20, minHeight: 20 });
    mapEl.push([top, left, width, height, '', '_self']);
    if(mapEl[mapId][2] < 40 || mapEl[mapId][3] < 30) $('.map.selected').addClass('small');
    else $('.map.selected').removeClass('small');
    if (popup && (!isImport && !isPaste)) openLightbox('link');
}
function editMap(){ // Edit Map Element Size & Position Callback
    var top = parseInt($('.map.selected').css('top'));
    var left = parseInt($('.map.selected').css('left'));
    var width = parseInt($('.map.selected').css('width'));
    var height = parseInt($('.map.selected').css('height'));
    mapEl[getMapId()][0] = top;
    mapEl[getMapId()][1] = left;
    mapEl[getMapId()][2] = width;
    mapEl[getMapId()][3] = height;
    if(mapEl[getMapId()][2] < 40 || mapEl[getMapId()][3] < 30) $('.map.selected').addClass('small');
    else $('.map.selected').removeClass('small');
}
function removeMap(){ // Remove Selected Map Element
    mapEl.splice(getMapId(), 1);
    $('.map.selected').remove();
    for(i=0; i<mapEl.length; i++){
        $('.map').eq(i).attr('id', 'map_'+i);
        $('.map').eq(i).find('.mapid').text(i+1);
    }
    closeLightbox();
    return false;
}
function selectMap(){ // Select Map Element
    $('.map').removeClass('selected');
    $(this).addClass('selected');
}
function linkMap(){ // Save Map Element Link Data
    var link = $('#input-link-url').val();
    var youtube = $('#input-youtube-id').val();
    var target = $('input[name="radio-link"]:checked').val();
    var type = $('input[name="radio-linktype"]:checked').val();

    if (link.indexOf('//') > 0) {
        if (link.split('//')[1].length == 0 && youtube.length == 0) {
            $('#err-link').addClass('active');
        } else{
            if (link.split('//')[2]) link = link.substring(link.indexOf('//')+2); // User Error Fix
            mapEl[getMapId()][4] = link;
            mapEl[getMapId()][5] = target;
            mapEl[getMapId()][6] = type;
            mapEl[getMapId()][7] = youtube;
            $('.map.selected').addClass('linked');
            closeLightbox();
        }
    } else $('#err-link').addClass('active');
    return false;
}
function loadMap(){ // Load Map Element Link Data
    var link = mapEl[getMapId()][4];
    var target = mapEl[getMapId()][5];
    if (link.length > 0) $('#input-link-url').val(link);
    $('input[name="radio-link"][value=' + target + ']').prop("checked", true);
}
function getMapId(){ // Get Selected Map Element Id
    return $('.map.selected').find('.mapid').text() - 1;
}
function duplicateMap(step){ // Copy & Paste Map Element
    if (step == 'copy'){
        clipboard = mapEl[getMapId()];
    } else if (clipboard.length > 0) {
        var start = { x: clipboard[1], y: clipboard[0] };
        var end = { x: clipboard[1] + clipboard[2] + 1, y: clipboard[0] + clipboard[3] + 1 };
        isPaste = true;
        createMap(start, end);
        isPaste = false;
    }
}

/** Url Generate **/
function generateUrl(){
    var imgSrc = $('#img').attr('src').indexOf('http') > -1 ? $('#img').attr('src') : '#ERR';
    var imgTag = '<img src="' + imgSrc + '" alt="">';

    $('#img-url').text(imgSrc);
    $('#img-tag').text(imgTag);
}

/** Code Generate **/
function generateCode(){ // Source Code Generate
    var imgSrc = $('#img').attr('src').indexOf('http') > -1 ? $('#img').attr('src') : '#ERR';
    var tagElement = '';
    var mapElement = '';
    var mapHash = (+new Date).toString(36);
    for(i=0;i<mapEl.length;i++){
        var elSrc = mapEl[i][4].length > 0 ? mapEl[i][4] : '#ERR';
        var elTarget = mapEl[i][5];
        var elType = mapEl[i][6];
        var elYoutube = mapEl[i][7];
        var tagElTop = (mapEl[i][0] / imgHeight * 100).toFixed(2);
        var tagElLeft = (mapEl[i][1] / imgWidth * 100).toFixed(2);
        var tagElWidth = (mapEl[i][2] / imgWidth * 100).toFixed(2);
        var tagElHeight = (mapEl[i][3] / imgHeight * 100).toFixed(2);
        var mapElStartX = mapEl[i][1];
        var mapElStartY = mapEl[i][0];
        var mapElEndX = mapEl[i][1] + mapEl[i][2];
        var mapElEndY = mapEl[i][0] + mapEl[i][3];

        var startTag = (elType == '_youtube') ? 'div' : 'a href="' + elSrc + '"';
        var closeTag = (elType == '_youtube') ? 'div' : 'a';

        tagElement += '<' + startTag + ' data-linktype="'+ elType +'" style="position:absolute;z-index:1;top:' + tagElTop + '%;left:' + tagElLeft + '%;width:' + tagElWidth + '%;height:' + tagElHeight + '%;font-style:normal;' +
            ((elType == "_href") ? 'background:url(about:blank);display:block;" target="' + elTarget + '">' : '" data-youtube="'+ elYoutube +'">') +
            '</'+ closeTag +'>';

        mapElement += '<area shape="rect" coords="' + mapElStartX + ',' + mapElStartY + ',' + mapElEndX + ',' + mapElEndY + '" href="' + elSrc + '" target="' + elTarget + '">';
    }
    var tagScript = '<div data-imgheight="'+ imgHeight +'" style="position:relative;font-size:0;margin:0 auto;padding:0;max-width:' +
        imgWidth + 'px;font-style:normal;"><img src="' +
        imgSrc + '" style="width:100%;font-style:normal;">' +
        tagElement + '</div>';
    var mapScript = '<img src="' +
        imgSrc +'" usemap="#' +
        mapHash +'"><map name="' +
        mapHash + '">' +
        mapElement + '</map>';
    $('#code-tag').text(tagScript);
    $('#code-map').text(mapScript);
    if ($('#lb-content textarea').val().indexOf('#ERR') > -1) {
        $('.errors').addClass('active');
        $('#lb-content textarea').addClass('err');
    }
    submitData = tagScript;
}
function copyCode(){ // Copy Code To Clipboard
    $('#lightbox').find('textarea').select();
    document.execCommand('Copy');
    return false;
}

/** Lightbox **/
function openLightbox(jsonId){ // Create & Open Lightbox
    if(typeof jsonId == 'object') jsonId = $(this).data('json');
    var json = window[language + '_' + jsonId + 'Json'];

    var lb = '<div id="lb-title"><p>' +
        json.title + '</p><a class="btn-lb-close" href="#">×</a></div><div id="lb-content">' +
        json.content + '</div><div id="lb-btnset" class="' +
        json.btnSet + '"><a id="btn-lb-no" class="' +
        json.btnNoClass + '" data-json="' +
        json.btnNoJson + '" href="#">' +
        json.btnNo + '</a><a id="btn-lb-yes" class="' +
        json.btnYesClass + '" data-json="' +
        json.btnYesJson + '" href="#">' +
        json.btnYes + '</a></div>';

    closeLightbox();
    $('#lightbox').addClass(jsonId).html(lb);
    $('body').addClass('dimmed');
    if (json.callback){ window[json.callback](); }
    if ($('#lightbox').find('input[type="text"]').length > 0){
        //del.0529
        //$('#lightbox').find('input[type="text"]').eq(0).select();

        //add.0529
        var len = $('#lightbox').find('input[type="text"]').eq(0).val().length;
        $('#lightbox').find('input[type="text"]').eq(0).trigger('click');
        $('#lightbox').find('input[type="text"]').eq(0).focus();
        $('#lightbox').find('input[type="text"]').eq(0).get(0).setSelectionRange(len, len);
    }
    if ($('#lightbox').find('textarea').length > 0) $('#lightbox').find('textarea').focus();
    return false;
}
function closeLightbox(){ // Close & Reset Lightbox
    if ($('#lightbox').hasClass('settings')) discardSettings();
    $('body').removeClass('dimmed');
    $('#lightbox').empty();
    $('#lightbox').removeClass();
    return false;
}

/** General Control **/
function selectUnitMeasure(){ // Set Unit & Measure Type
    var value = ($(this).closest('ul').attr('class') == 'measure') ? $(this).data('script') : $(this).text().toLowerCase();
    window[$(this).closest('ul').attr('class')] = value;
    $(this).parent().addClass('active').siblings().removeClass('active');
    if ($(this).closest('ul').attr('class') == 'unit') drawRuler();
    return false;
}
function toggleUnit(){ // Toggle Scale Unit
    unit = (unit == '%') ? 'px' : '%';
    $('.unit').find('li').toggleClass('active');
    drawRuler();
    setCoords();
    return false;
}
function bindKeys(e){ // Key Bindings
    var isDialog = $('body').hasClass('dimmed');
    var isSelect = !isDialog && $('.map.selected').length > 0;
    if (shortcut){
        switch (e.which){
            case 13: // Enter: Submit, Edit Map Area Link
                if (isDialog && $('#lightbox').find('textarea').length == 0) {
                    $('#btn-lb-yes').trigger('click');
                    return false;
                }
                if (isSelect) openLightbox('link');
                break;
            case 27: // ESC: Close Lightbox, Cancel Map Drawing
                if (isDialog) closeLightbox();
                if (phase == 1) resetGrid();
                break;
            case 46: // DEL: Remove Selected Map Element
                if (isSelect) openLightbox('remove');
                break;
            case 67: // C: (Ctrl+C) Copy Selected Map Element
                if (e.ctrlKey && isSelect) duplicateMap('copy');
                break;
            case 86: // V: (Ctrl+V) Paste Map Element
                if (e.ctrlKey && !isDialog) duplicateMap('paste');
                break;
            case 85: // U: Toggle Scale Unit
                if (!isDialog) toggleUnit();
                break;
            case 112: // F1: Keyboard Shortcuts
                openLightbox('shortcut');
                return false;
                break;
        }
    }
}

/* HOMS/TIS 코드 적용 */
var submitData ="";
$(document).on('click', '.btn-insertcode', ImgSubmit); // 이미지 소스 로드 함수 호출
function ImgSubmit(){
    if ($('.tags .errors').hasClass('active')) {
        alert('에러 내용을 확인하시기 바랍니다.');
    } else {
        opener.Editor.modify({"content":submitData });
        close();
    }
}

$(function(){
    $('.measure').append('<li><a class="btn-select script" href="#" data-script="click"></a></li>');
});

function linkCheck(){
    $("#input-link-url").attr({ disabled : false }).focus();
    $("#input-youtube-id").attr({ disabled : true });

    $('input[name="radio-link"]:disabled').prop("disabled", false);
    $('input[name="radio-link"]').eq(0).prop("disabled", true);
    $('input[name="radio-link"]').eq(1).prop("checked", true);
}
function youtube(){
    $("#input-youtube-id").attr({ disabled : false }).focus();
    $("#input-link-url").attr({ disabled : true }).val('http://');

    $('input[name="radio-link"]').eq(0).prop("checked", true);
    $('input[name="radio-link"]').eq(0).prop("disabled", false);
    $('input[name="radio-link"]:not(:eq(0))').prop("disabled", true);
}
function selectType(e){
    if($(this).val() === '_href'){
        if($("#input-youtube-id").val().length > 0){
            $('#err-link2').text('⚠ "YOUTUBE" 입력 내용 삭제 후 진행해 주세요.').addClass('active');

            return false;
        }

        linkCheck();
    } else if($(this).val() === '_youtube'){
        var link = $('#input-link-url').val();
        if (link.indexOf('//') > 0) {
            if (link.split('//')[1].length > 0){
                $('#err-link2').text('⚠ "링크" 입력 내용 삭제 후 진행해 주세요.').addClass('active');

                return false;
            }
        }

        youtube();
    }
    e.stopPropagation();
}