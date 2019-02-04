(function() {

	var lang = "zh-hant";

	function getTranslatewikiLink(str) {
		var match = str.match(/\(([^:)]+)/g);
		var res = [];
		if (match !== undefined) {
			$(match).each(function(i, m) {
				m = m.substr(1);
				res.push('<a href="https://translatewiki.net/wiki/MediaWiki:' + m + '/' + lang + '" target="_blank">(' + m + ')</a><sup><a href="' + mw.config.get("wgServer") + mw.config.get("wgArticlePath").replace('$1', 'MediaWiki:' + m) + '" target="_blank">local</a></sup>');
			});
		}
		return res;
	}

	function main() {
		$(document).click(function(event) {
			var el = $(event.target);
			if ($(el).attr("class") == "mw-notification-content") {
				return;
			}
			var msg = "translatewiki links:";
			var hasmsg = false;
			if (el.text()) {
				var res = getTranslatewikiLink(el.text());
				if (res.length > 0) {
					msg += "<br>text: ";
				}
				$(res).each(function(i, a) {
					msg += a + " ";
					hasmsg = true;
				});
			}
			if (el.attr("value")) {
				res = getTranslatewikiLink(el.attr("value"));
				if (res.length > 0) {
					msg += "<br>value: ";
				}
				$(res).each(function(i, a) {
					msg += a + " ";
					hasmsg = true;
				});
			}
			if (el.attr("title")) {
				res = getTranslatewikiLink(el.attr("title"));
				if (res.length > 0) {
					msg += "<br>title: ";
				}
				$(res).each(function(i, a) {
					msg += a + " ";
					hasmsg = true;
				});
			}
			if (hasmsg) {
				mw.notify([msg]);
			}
			return false;
		});
	}

	mw.loader.using(['mediawiki.util', 'mediawiki.notify']).done(function() {
		if (mw.util.getParamValue('uselang') === 'qqx') {
			var node = mw.util.addPortletLink('p-cactions', '#', '取得translatewiki連結');
			$(node).click(function(e) {
				e.preventDefault();
				$(node).hide();

				main();
			});
		}
	});

})();
