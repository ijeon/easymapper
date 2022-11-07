$(window).on('load', init);

function init() {
    $('#img-list').sortable({
        containment: '#nav-img-pane',
        handle: '.img-move'
    });
}

$(document).on('click', '.tool', toolOpen);
$(document).on('click', '#btn-close', toolClose);

function toolOpen() {
    var id = $(this).attr('id');

    $(this).add('article[id=' + id + '-pane]').addClass('active').siblings().removeClass('active');
    $('main').addClass('dimmed');
}

function toolClose() {
    $('main').removeClass('dimmed');
    $('.tool').removeClass('active');
}