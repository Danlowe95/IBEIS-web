$(window).load(resizeMap);

$(window).resize(function() {
    resizeMap();
});

var resizeMap = function() {
	var total = $(window).height();
	var toolbar = $("#toolbar").height();
	$(".angular-google-map-container").css('height', total - toolbar);
}
