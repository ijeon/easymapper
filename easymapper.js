/* Easy Mapper (v20180206a)
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

$(document)
	.on('click', '#test', test);
function test(){
	var mapId = $('.map.selected').find('.mapid').text() - 1;
	console.log(mapId, mapEl[mapId]);
}

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
	.on('dblclick', '.map', function(){ openLightbox('link'); })
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
function setup(){ // Setup Workspace
	clearWorkspace();
	imgWidth = $('#img').width();
	imgHeight = $('#img').height();
	$('.ruler.x').css({ width: imgWidth });
	$('.ruler.y').css({ height: imgHeight });
	$('#navbar').css({ maxWidth: imgWidth + 20 });
	drawRuler();
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
	var imgsrc = $(this).parents('#lightbox').hasClass('url') ? $('#input-img-url').val() : filepath;	
	$('#img').attr('src', imgsrc).on('load', setup);
	closeLightbox();
	return false;
}
function parsePath(e){ // Get Source Image Filepath
	var URL = window.webkitURL || window.URL;
    filepath = URL.createObjectURL(e.target.files[0]);    
    $('#label-img-local > p').text('File loaded');
    $('#label-img-local').addClass('active');
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
	var yp = (y / imgWidth * 100).toFixed(2);
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
	var target = $('input[name="radio-link"]:checked').val();
	if (link.indexOf('//') > 0) {
		if (link.split('//')[1].length == 0) {
			$('#err-link').addClass('active');
		} else {
			mapEl[getMapId()][4] = link;
			mapEl[getMapId()][5] = target;
			if (link.split('//')[1].length > 0) $('.map.selected').addClass('linked');
			else $('.map.selected').removeClass('linked');
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
function duplicateMap(step){
	if (step == 'copy'){
		clipboard = mapEl[getMapId()];
	} else if (clipboard.length > 0) {
		var start = { x: clipboard[1], y: clipboard[0] };
		var end = { x: clipboard[1] + clipboard[2] + 1, y: clipboard[0] + clipboard[3] + 1 };
		createMap(start, end);
	}
}

/** Code Generate **/
function generateCode(){
	var imgSrc = $('#img').attr('src').indexOf('http') > -1 ? $('#img').attr('src') : '#ERR';
	var tagElement = '';
	var mapElement = '';
	var mapHash = (+new Date).toString(36);
	for(i=0;i<mapEl.length;i++){
		var elSrc = mapEl[i][4].length > 0 ? mapEl[i][4] : '#ERR';
		var elTarget = mapEl[i][5];
		var tagElTop = (mapEl[i][0] / imgHeight * 100).toFixed(2);
		var tagElLeft = (mapEl[i][1] / imgWidth * 100).toFixed(2);
		var tagElWidth = (mapEl[i][2] / imgWidth * 100).toFixed(2);
		var tagElHeight = (mapEl[i][3] / imgHeight * 100).toFixed(2);
		var mapElStartX = mapEl[i][1];
		var mapElStartY = mapEl[i][0];
		var mapElEndX = mapEl[i][1] + mapEl[i][2];
		var mapElEndY = mapEl[i][0] + mapEl[i][3];
		tagElement += '<a href="' + elSrc + '" style="position:absolute;top:' + tagElTop + '%;left:' + tagElLeft + '%;width:' + tagElWidth + '%;height:' + tagElHeight + '%;background:url(about:blank);display:block;" target="' + elTarget + '"></a>';
		mapElement += '<area shape="rect" coords="' + mapElStartX + ',' + mapElStartY + ',' + mapElEndX + ',' + mapElEndY + '" href="' + elSrc + '" target="' + elTarget + '">';
	}
	var tagScript = '<div style="position:relative;font-size:0;padding:0;max-width:' +
		imgWidth + 'px;max-height:' +
		imgHeight + 'px;"><img src="' +
		imgSrc + '" style="width:100%;">' +
		tagElement + '</div>';
	var mapScript = '<img src="' +
		imgSrc +'" usemap="#' +
		mapHash +'"><map name="' +
		mapHash + '">' +
		mapElement + '</map>';
	$('#code-tag').text(tagScript);
	$('#code-map').text(mapScript);
	if ($('#lb-content textarea').val().indexOf('#ERR') > -1) $('.errors').addClass('active');
}
function copyCode(){
	$('#lightbox').find('textarea').select();
	document.execCommand('Copy');
	return false;
}

/** Lightbox **/
function openLightbox(jsonId){ // Create & Open Lightbox
	if(typeof jsonId == 'object') jsonId = $(this).data('json');
	var json = window[jsonId + 'Json'];
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
	if ($('#lightbox').find('input').length > 0) $('#lightbox').find('input').eq(0).select();
	if ($('#lightbox').find('textarea').length > 0) $('#lightbox').find('textarea').focus();
	return false;
}
function closeLightbox(){ // Close & Reset Lightbox
	$('body').removeClass('dimmed');
	$('#lightbox').empty();
	$('#lightbox').removeClass();
	return false;
}

