javascript:
/* globals Importer:true */
(function() {
	if (mw.config.get('wgArticleId') !== 0) {
		return;
	}

	if (!mw.config.get('wgIsProbablyEditable')) {
		return;
	}

	if (typeof Importer === 'undefined')
		Importer = {};

	if (typeof Importer.wikis !== 'object') {
		Importer.wikis = [
			{ text: '中維', url: 'https://zh.wikipedia.org/w/api.php', interwiki: 'zh' },
			{ text: '英維', url: 'https://en.wikipedia.org/w/api.php', interwiki: 'en' },
		];
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

	function ImportPage(apiurl, interwiki) {
		var pagename = prompt('輸入目標Wiki頁面名稱', mw.config.get('wgCanonicalNamespace') + ':' + mw.config.get('wgTitle'));
		if (pagename === null) {
			mw.notify('動作已取消');
			return;
		}

		/* 取得對應條目的名字 */
		var api = new mw.ForeignApi(apiurl);
		api.get({
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
			new mw.Api().create(
				mw.config.get('wgPageName'),
				{ summary: editsummary },
				content
			).done(function() {
				mw.notify('成功建立頁面');
				location.reload();
			}).fail(function(e) {
				mw.notify('建立時發生錯誤：' + e);
			});
		}).fail(function() {
			mw.notify('取得頁面內容時發生錯誤');
		});
	}

	var link = mw.util.addPortletLink('p-namespaces', '#', '匯入');
	$(link).on('click', function() {
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
		ImportPage(wiki.url, wiki.interwiki);
	});

}
)();
