javascript:
/* globals WDLinker:true */
(function() {
	if (mw.config.get('wgArticleId') === 0) {
		return;
	}

	if ($.inArray(mw.config.get('wgNamespaceNumber'), [0, 4, 10, 14, 828]) === -1) {
		/* Enabled on main, wikipedia, template, category namespaces only. */
		return;
	}

	if (mw.config.get('wgDiffOldId') !== null) {
		/* When viewing diff, no wikibase link */
		return;
	}

	if ($('#t-wikibase').length > 0) {
		/* Disabled for linked pages */
		return;
	}

	/* config */

	if (typeof WDLinker === 'undefined')
		WDLinker = {};

	if (typeof WDLinker.wikis !== 'object') {
		if (mw.config.get('wgDBname') === 'zhwiki') {
			WDLinker.wikis = [
				{ text: 'enwp', url: 'https://en.wikipedia.org/w/api.php', lang: 'en', sitecode: 'enwiki' },
			];
		} else if (mw.config.get('wgContentLanguage') === 'zh') {
			WDLinker.wikis = [
				{ text: 'zhwp', url: 'https://zh.wikipedia.org/w/api.php', lang: 'zh', sitecode: 'zhwiki' },
				{ text: 'enwp', url: 'https://en.wikipedia.org/w/api.php', lang: 'en', sitecode: 'enwiki' },
			];
		} else {
			WDLinker.wikis = [
				{ text: 'enwp', url: 'https://en.wikipedia.org/w/api.php', lang: 'en', sitecode: 'enwiki' },
			];
		}
	}

	if (typeof WDLinker.summary !== 'string') {
		WDLinker.summary = 'via [[:m:User:Xiplus/js/quick-link-wikidata.js|WDLinker]]';
	}

	function LinkDataCore(localurl, sitelang, sitecode) {
		var defaultpagename = window.getSelection().toString();
		if (defaultpagename === '') {
			defaultpagename = mw.config.get('wgTitle');
		}
		var pagename = prompt('輸入頁面名稱', mw.config.get('wgCanonicalNamespace') + ':' + defaultpagename);
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
					api.postWithEditToken({
						action: 'wbeditentity',
						'new': 'item',
						'data': JSON.stringify({
							labels: [{
								language: sitelang,
								value: title,
							}, {
								language: mw.config.get('wgContentLanguage'),
								value: mw.config.get('wgPageName').replace(/_/g, ' '),
							}],
							sitelinks: [{
								site: targetsite,
								title: title,
							}, {
								site: mw.config.get('wgDBname'),
								title: mw.config.get('wgPageName'),
							}],
						}),
						summary: WDLinker.summary,
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
						'sitefilter': mw.config.get('wgDBname')
					}).done(function(data) {
						if (data.entities[dataid].missing === '') {
							mw.notify('該維基數據項目已被刪除，動作已取消');
							return;
						}
						if (Object.hasOwnProperty.call(data.entities[dataid].sitelinks, mw.config.get('wgDBname'))) {
							if (!confirm('該項目已連結到本維基的頁面「' + data.entities[dataid].sitelinks[mw.config.get('wgDBname')].title + '」，您要改為連結到本頁面嗎？')) {
								mw.notify('動作已取消');
								return;
							}
						}
						api.postWithEditToken({
							action: 'wbsetsitelink',
							id: dataid,
							linksite: mw.config.get('wgDBname'),
							linktitle: mw.config.get('wgPageName'),
							summary: WDLinker.summary,
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

	window.LinkData = function() {
		var text = 'Wiki to link:';
		for (let i = 0; i < WDLinker.wikis.length; i++) {
			text += '\n' + (i + 1) + '. ' + WDLinker.wikis[i].text + ' ' + WDLinker.wikis[i].url;
		}
		var choose = parseInt(prompt(text, '1'));
		if (isNaN(choose)) {
			mw.notify('Cancelled');
			return;
		}
		var wiki = WDLinker.wikis[choose - 1];
		if (wiki === undefined) {
			mw.notify('Incorrect input');
			return;
		}
		LinkDataCore(wiki.url, wiki.lang, wiki.sitecode);
	}

	var link = mw.util.addPortletLink('p-namespaces', '#', 'LinkWD');
	$(link).on('click', window.LinkData);

}
)();
