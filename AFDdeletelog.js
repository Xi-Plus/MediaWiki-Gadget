if (/^Wikipedia:頁面存廢討論\/記錄\/\d+\/\d+\/\d+$/.test(mw.config.get('wgPageName'))) {
	var list = $(".mw-headline a");
	for (var i = list.length - 1; i >= 0; i--) {
		if (list[i].getAttribute("href").indexOf("/") === 0) {
			list[i].outerHTML += '(<a href="/wiki/Special:日志/delete?page='+list[i].innerText+'">刪紀錄</a>)';
		}
	}
}
