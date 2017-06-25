if (/^Wikipedia:頁面存廢討論\/記錄\/\d+\/\d+\/\d+$/.test(mw.config.get('wgPageName'))) {
	var list = $(".mw-headline .mw-redirect");
	for (var i = list.length - 1; i >= 0; i--) {
		list[i].href += "?redirect=no";
		list[i].style.color = "#FF00ff";
	}
}
