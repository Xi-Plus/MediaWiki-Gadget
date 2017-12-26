javascript:
(function(){

if (mw.config.get("wgCanonicalSpecialPageName") === "Watchlist") {

	function watchlistmarkseen(title) {
		new mw.Api().postWithEditToken({
			"action": "setnotificationtimestamp",
			"titles": title
		}).done(function() {
			mw.notify(['已將頁面 "<a href="/wiki/'+title+'">'+title+'</a>" 標記為已查看。'])
		});
	}

	$($(".special")[0]).on("click", ".mw-changeslist-watchedunseen>:first-child>:first-child", function(){
		title = $(this).parent().parent().find(":nth-child(3)").find(".mw-title,.mw-redirect")[0].innerText;
		watchlistmarkseen(title);
	});

}
	
})();
