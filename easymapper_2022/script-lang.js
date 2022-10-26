$(function(){
    lang = $('html').attr('lang');
    langChange(lang);
});

$(document).on('click', '#change-lang', langChange);

function langChange(l){
    if (typeof l != 'string') lang = (lang == 'ko') ? 'en' : 'ko'; // 언어 스왑

    $('html').attr('lang', lang);
    script = Array.from(window[lang]);
    updateScript();
}

function updateScript(){
    $('[scripted]').each(function(){
        var _id = $(this).attr('id');

        $.each(script, function(idx, item){
            if (item.id == _id) {
                $(this).text(item.txt);
                $.each(item.subtxt, function(subidx, subitem){
                    $('[subtxt='+ _id + '-' + subidx +']').text(subitem);
                });
            }
        });
    });
}

var lang,
    script,
    ko = [
        { id: 'nav-load', txt: '불러오기' },
        { id: 'nav-save', txt: '저장하기' },
        { id: 'load-upl', txt: '이미지 업로드', subtxt: ['클릭 또는 드래그 & 드롭', '적용', '취소'] },
        { id: 'load-img', txt: '이미지 URL' },
        { id: 'load-vid', txt: '동영상 URL' },
        { id: 'load-src', txt: '소스 코드' },
        { id: 'change-lang', txt: 'ENG' }
    ],
    en = [
        { id: 'nav-load', txt: 'Load' },
        { id: 'nav-save', txt: 'Save' },
        { id: 'load-upl', txt: 'Image Upload' },
        { id: 'load-img', txt: 'Image URL' },
        { id: 'load-vid', txt: 'Video URL' },
        { id: 'load-src', txt: 'Source Code' },
        { id: 'change-lang', txt: '한국어' }
    ];