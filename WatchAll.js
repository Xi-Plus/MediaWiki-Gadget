javascript:
(function() {
	function modifyWatchlist(title, action) {
		mw.loader.using('mediawiki.api').then(function() {
			var api = mw.Api();
			if (action == 'watch') {
				api.watch(title);
			} else {
				api.unwatch(title);
			}
		});
	}

	var c = prompt("Watch All?\n+ Watch\n- Unwatch", "+");
	var q = "";
	if (c === "+") q = "watch";
	else if (c === "-") q = "unwatch";
	if (q !== "") {
		if (mw.config.get('wgCanonicalSpecialPageName') === "Contributions") {
			var watched = [];
			var titles = document.getElementsByClassName("mw-contributions-title");
			var len = titles.length;
			for (var i = 0; i < len; i++) {
				var title = titles[i].innerText;
				if (!watched.includes(title)) {
					modifyWatchlist(title, q);
					watched.push(title);
				}
			}
			var titles = document.getElementsByClassName("mw-newpages-pagename");
			var len = titles.length;
			for (var i = 0; i < len; i++) {
				var title = titles[i].innerText;
				if (!watched.includes(title)) {
					modifyWatchlist(title, q);
					watched.push(title);
				}
			}
		} else if (mw.config.get('wgCanonicalNamespace') === "Category") {
			$(".mw-category-generated a").each(function(i, e) {
				if (e.classList.contains("CategoryTreeLabelCategory")) {
					modifyWatchlist("Category:" + e.innerText, q);
				} else {
					modifyWatchlist(e.innerText, q);
				}
			});
		}
	}

})();
