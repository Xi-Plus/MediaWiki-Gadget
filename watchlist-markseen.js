javascript:
(function() {

	function watchlistmarkseen(title) {
		new mw.Api().postWithEditToken({
			"action": "setnotificationtimestamp",
			"titles": title,
		}).done(function() {
			mw.notify(['已將頁面 "<a href="/wiki/' + title + '">' + title + '</a>" 標記為已查看。'])
		});
	}

	if (mw.config.get("wgCanonicalSpecialPageName") === "Watchlist") {

		$($(".special")[0]).on("click", ".mw-changeslist-watchedunseen>:first-child>:first-child", function() {
			var title = $(this).parent().parent().find(":nth-child(3)").find(".mw-title,.mw-redirect")[0].innerText;
			watchlistmarkseen(title);
		});

	}

})();
