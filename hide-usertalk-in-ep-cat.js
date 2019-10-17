javascript:
(function() {

	$('.mw-category li>a').each(function(i, e) {
		if (e.href.match(/wiki\/User_talk:[^/]+$/)) {
			$(e).parent().hide();
		}
	});

})();
