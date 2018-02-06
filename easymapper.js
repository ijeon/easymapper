/* Easy Mapper (v20180206a)
 * Author: Inpyo Jeon (inpyodev@gmail.com)
 * License: GPLv3 (Free Open Source License)
 * Browser Support: IE10+, Chrome (PC Only)
 * https://github.com/inpyodev/easymapper */

/* Flag Variables */
var unit = '%';
var measure = 'drag';
var imgWidth, imgHeight;
var tagScript, mapScript;

/* Event Bindings */
$(document)
	.on('click', '.btn-select', selectUnitMeasure)
	.on('click', '.btn-lb-open', openLightbox)
	.on('click', '.btn-lb-close', closeLightbox)
	.on('click', '#btn-toggle-unit', toggleUnit)
	.on('click', '.btn-lb-load', loadImage)
	.on('click', '.btn-lb-clear', clearWorkspace)
	.on('change', '#input-img-local', parsePath)
	.on('keydown', bindKeys);

$(window).on('load', setup);

/* Functions */
function loadImage(){
	if ($(this).parents('#lightbox').hasClass('url')) $('#srcimg').attr('src', $('#input-img-url').val());
	else $('#srcimg').attr('src', filepath);
	$('#srcimg').on('load', setup);
	closeLightbox();
	return false;
}

function setup(){
	clearWorkspace();
	imgWidth = $('#srcimg').width();
	imgHeight = $('#srcimg').height();
	$('.ruler.x').css({ width: imgWidth });
	$('.ruler.y').css({ height: imgHeight });
	$('#navbar').css({ maxWidth: imgWidth + 20 });
	drawRuler();
}

function clearWorkspace(){
	
	return false;
}

function parsePath(e) {
	var URL = window.webkitURL || window.URL;
    filepath = URL.createObjectURL(e.target.files[0]);
}

function drawRuler(){
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

function selectUnitMeasure(){
	window[$(this).closest('ul').attr('class')] = $(this).text().toLowerCase();
	$(this).parent().addClass('active').siblings().removeClass('active');
	if ($(this).closest('ul').attr('class') == 'unit') drawRuler();
	return false;
}

function toggleUnit(){
	unit = (unit == '%') ? 'px' : '%';
	$('.unit').find('li').toggleClass('active');
	drawRuler();
	return false;
}

function openLightbox(){
	var json = window[$(this).data('json') + 'Json'];
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
	$('#lightbox').addClass($(this).data('json')).html(lb);
	$('body').addClass('dimmed');
	return false;
}

function closeLightbox(){
	$('body').removeClass('dimmed');
	$('#lightbox').empty();
	$('#lightbox').removeClass();
	return false;
}

function bindKeys(e){ // Key Bindings
	switch (e.which){
		case 13: // Enter
			break;
		case 27: // ESC
			if ($('body').hasClass('dimmed')) closeLightbox();
			break;
		case 46: // DEL
			break;
		case 67: // C
			if (e.ctrlKey) console.log('copy');
			break;
		case 83: // S
			if (!$('body').hasClass('dimmed')) unitToggle();
			break;
		case 86: // V
			if (e.ctrlKey) console.log('paste');
			break;
	}
}

/* Lightbox JSON Data */
var codeJson = {
	title		: 'LOAD MAP ELEMENTS FROM SOURCE CODE',
	content		: '<textarea id="input-code" rows="6"></textarea><p class="red">&#9888; Loading a new image source will remove every map elements and links.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: 'btn-lb-import',
	btnYesJson	: '',
	btnYes		: 'IMPORT &amp; PARSE'
};
var urlJson = {
	title		: 'LOAD IMAGE FROM SOURCE URL',
	content		: '<input id="input-img-url" type="text" value="http://"><p class="red">&#9888; Loading a new image source will remove every map elements and links.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: 'btn-lb-load',
	btnYesJson	: '',
	btnYes		: 'LOAD'
};
var localJson = {
	title		: 'LOAD IMAGE FROM LOCAL STORAGE',
	content		: '<input id="input-img-local" type="file"><p class="red">&#9888; Loading a new image source will remove every map elements and links.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: 'btn-lb-load',
	btnYesJson	: '',
	btnYes		: 'LOAD'
};
var clearJson = {
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
var generateJson = {
	title		: 'GENERATE SOURCE CODE',
	content		: '<a class="btn-lb-open" data-json="tag" href="#">A TAG TYPE (PERCENT, MOBILE OK)</a><a class="btn-lb-open" data-json="map" href="#">IMAGE MAP TYPE (PIXELS, PC ONLY)</a>',
	btnSet		: 'onebtn',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: 'CANCEL',
	btnYesClass	: '',
	btnYesJson	: '',
	btnYes		: ''
};
var helpJson = {
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
var shortcutJson = {
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
var tagJson = {
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
var mapJson = {
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