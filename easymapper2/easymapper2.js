var brd = document.getElementById('board');
var ctx = brd.getContext('2d');

var $brd = $(brd);
var x0 = $brd.offset().left;
var y0 = $brd.offset().top;

console.log(x0, y0)