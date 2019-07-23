javascript:
/**
 * 修改自
 * https://zh.wikiquote.org/w/index.php?title=MediaWiki:Gadget-LinkToWikidata.js&oldid=82569
 */

(function() {
	var localname = mw.config.get('wgPageName');
	var targetname = localname.replace(mw.config.get('wgFormattedNamespaces')[4], "Project");
	var lang = prompt('Lang:', 'zh');
	var site = prompt('Site:\n'
		+ 'wikibooks\n'
		+ 'wikidata\n'
		+ 'wikimedia\n'
		+ 'wikinews\n'
		+ 'wikipedia\n'
		+ 'wikiquote\n'
		+ 'wikisource\n'
		+ 'wikiversity\n'
		+ 'wikivoyage\n'
		+ 'wiktionary\n'
		, 'wikipedia');
	var url = lang + '.' + site + '.org';
	if (!confirm('Url: ' + url)) {
		return;
	}

	/* 取得對應條目的名字 */
	$.ajax({
		url: 'https://' + url + '/w/api.php',
		type: 'POST',
		dataType: 'jsonp',
		data: {
			action: 'query',
			format: 'json',
			prop: 'pageprops',
			titles: targetname,
			redirects: 'yes',
			converttitles: 'yes',
		},
		success: function(data) {
			var hasitem = false;
			var hastitle = false;
			var title;
			var dataid;
			if (data.query && data.query.pages) {
				for (var pageid in data.query.pages) {
					var item = data.query.pages[pageid];
					if (item.missing === "") {
						continue;
					}
					hastitle = true;
					title = item.title;
					if (item.pageprops && item.pageprops.wikibase_item) {
						hasitem = true;
						dataid = item.pageprops.wikibase_item;
					}
				}
			}
			if (!hastitle) {
				mw.notify('找不到對應條目，可能是因為尚未建立或者名稱不一致。');
			} else {
				/* 加入連結 */
				var api = new mw.ForeignApi('https://www.wikidata.org/w/api.php');
				api.get({
					action: 'query',
					meta: 'tokens'
				}).done(function(data) {
					if (!hasitem) {
						if (!confirm("對應項目沒有維基數據。是否添加？")) {
							mw.notify('已取消建立項目。');
							return;
						}
						api.post({
							action: 'wbeditentity',
							'new': 'item',
							token: data.query.tokens.csrftoken,
							'data': JSON.stringify({
								labels: {
									zh: {
										language: 'zh',
										value: title,
									},
								},
								sitelinks: [{
									site: 'zhwiki',
									title: title,
								}, {
									site: mw.config.get('wgDBname'),
									title: localname,
								}],
							})
						}).done(function() {
							mw.notify('成功連結至維基數據。');
						}).fail(function() {
							mw.notify('存取維基數據時發生錯誤。');
						});
					} else {
						api.post({
							action: 'wbsetsitelink',
							id: dataid,
							token: data.query.tokens.csrftoken,
							linksite: mw.config.get('wgDBname'),
							linktitle: localname,
						}).done(function(data) {
							if (data.success) {
								mw.notify('成功連結至維基數據。');
							} else {
								mw.notify('存取維基數據時發生錯誤。');
							}
						}).fail(function() {
							mw.notify('存取維基數據時發生錯誤。');
						});
					}
				}).fail(function() {
					mw.notify('存取維基數據時發生錯誤。');
				});
			}
		},
		error: function() {
			mw.notify('取得條目名稱時發生錯誤。');
		}
	});

}
)();
