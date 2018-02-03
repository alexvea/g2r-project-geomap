$.fn.parallaxXY = function ( resistance, mouse )
{
	$el = $( this );
	TweenLite.to( $el, 0.2,
	{
		x : -(( mouse.clientX - (window.innerWidth/2) ) / resistance ),
		y : -(( mouse.clientY - (window.innerHeight/2) ) / resistance )
	});

};

$.fn.parallaxY = function ( resistance, mouse )
{
	$el = $( this );
	TweenLite.to( $el, 0.3,
	{
		rotationY:((mouse.clientX/(window.innerWidth/(100+resistance)))+135)
	});

};


$(document).mousemove(function(e) {
  $('.markers').parallaxY(5, e);
  $('.clouds').parallaxXY(30, e);
});

var nombreMarkers = 50
var listeMarkers = [
  "commerce",
  "industrie",
  "pharmacie",
  "restauration",
  "services",
  "travaux",
  "pas_code_naf"
];
for (var i = 0; i < nombreMarkers; i++) {
  var nbInList = Math.floor(Math.random() * Math.floor(listeMarkers.length));
  $(".jumbotron").append("<img src='img/" + listeMarkers[nbInList] + ".png' style='z-index:2' class='markers' />")
}

$('.markers').each(function() {
  var top = Math.floor(Math.random() * Math.floor(85));
  var left = Math.floor(Math.random() * Math.floor(96));
  var size = top / 2;
  $(this).css({
    'position': 'absolute',
    'top': top + "%",
    'left': left + "%",
    'width': size
  });
});


$(".jumbotron").append("<img src='img/1.png' style='opacity:0.5; z-index:3' alt='Clouds' class='clouds'/><img src='img/2.png' style='opacity:0.5; z-index:3' alt='Clouds' class='clouds'/>");
