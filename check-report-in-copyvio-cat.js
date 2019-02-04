/**
 * 在[[:Category:怀疑侵犯版权页面]]中顯示未提報的頁面
 */

(function() {

	if (mw.config.get('wgPageName') !== "Category:怀疑侵犯版权页面") return;

	mw.loader.using(['mediawiki.api', 'mediawiki.notify']).done(function() {

		function checkonpage(wikitext) {
			$("#mw-pages a").each(function(i, e) {
				var titleregex = decodeURIComponent(e.href.substr(30));
				var titleregex = titleregex.replace(/_/g, "[ _]");
				var titleregex = titleregex.replace(/\(/g, "\\(");
				var titleregex = titleregex.replace(/\)/g, "\\)");
				var regex = new RegExp("{{CopyvioEntry\\|(1=)?" + titleregex + "\\|", "i");
				if (wikitext.match(regex) === null) {
					$(e.parentElement).append('<span style="color: red;">（未找到提報）</span>');
				}
			});
		}

		$.ajax({
			type: 'GET',
			url: 'https://zh.wikipedia.org/w/index.php?title=Wikipedia:頁面存廢討論/疑似侵權&action=raw',
			success: function success(data) {
				checkonpage(data);
			},
			error: function error() {
				mw.notify("Get CV page failed.");
			}
		});

	});

})();
