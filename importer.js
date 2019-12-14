javascript:
/* globals Importer:true */
(function() {
	if (!mw.config.get('wgIsProbablyEditable')) {
		return;
	}

	if (typeof Importer === 'undefined')
		Importer = {};

	if (typeof Importer.wikis !== 'object') {
		if (mw.config.get('wgWikiFamily') === 'wikipedia') {
			Importer.wikis = [
				{ text: '中維', url: 'https://zh.wikipedia.org/w/api.php', interwiki: 'zh' },
				{ text: '英維', url: 'https://en.wikipedia.org/w/api.php', interwiki: 'en' },
			];
		} else {
			Importer.wikis = [
				{ text: '中維', url: 'https://zh.wikipedia.org/w/api.php', interwiki: 'w:zh' },
				{ text: '英維', url: 'https://en.wikipedia.org/w/api.php', interwiki: 'w:en' },
			];
		}
	}

	if (typeof Importer.summary !== 'string') {
		/**
		 * $1 - Pagename
		 * $2 - Interwiki lang code
		 * $3 - Revision ID
		 * $4 - Revision User
		 * $5 - Revision Timestamp
		 */
		Importer.summary = '從[[$2:Special:PermanentLink/$3|$2:$1]]匯入 via [[m:User:Xiplus/js/importer.js|importer.js]]';
	}

	mw.messages.set({
		'userjs-importer-summary': Importer.summary,
	});

	function ImportPageCore(apiurl, interwiki) {
		var pagename = prompt('輸入目標Wiki頁面名稱', mw.config.get('wgCanonicalNamespace') + ':' + mw.config.get('wgTitle'));
		if (pagename === null) {
			mw.notify('動作已取消');
			return;
		}

		/* 取得對應條目的名字 */
		var remoteapi = new mw.ForeignApi(apiurl);
		remoteapi.get({
			'action': 'query',
			'format': 'json',
			'prop': 'revisions',
			'titles': pagename,
			'rvprop': 'content|ids|timestamp|user'
		}).done(function(data) {
			var page;
			for (const key in data.query.pages) {
				page = data.query.pages[key];
				break;
			}
			if (page.missing === '') {
				mw.notify('目標頁面不存在');
				return;
			}
			var revid = page.revisions[0].revid;
			var revuser = page.revisions[0].user;
			var revtimestamp = page.revisions[0].timestamp;
			var content = page.revisions[0]['*'];
			var editsummary = mw.msg('userjs-importer-summary', pagename, interwiki, revid, revuser, revtimestamp);
			var localapi = new mw.Api();
			localapi.create(
				mw.config.get('wgPageName'),
				{ summary: editsummary },
				content
			).done(function() {
				mw.notify('成功建立頁面');
				location.reload();
			}).fail(function(e) {
				if (e === 'articleexists') {
					localapi.edit(
						mw.config.get('wgPageName'),
						function() {
							return {
								text: content,
								summary: editsummary,
							};
						}
					).done(function() {
						mw.notify('成功編輯頁面');
					}).fail(function() {
						mw.notify('編輯時發生錯誤：' + e);
					});
				} else {
					mw.notify('建立時發生錯誤：' + e);
				}
			});
		}).fail(function() {
			mw.notify('取得頁面內容時發生錯誤');
		});
	}

	window.ImportPage = function() {
		var text = '匯入來源：';
		for (let i = 0; i < Importer.wikis.length; i++) {
			text += '\n' + (i + 1) + '. ' + Importer.wikis[i].text + ' ' + Importer.wikis[i].url;
		}
		var choose = parseInt(prompt(text, '1'));
		if (isNaN(choose)) {
			mw.notify('動作已取消');
			return;
		}
		var wiki = Importer.wikis[choose - 1];
		if (wiki === undefined) {
			mw.notify('輸入編號錯誤');
			return;
		}
		ImportPageCore(wiki.url, wiki.interwiki);
	}

	if (mw.config.get('wgArticleId') === 0) {
		var link = mw.util.addPortletLink('p-namespaces', '#', '匯入');
		$(link).on('click', window.ImportPage);
	}

}
)();
