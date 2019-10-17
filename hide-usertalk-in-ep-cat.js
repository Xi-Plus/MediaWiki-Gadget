javascript:
(function() {

	if (mw.config.get('wgPageName') !== 'Category:維基百科編輯被保護頁面請求') {
		return;
	}

	$('.mw-category li>a').each(function(i, e) {
		if (e.href.match(/wiki\/User_talk:[^/]+$/)) {
			$(e).parent().hide();
		}
	});

})();
