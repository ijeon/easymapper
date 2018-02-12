/* Easy Mapper (v20180206a)
 * Author: Inpyo Jeon (inpyodev@gmail.com)
 * License: GPLv3 (Free Open Source License)
 * Browser Support: IE10+, Chrome (PC Only)
 * https://github.com/inpyodev/easymapper */

/* Global Variables */
var unit = '%'; // Ruler Unit (%, px)
var measure = 'drag'; // Measure Type (drag, click)
var imgWidth, imgHeight, filepath; // Source Image Properties
var tagScript, mapScript; // Generated Code
var isIE = false || !!document.documentMode; // IE Detection
var phase = 0; // Grid Drawing Phase (0: None, 1: Start, 2: End)
var editing = false; // Map Element Editing Status
var x, y; // Grid Position
var start, end; // Map Coords

$(document)
	.on('click', '#test', test);
function test(){
	console.log('test')
	var start = { x:100, y:600 };
	var end = { x:220, y:700 };
	createMap(start, end);
}

/* Event Bindings */
$(document)
	.on('click', '.btn-lb-open', openLightbox)
	.on('click', '.btn-lb-close', closeLightbox)
	.on('click', '.btn-lb-load', loadImage)
	.on('click', '.btn-lb-clear', clearWorkspace)
	.on('click', '.btn-select', selectUnitMeasure)
	.on('click', '#btn-toggle-unit', toggleUnit)
	.on('click', '.btn-lb-removemap', removeMap)
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
	var number = $('.map').length + 1;
	var width = Math.abs(start.x - end.x) - 1; // Box-Sizing Fix -1px
	var height = Math.abs(start.y - end.y) - 1;
	var top = Math.min(start.y, end.y);
	var left = Math.min(start.x, end.x);
	var el = '<li id="map_' + 
		number + '" class="map unlinked" style="width:' +
		width + 'px; height:' +
		height + 'px; top:' +
		top + 'px; left:' +
		left + 'px"><span class="mapid">' +
		number + '</span><a class="btn-map-remove btn-lb-open" data-json="remove" href="#">×</a><a class="btn-map-resize" href="#">⤡</a><a class="btn-map-link btn-lb-open" data-json="link" href="#">🔗</a></li>';
	$('#maps').append(el);
	$('#map_'+number).addClass('selected').draggable({ containment: '#canvas' }).resizable({ containment: '#canvas' });
}
function removeMap(){ // Remove Selected Map Element
	$('.map.selected').remove();
	closeLightbox();
	return false;
}
function selectMap(){
	$('.map').removeClass('selected');
	$(this).addClass('selected');
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
			if (isDialog) $('#btn-lb-yes').trigger('click');
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
			if (e.ctrlKey && isSelect) console.log('copy');
			break;
		case 86: // V: (Ctrl+V) Paste Map Element 
			if (e.ctrlKey && !isDialog) console.log('paste');
			break;
		case 76: // L: Show Map Elements With No Link
			break;
		case 85: // U: Toggle Scale Unit
			if (!isDialog) toggleUnit();
			break;
		case 112: // F1: Keyboard Shortcuts
			openLightbox('help');
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
	content		: '<a class="btn-lb-open" data-json="tag" href="#">Responsive A Tag Style (%, Mobile OK)</a><a class="btn-lb-open" data-json="map" href="#">Classic Image Map Style (px, PC Only)</a>',
	btnSet		: 'onebtn',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: '',
	btnYesJson	: '',
	btnYes		: ''
};
var tagJson = { // GENERATE - Responsive A Tag Style
	title		: 'A TAG TYPE SOURCE CODE',
	content		: '<p>' + tagScript + '</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-open',
	btnNoJson	: 'generate',
	btnNo		: 'BACK',
	btnYesClass	: 'btn-clipboard',
	btnYesJson	: '',
	btnYes		: 'COPY TO CLIPBOARD'		
};
var mapJson = { // GENERATE - Classic Image Map Style
	title		: 'IMAGE MAP TYPE SOURCE CODE',
	content		: '<p>' + mapScript + '</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-open',
	btnNoJson	: 'generate',
	btnNo		: 'BACK',
	btnYesClass	: 'btn-clipboard',
	btnYesJson	: '',
	btnYes		: 'COPY TO CLIPBOARD'		
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
	content		: '',
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
	content		: '',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: 'btn-lb-link',
	btnYesJson	: '',
	btnYes		: 'CONFIRM'
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