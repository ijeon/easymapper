/* Easy Mapper (v20180220)
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
var setLinkEdit = true; // Settings: Map Link Edit Auto-Popup Flag
var setShortcut = true; // Settings: Use Keyboard Shortcuts Flag
var theme = 'denim'; // UI Color Theme
var language = 'eng'; // Language Select
var themeBak, languageBak; // Settings Backup
var previewSet = false; // Settings Preview Flag
var langPreview = false; // Language Preview Flag

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
	.on('click', '#settings', function(){ openLightbox('settings'); })
	.on('click', '.btn-lb-settings', applySettings)
	.on('dblclick', '.map', function(){ openLightbox('link'); })
	.on('resizestop dragstop', '.map', editMap)	
	.on('mouseenter mouseleave', '#imgwrap', toggleGrid)
	.on('mousemove', '#imgwrap', moveGrid)
	.on('mousedown', '.map', selectMap)
	.on('mousedown mouseup click', '#imgwrap', drawMap)
	.on('change', '#input-img-local', parsePath)
	.on('change', '#select-theme', themePreview)
	.on('change', '#select-lang', languagePreview)
	.on('keydown', bindKeys);
$(window).on('load', setup); // Initialize

/* Functions */
/** Initializing Workspace **/
function setup(){ // Setup Workspace
	langSelect();
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
	var imgSrc = $(this).parents('#lightbox').hasClass('url') ? $('#input-img-url').val() : filepath;	
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
	var isTag = $('#imported').find('a').length > 0;
	var els = isTag ? $('#imported').find('a') : $('#imported').find('area');
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
		var target = el.attr('target');
		var start = { x: coords[0], y: coords[1] };
		var end = { x: coords[2], y: coords[3] };
		createMap(start, end);
		if (link.indexOf('//') > 0) {
			mapEl[i][4] = link;
			$('.map').eq(i).addClass('linked');
		}
		mapEl[i][5] = target;
	}
	isImport = false;
}
function langSelect(lang){ // Language Select
	if(typeof lang == 'string') var json = window[lang + '_navScript'];
	else var json = window[language + '_navScript'];
	$('.script').each(function(){
		var dat = $(this).data('script');
		$(this).text(json[dat]);
	});
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
	if (setLinkEdit && (!isImport && !isPaste)) openLightbox('link');
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
		} else{
			if (link.split('//')[2]) link = link.substring(link.indexOf('//')+2); // User Error Fix
			mapEl[getMapId()][4] = link;
			mapEl[getMapId()][5] = target;
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

/** Code Generate **/
function generateCode(){ // Source Code Generate
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
	if ($('#lb-content textarea').val().indexOf('#ERR') > -1) {
		$('.errors').addClass('active');
		$('#lb-content textarea').addClass('err');
	}
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
	if ($('#lightbox').find('input[type="text"]').length > 0) $('#lightbox').find('input[type="text"]').eq(0).select();
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
function settingsCallback(){ // Settings Callback
	if (!previewSet) {
		themeBak = theme;
		languageBak = language;
	}
	if (setLinkEdit) $('#settings-edit-popup').prop('checked', true);
	else $('#settings-edit-popup').prop('checked', false);
	if (setShortcut) $('#settings-key-shortcuts').prop('checked', true);
	else $('#settings-key-shortcuts').prop('checked', false);
	$('#select-theme').find('option[value="' + theme + '"]').prop('selected', true);
	$('#select-lang').find('option[value="' + language + '"]').prop('selected', true);
}
function discardSettings(){ // Discard Setting Changes
	if (previewSet && !langPreview) {
		theme = themeBak;
		language = languageBak;
		langSelect();
		$('body').removeClass('denim wine green white batsy black').addClass(theme);
		previewSet = false;
	} else langPreview = false;
}
function applySettings(){ // Apply Settings
	if ($('#settings-edit-popup').prop('checked')) setLinkEdit = true;
	else setLinkEdit = false;
	if ($('#settings-key-shortcuts').prop('checked')) setShortcut = true;
	else setShortcut = false;
	language = $('#select-lang').find('option:selected').val();
	langSelect();
	previewSet = false;
	closeLightbox();
	return false;
}
function themePreview(){ // Change UI Color Theme
	theme = $(this).find('option:selected').val();
	$('body').removeClass('denim wine green white batsy black').addClass(theme);
	previewSet = true;
}
function languagePreview(){ // Select Language
	language = $(this).find('option:selected').val();
	langSelect();
	previewSet = true;
	langPreview = true;
	openLightbox('settings');
}
function bindKeys(e){ // Key Bindings
	var isDialog = $('body').hasClass('dimmed');
	var isSelect = !isDialog && $('.map.selected').length > 0;
	if (setShortcut){
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
function setOption(opt, val){
	localStorage.setItem(opt, val);
}
function getOption(opt){
	return localStorage.getItem(opt);
}

/* Lightbox JSON Data (English) */
/** Navigation Bar **/
var eng_navScript = { // Navigation Bar Script
	source		: 'SOURCE ▾',
	code		: 'CODE',
	url			: 'URL',
	local		: 'LOCAL',
	unit		: 'UNIT ▾',
	measure		: 'MEASURE ▾',
	drag		: 'DRAG',
	click		: 'CLICK',
	clear		: 'CLEAR',
	generate	: 'GENERATE'
}
var eng_codeJson = { // SOURCE - CODE
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
var eng_urlJson = { // SOURCE - URL
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
var eng_localJson = { // SOURCE - LOCAL
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
var eng_clearJson = { // CLEAR
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
var eng_generateJson = { // GENERATE
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
var eng_tagsJson = { // GENERATE - Responsive A Tag Style
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
var eng_mapsJson = { // GENERATE - Classic Image Map Style
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
var eng_helpJson = { // ?
	title		: 'EASY MAPPER (v20180220)',
	content		: '<p>Author: Inpyo Jeon (inpyodev@gmail.com)</p><p>License: <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">GPLv3</a> (Free Open Source License)</p><p>Browser Support: IE10+, Chrome (PC Only)</p><p><a href="https://github.com/inpyodev/easymapper" target="_target">https://github.com/inpyodev/easymapper</a></p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CLOSE',
	btnYesClass	: 'btn-lb-open',
	btnYesJson	: 'shortcut',
	btnYes		: 'ⓘ KEY SHORTCUTS'
};
var eng_shortcutJson = { // ? - KEY SHORTCUTS
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
var eng_settingsJson = { // PREFERENCES
	title		: 'PREFERENCES',
	content		: '<p><input type="checkbox" id="settings-edit-popup" class="checkbox"><label for="settings-edit-popup">Map Link Edit Auto-Popup</label></p><p><input type="checkbox" id="settings-key-shortcuts" class="checkbox"><label for="settings-key-shortcuts">Use Keyboard Shortcuts</label></p><p><span class="select-label">UI Color Theme</span><select class="selectbox" id="select-theme"><option value="denim" selected>Denim</option><option value="wine">Castello di Ama</option><option value="green">Pine Forest</option><option value="white">Mont Blanc</option><option value="batsy">Caped Crusader</option><option value="black">Monochrome</option></select></p><p><span class="select-label">Language Select</span><select class="selectbox" id="select-lang"><option value="eng" selected>English</option><option value="kor">Korean</option></select></p><p class="red">⚠ Options will be stored in local storage.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'DISCARD',
	btnYesClass	: 'btn-lb-settings',
	btnYesJson	: '',
	btnYes		: 'APPLY',
	callback	: 'settingsCallback'
};
/** Map Elements **/
var eng_linkJson = { // Link Edit
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
var eng_removeJson = { // Remove Map Element
	title		: '&#9888; WARNING',
	content		: '<p>Do you really want to remove this map element from the workspace?</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'NO',
	btnYesClass	: 'btn-lb-removemap',
	btnYesJson	: '',
	btnYes		: 'YES'
};

/* Lightbox JSON Data (Korean) */
/** Navigation Bar **/
var kor_navScript = { // Navigation Bar Script
	source		: '이미지 소스 ▾',
	code		: '코드 파싱',
	url			: '웹 URL',
	local		: '로컬 파일',
	unit		: '측정단위 ▾',
	measure		: '제도방식 ▾',
	drag		: '드래그',
	click		: '클릭',
	clear		: '초기화',
	generate	: '코드 생성'
}
var kor_codeJson = { // SOURCE - CODE
	title		: '소스 코드로 불러오기',
	content		: '<textarea id="input-code" rows="6" spellcheck="false"></textarea><p class="red">&#9888; 소스 코드를 불러오면 화면의 맵 엘리먼트는 초기화됩니다.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '취소',
	btnYesClass	: 'btn-lb-import',
	btnYesJson	: '',
	btnYes		: '불러오기'
};
var kor_urlJson = { // SOURCE - URL
	title		: '이미지 URL로 불러오기',
	content		: '<input id="input-img-url" type="text" value="http://" spellcheck="false"><p class="red">&#9888; 이미지를 불러오면 화면의 맵 엘리먼트는 초기화됩니다.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '취소',
	btnYesClass	: 'btn-lb-load',
	btnYesJson	: '',
	btnYes		: '불러오기'
};
var kor_localJson = { // SOURCE - LOCAL
	title		: '로컬 이미지 파일 불러오기',
	content		: '<label id="label-img-local"><input id="input-img-local" type="file"><p>' + (isIE ? '클릭하여 이미지 찾기' : '드래그 앤 드롭 또는 클릭') + '</p></label><p class="red">&#9888; 이미지를 불러오면 화면의 맵 엘리먼트는 초기화됩니다.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '취소',
	btnYesClass	: 'btn-lb-load',
	btnYesJson	: '',
	btnYes		: '불러오기'
};
var kor_clearJson = { // CLEAR
	title		: '&#9888; 경고',
	content		: '<p>모든 맵 엘리먼트와 링크 내용을 삭제하시겠습니까? 삭제된 내용은 복구할 수 없습니다.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '아니오',
	btnYesClass	: 'btn-lb-clear',
	btnYesJson	: '',
	btnYes		: '예'
};
var kor_generateJson = { // GENERATE
	title		: '소스 코드 생성',
	content		: '<a class="btn-lb-open" data-json="tags" href="#">반응형 A 태그 스타일 (%, 모바일 지원)</a><a class="btn-lb-open" data-json="maps" href="#">이미지 맵 스타일 (px, 반응형 미지원)</a>',
	btnSet		: 'onebtn',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '취소',
	btnYesClass	: '',
	btnYesJson	: '',
	btnYes		: ''
};
var kor_tagsJson = { // GENERATE - Responsive A Tag Style
	title		: 'A 태그 타입 소스',
	content		: '<textarea id="code-tag" rows="8" spellcheck="false"></textarea><p class="red errors">⚠ 코드를 사용하기 전에 에러 내용(#ERR)을 확인하십시오.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-open',
	btnNoJson	: 'generate',
	btnNo		: '뒤로',
	btnYesClass	: 'btn-clipboard',
	btnYesJson	: '',
	btnYes		: '클립보드에 복사',
	callback	: 'generateCode'
};
var kor_mapsJson = { // GENERATE - Classic Image Map Style
	title		: '이미지 맵 타입 소스',
	content		: '<textarea id="code-map" rows="8" spellcheck="false"></textarea><p class="red errors">⚠ 코드를 사용하기 전에 에러 내용(#ERR)을 확인하십시오.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-open',
	btnNoJson	: 'generate',
	btnNo		: '뒤로',
	btnYesClass	: 'btn-clipboard',
	btnYesJson	: '',
	btnYes		: '클립보드에 복사',
	callback	: 'generateCode'
};
var kor_helpJson = { // ?
	title		: 'EASY MAPPER (v20180220)',
	content		: '<p>기획/개발: 전인표 (inpyodev@gmail.com)</p><p>라이센스: <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">GPLv3</a> (무료 오픈 소스 라이센스)</p><p>지원 브라우저: IE10+, Chrome (PC 전용)</p><p><a href="https://github.com/inpyodev/easymapper" target="_target">https://github.com/inpyodev/easymapper</a></p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '닫기',
	btnYesClass	: 'btn-lb-open',
	btnYesJson	: 'shortcut',
	btnYes		: 'ⓘ 단축키 일람'
};
var kor_shortcutJson = { // ? - KEY SHORTCUTS
	title		: '단축키 일람',
	content		: '<p>Enter: 값 적용, 맵 구역 링크 수정<br>ESC: 팝업 닫기, 맵 제도 중단<br>Delete: 맵 엘리먼트 삭제<br>Ctrl+C: 맵 엘리먼트 복사<br>Ctrl+V: 맵 엘리먼트 붙여넣기<br>U: 측정단위 빠른 변환<br>F1: 단축키 일람 보기 (Chrome)<br>더블클릭: 맵 구역 링크 수정</p>',
	btnSet		: 'onebtn',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '닫기',
	btnYesClass	: '',
	btnYesJson	: '',
	btnYes		: ''
};
var kor_settingsJson = { // PREFERENCES
	title		: '환경설정',
	content		: '<p><input type="checkbox" id="settings-edit-popup" class="checkbox"><label for="settings-edit-popup">맵 생성시 링크 팝업 자동 출력</label></p><p><input type="checkbox" id="settings-key-shortcuts" class="checkbox"><label for="settings-key-shortcuts">단축키(Shortcut Keys) 사용</label></p><p><span class="select-label">UI 색상 테마 설정</span><select class="selectbox" id="select-theme"><option value="denim" selected>Denim</option><option value="wine">Castello di Ama</option><option value="green">Pine Forest</option><option value="white">Mont Blanc</option><option value="batsy">Caped Crusader</option><option value="black">Monochrome</option></select></p><p><span class="select-label">사용언어 선택</span><select class="selectbox" id="select-lang"><option value="eng" selected>English</option><option value="kor">Korean</option></select></p><p class="red">⚠ 설정값은 로컬 저장소에 저장됩니다.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '취소',
	btnYesClass	: 'btn-lb-settings',
	btnYesJson	: '',
	btnYes		: '적용',
	callback	: 'settingsCallback'
};
/** Map Elements **/
var kor_linkJson = { // Link Edit
	title		: '맵 구역 링크 수정',
	content		: '<input id="input-link-url" type="text" value="http://" spellcheck="false"><p id="err-link" class="red">⚠ Enter a valid URL.</p><label class="radiolabel"><input type="radio" name="radio-link" value="_self" checked><span>Open in the same frame (target="_self")</span></label><label class="radiolabel"><input type="radio" name="radio-link" value="_blank"><span>Open in a new window (target="_blank")</span></label><label class="radiolabel"><input type="radio" name="radio-link" value="_parent"><span>Open in the parent frame (target="_parent")</span></label><label class="radiolabel"><input type="radio" name="radio-link" value="_top"><span>Open in the full body (target="_top")</span></label>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '취소',
	btnYesClass	: 'btn-lb-link',
	btnYesJson	: '',
	btnYes		: '적용',
	callback	: 'loadMap'
};
var kor_removeJson = { // Remove Map Element
	title		: '&#9888; 경고',
	content		: '<p>해당 맵 엘리먼트와 링크 내용을 삭제하시겠습니까? 삭제된 내용은 복구할 수 없습니다.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '아니오',
	btnYesClass	: 'btn-lb-removemap',
	btnYesJson	: '',
	btnYes		: '예'
};