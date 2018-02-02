/* Easy Mapper (v20180202a)
 * Author: Inpyo Jeon (inpyodev@gmail.com)
 * License: GPLv3 (Free Open Source License)
 * Browser Support: IE10+, Chrome (PC Only)
 * https://github.com/inpyodev/easymapper */

/* Flag Variables */
var unit = '%';
var measure = 'DRAG';
var outputCodeTag = '';
var outputCodeMap = '';

/* Event Bindings */
$(document)
	.on('keydown', keyBind)
	.on('click', '.btn-closelb', closeLb)
	.on('click', '.btn-openlb', openLb);

/* Functions */
function keyBind(e){ // Key Bindings
	var keyCode = {
		enter: 13,
		esc: 27,
		del: 46,
		c: 67,
		v: 86
	};	
	switch (e.which){
		case keyCode.enter:
			break;
		case keyCode.esc:
			if ($('body').hasClass('dimmed')) closeLb();
			break;
		case keyCode.del:
			break;
		case keyCode.c: // Ctrl + C
			if (e.ctrlKey) console.log('copy');
			break;
		case keyCode.v: // Ctrl + V
			if (e.ctrlKey) console.log('paste');
			break;
	}
}

function openLb(){ // Open Lightbox
	closeLb();
	var jsonId = $(this).attr('id').split('-')[1] + 'Json';
	lbJson(window[jsonId]);
	return false;
}

function lbJson(json){ // Lightbox JSON Parsing
	$('body').addClass('dimmed');
	$('#lightbox').addClass(json.className);
	$('#lb-title p').text(json.title);
	$('#lb-content').html(json.content);
	$('#lb-btnset a.negative').text(json.btnNegative);
	$('#lb-btnset a.positive').text(json.btnPositive);
	if (json.btnNegative == 'CANCEL' || json.btnNegative == 'CLOSE') $('#lb-btnset a.negative').addClass('btn-closelb');
}

function closeLb(){ // Close & Clear Lightbox
	$('body').removeClass('dimmed');
	$('#lightbox').removeClass();
	$('#lb-title p, #lb-btnset a').text('');
	$('#lb-content').empty();
	$('#lb-btnset a.negative').removeClass('btn-closelb');
	return false;
}

/* Lightbox JSON data */
var urlJson = {
	className	: 'url',
	title		: 'LOAD IMAGE FROM SOURCE URL',
	content		: '<input id="input-imgurl" type="text" value="http://">',
	btnNegative	: 'CANCEL',
	btnPositive	: 'LOAD'
};
var localJson = {
	className	: 'local',
	title		: 'LOAD IMAGE FROM LOCAL STORAGE',
	content		: '<input id="input-imglocal" type="file">',
	btnNegative	: 'CANCEL',
	btnPositive	: 'LOAD'
};
var generateJson = {
	className	: 'generate',
	title		: 'GENERATE SOURCE CODE',
	content		: '<a id="btn-tag" class="btn-openlb" href="#">✓ A TAG TYPE (UNIT: %, MOBILE OK)</a><a id="btn-map" class="btn-openlb" href="#">✓ IMAGE MAP TYPE (UNIT: PX, PC ONLY)</a>',
	btnNegative	: 'CANCEL',
	btnPositive	: 'ⓘ DIFFERENCE?'
};
var tagJson = {
	className	: 'tag',
	title		: 'GENERATED SOURCE CODE (A TAG TYPE)',
	content		: '<p>' + outputCodeTag + '</p>',
	btnNegative	: 'BACK',
	btnPositive	: 'COPY TO CLIPBOARD'
};
var mapJson = {
	className	: 'map',
	title		: 'GENERATED SOURCE CODE (IMAGE MAP TYPE)',
	content		: '<p>' + outputCodeMap + '</p>',
	btnNegative	: 'BACK',
	btnPositive	: 'COPY TO CLIPBOARD'
};
var helpJson = {
	className	: 'help',
	title		: 'EASY MAPPER (v20180202)',
	content		: '<p>Author: Inpyo Jeon (inpyodev@gmail.com)</p><p>License: <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">GPLv3</a> (Free Open Source License)</p><p>Browser Support: IE10+, Chrome (PC Only)</p><p><a href="https://github.com/inpyodev/easymapper" target="_target">https://github.com/inpyodev/easymapper</a></p>',
	btnNegative	: 'CLOSE',
	btnPositive	: 'ⓘ KEY SHORTCUTS'
};
var differJson = {
	className	: 'differ',
	title		: 'DIFFERENCE BETWEEN CODE TYPES',
	content		: '<p></p>',
	btnNegative	: 'BACK',
	btnPositive	: 'TRY A TAG TYPE'
};
var shortcutJson = {
	className	: 'shortcut',
	title		: 'KEYBOARD SHORTCUTS',
	content		: '<p></p>',
	btnNegative	: 'BACK',
	btnPositive	: 'MAKE A SUGGESTION'
};