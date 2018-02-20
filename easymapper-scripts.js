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