/** General Control **/
function selectUnitMeasure(){ // Set Unit & Measure Type
	window[$(this).closest('ul').attr('class')] = $(this).text().toLowerCase();
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

/* Lightbox JSON Data */
/** Navigation Bar **/
var codeJson = { // SOURCE - CODE
	title		: 'LOAD MAP ELEMENTS FROM SOURCE CODE',
	content		: '<textarea id="input-code" rows="6" spellcheck="false"></textarea><p class="red">&#9888; Importing source code will remove every map elements and links.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: 'btn-lb-import',
	btnYesJson	: '',
	btnYes		: 'IMPORT &amp; PARSE'
};
var urlJson = { // SOURCE - URL
	title		: 'LOAD IMAGE FROM SOURCE URL',
	content		: '<input id="input-img-url" type="text" value="http://" spellcheck="false"><p class="red">&#9888; Loading a new image source will remove every map elements and links.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: 'btn-lb-load',
	btnYesJson	: '',
	btnYes		: 'LOAD'
};
var localJson = { // SOURCE - LOCAL
	title		: 'LOAD IMAGE FROM LOCAL STORAGE',
	content		: '<label id="label-img-local"><input id="input-img-local" type="file"><p>' + (isIE ? 'Click to load an image' : 'Drag &amp; drop or click to load') + '</p></label><p class="red">&#9888; Loading a new image source will remove every map elements and links.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: 'btn-lb-load',
	btnYesJson	: '',
	btnYes		: 'LOAD'
};
var clearJson = { // CLEAR
	title		: '&#9888; WARNING',
	content		: '<p>Do you really want to remove every map elements and links from the workspace?</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'NO',
	btnYesClass	: 'btn-lb-clear',
	btnYesJson	: '',
	btnYes		: 'YES'
};
var generateJson = { // GENERATE
	title		: 'GENERATE SOURCE CODE',
	content		: '<a class="btn-lb-open" data-json="tags" href="#">Responsive A Tag Style (%, Mobile OK)</a><a class="btn-lb-open" data-json="maps" href="#">Classic Image Map Style (px, PC Only)</a>',
	btnSet		: 'onebtn',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: '',
	btnYesJson	: '',
	btnYes		: ''
};
var tagsJson = { // GENERATE - Responsive A Tag Style
	title		: 'A TAG TYPE SOURCE CODE',
	content		: '<textarea id="code-tag" rows="8" spellcheck="false"></textarea><p class="red errors">⚠ Check for the errors (#ERR) before using this code.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-open',
	btnNoJson	: 'generate',
	btnNo		: 'BACK',
	btnYesClass	: 'btn-clipboard',
	btnYesJson	: '',
	btnYes		: 'COPY TO CLIPBOARD',
	callback	: 'generateCode'
};
var mapsJson = { // GENERATE - Classic Image Map Style
	title		: 'IMAGE MAP TYPE SOURCE CODE',
	content		: '<textarea id="code-map" rows="8" spellcheck="false"></textarea><p class="red errors">⚠ Check for the errors (#ERR) before using this code.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-open',
	btnNoJson	: 'generate',
	btnNo		: 'BACK',
	btnYesClass	: 'btn-clipboard',
	btnYesJson	: '',
	btnYes		: 'COPY TO CLIPBOARD',
	callback	: 'generateCode'
};
var helpJson = { // ?
	title		: 'EASY MAPPER (v20180206)',
	content		: '<p>Author: Inpyo Jeon (inpyodev@gmail.com)</p><p>License: <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">GPLv3</a> (Free Open Source License)</p><p>Browser Support: IE10+, Chrome (PC Only)</p><p><a href="https://github.com/inpyodev/easymapper" target="_target">https://github.com/inpyodev/easymapper</a></p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CLOSE',
	btnYesClass	: 'btn-lb-open',
	btnYesJson	: 'shortcut',
	btnYes		: 'ⓘ KEY SHORTCUTS'
};
var shortcutJson = { // ? - KEY SHORTCUTS
	title		: 'KEYBOARD SHORTCUTS',
	content		: '<p>Enter: Submit Values, Edit Map Area Link<br>ESC: Close Lightbox, Cancel Map Drawing<br>Delete: Remove Selected Map Element<br>Ctrl+C: Copy Selected Map Element<br>Ctrl+V: Paste Copied Map Element<br>U: Toggle Scale Unit<br>F1: Keyboard Shortcuts<br>Double Click: Edit Map Area Link</p>',
	btnSet		: 'onebtn',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CLOSE',
	btnYesClass	: '',
	btnYesJson	: '',
	btnYes		: ''
};
/** Map Elements **/
var linkJson = { // Link Edit
	title		: 'EDIT MAP AREA LINK',
	content		: '<input id="input-link-url" type="text" value="http://" spellcheck="false"><p id="err-link" class="red">⚠ Enter a valid URL.</p><label class="radiolabel"><input type="radio" name="radio-link" value="_self" checked><span>Open in the same frame (target="_self")</span></label><label class="radiolabel"><input type="radio" name="radio-link" value="_blank"><span>Open in a new window (target="_blank")</span></label><label class="radiolabel"><input type="radio" name="radio-link" value="_parent"><span>Open in the parent frame (target="_parent")</span></label><label class="radiolabel"><input type="radio" name="radio-link" value="_top"><span>Open in the full body (target="_top")</span></label>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: 'btn-lb-link',
	btnYesJson	: '',
	btnYes		: 'CONFIRM',
	callback	: 'loadMap'
};
var removeJson = { // Remove Map Element
	title		: '&#9888; WARNING',
	content		: '<p>Do you really want to remove this map element from the workspace?</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'NO',
	btnYesClass	: 'btn-lb-removemap',
	btnYesJson	: '',
	btnYes		: 'YES'
}