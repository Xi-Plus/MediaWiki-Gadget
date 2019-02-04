/*
 * 取得[[Special:BlockList]]中的封禁目標，在新分頁顯示列表
 */

(function() {

	if (mw.config.get('wgCanonicalSpecialPageName') !== 'BlockList') {
		return;
	}

	mw.loader.using(['mediawiki.util'], function() {
		var node = mw.util.addPortletLink('p-cactions', '#', '取得封禁目標列表');
		$(node).click(function(event) {
			event.preventDefault();

			var result = "";
			$(".TablePager_col_ipb_target>a.mw-userlink>bdi").each(function(i, el) {
				result += $(el).text() + "<br>";
			});
			var win = window.open("", "Result");
			win.document.body.innerHTML = result;
		});
	});

})();
