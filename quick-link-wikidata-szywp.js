javascript:
(function() {
	if (mw.config.get('wgArticleId') === 0) {
		return;
	}

	if ($.inArray(mw.config.get('wgNamespaceNumber'), [0, 10, 14, 828]) === -1) {
		/* Enabled on main, template, category namespaces only. */
		return;
	}

	if ($('#t-wikibase').length > 0) {
		/* Disabled for linked pages */
		return;
	}

	var wdsummary = 'via [[:w:szy:User:Xiplus/js/quick-link-wikidata-szywp|QLWszywp]]';

	function LinkData(localurl, sitelang, sitecode) {
		var defaultpagename = window.getSelection().toString();
		if (defaultpagename === '') {
			defaultpagename = mw.config.get('wgCanonicalNamespace') + ':' + mw.config.get('wgTitle');
		}
		var pagename = prompt('輸入頁面名稱', defaultpagename);
		if (pagename === null) {
			mw.notify('動作已取消');
			return;
		}

		/* 取得對應條目的名字 */
		var localapi = new mw.ForeignApi(localurl);
		localapi.get({
			action: 'query',
			format: 'json',
			prop: 'pageprops',
			titles: pagename,
			redirects: 'yes',
			converttitles: 'yes',
		}).done(function(data) {
			var hasitem = false;
			var hastitle = false;
			var title;
			var dataid;
			if (data.query && data.query.pages) {
				for (var pageid in data.query.pages) {
					var item = data.query.pages[pageid];
					if (item.missing === '') {
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
				if (!hasitem) {
					if (!confirm('對應項目沒有維基數據。是否添加？')) {
						mw.notify('已取消建立項目。');
						return;
					}
					var targetsite = sitecode;
					api.post({
						action: 'wbeditentity',
						'new': 'item',
						token: data.query.tokens.csrftoken,
						'data': JSON.stringify({
							labels: [{
								language: sitelang,
								value: title,
							}, {
								language: 'szy',
								value: mw.config.get('wgPageName'),
							}],
							sitelinks: [{
								site: targetsite,
								title: title,
							}, {
								site: mw.config.get('wgDBname'),
								title: mw.config.get('wgPageName'),
							}],
						}),
						summary: wdsummary,
					}).done(function() {
						mw.notify('成功建立新的維基數據項目。');
						location.reload();
					}).fail(function() {
						mw.notify('存取維基數據時發生錯誤。');
					});
				} else {
					api.get({
						'action': 'wbgetentities',
						'format': 'json',
						'ids': dataid,
						'redirects': 'yes',
						'props': 'sitelinks',
						'sitefilter': 'szywiki'
					}).done(function(data) {
						if (data.entities[dataid].sitelinks.hasOwnProperty('szywiki')) {
							if (!confirm('該項目已連結到本維基的頁面「' + data.entities[dataid].sitelinks.szywiki.title + '」，您要改為連結到本頁面嗎？')) {
								mw.notify('動作已取消');
								return;
							}
						}
						api.postWithEditToken({
							action: 'wbsetsitelink',
							id: dataid,
							linksite: mw.config.get('wgDBname'),
							linktitle: mw.config.get('wgPageName'),
							summary: wdsummary,
						}).done(function(data) {
							if (data.success) {
								mw.notify('成功連結至現有維基數據項目。');
								location.reload();
							} else {
								mw.notify('存取維基數據時發生錯誤。');
							}
						}).fail(function() {
							mw.notify('存取維基數據時發生錯誤。');
						});
					});
				}
			}
		}).fail(function() {
			mw.notify('取得條目名稱時發生錯誤。');
		});
	}

	var wikis = [
		{ text: '連結到中維', url: 'https://zh.wikipedia.org/w/api.php', lang: 'zh', sitecode: 'zhwiki' },
		{ text: '英維', url: 'https://en.wikipedia.org/w/api.php', lang: 'en', sitecode: 'enwiki' },
	];
	wikis.forEach(wiki => {
		var link = mw.util.addPortletLink('p-namespaces', '#', wiki.text);
		$(link).on('click', function() {
			LinkData(wiki.url, wiki.lang, wiki.sitecode);
		})
	});

}
)();
