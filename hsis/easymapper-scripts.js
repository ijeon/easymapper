/* Lightbox JSON Data (Korean) */
/** Navigation Bar **/
var kor_navScript = { // Navigation Bar Script
	source		: '이미지 소스 ▾',
	code		: '코드 불러오기',
	url			: '업로드',
	local		: '로컬 파일',
	unit		: '측정단위 ▾',
	measure		: '제도방식 ▾',
	drag		: '드래그',
	click		: '클릭',
	clear		: '초기화',
	generate	: '코드 생성',
	urlGenerate	: '이미지 주소'
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
var kor_urlJson = { // GENERATE - 이미지 주소 획득
	title		: '이미지 주소 및 태그',
	content		: '<p style="font-weight: bold; margin: 0 0 5px;">이미지 주소</p><textarea id="img-url" rows="4" spellcheck="false" readonly></textarea><p style="font-weight: bold; margin: 15px 0 5px;">이미지 태그</p><textarea id="img-tag" rows="4" spellcheck="false" readonly></textarea>',
	btnSet		: 'onebtn',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '확인',
	btnYesClass	: '',
	btnYesJson	: '',
	btnYes		: '',
	callback	: 'generateUrl'
};
var kor_tagsJson = { // GENERATE - Responsive A Tag Style
	title		: '생성 코드 내용 확인',
	content		: '<textarea id="code-tag" rows="8" spellcheck="false"></textarea><p class="red errors">⚠ 코드를 사용하기 전에 에러 내용(#ERR)을 확인하십시오.</p>',
	btnSet		: '',
	btnNoClass	: 'btn-lb-close',
	btnNoJson	: '',
	btnNo		: '취소',
	btnYesClass	: 'btn-insertcode',
	btnYesJson	: '',
	btnYes		: '확인',
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
	content		: '<p>문의: UX팀 전인표 선임 (내선 2719)</p><p>지원 브라우저: IE10+, Chrome (PC 전용)</p>',
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
/** Map Elements **/
var kor_linkJson = { // Link Edit
	title		: '맵 구역 링크 수정',
	content		: '<label class="radiolabel2"><input type="radio" name="radio-linktype" value="_href" checked><span>링크</span></label><label class="radiolabel2"><input type="radio" name="radio-linktype" value="_youtube"><span>YOUTUBE</span></label><input id="input-link-url" type="text" value="http://" autocomplete="off" spellcheck="false"><input id="input-youtube-id" type="text" placeholder="YOUTUBE ID" spellcheck="false"><p id="err-link" class="red">⚠ 입력 항목을 확인해 주세요.</p><p id="err-link2" class="red"></p><label class="radiolabel"><input type="radio" name="radio-link" value="_none" disabled><span>선택안함</span></label><label class="radiolabel"><input type="radio" name="radio-link" value="_self" checked><span>현재 창에서 열기</span></label><label class="radiolabel"><input type="radio" name="radio-link" value="_blank"><span>새 창에서 열기</span></label><label class="radiolabel"><input type="radio" name="radio-link" value="_parent"><span>부모 창에서 열기</span></label>',
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