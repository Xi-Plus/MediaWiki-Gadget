if (/^Wikipedia:頁面存廢討論\/記錄\/\d+\/\d+\/\d+$/.test(mw.config.get('wgPageName'))) {
	var list = $(".mw-headline .mw-redirect");
} else if (mw.config.get('wgPageName') === "Category:快速删除候选") {
	var list = $(".redirect-in-category .mw-redirect");
} else {
	var list = [];
}
for (var i = list.length - 1; i >= 0; i--) {
	list[i].href += "?redirect=no";
}
