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
				{ text: 'zhwp', url: 'https://zh.wikipedia.org/w/api.php', interwiki: 'zh' },
				{ text: 'enwp', url: 'https://en.wikipedia.org/w/api.php', interwiki: 'en' },
			];
		} else {
			Importer.wikis = [
				{ text: 'zhwp', url: 'https://zh.wikipedia.org/w/api.php', interwiki: 'w:zh' },
				{ text: 'enwp', url: 'https://en.wikipedia.org/w/api.php', interwiki: 'w:en' },
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
		Importer.summary = "Copied content from [[$2:Special:PermanentLink/$3|$2:$1]]; see [[$2:Special:PageHistory/$1|that page's history]] for attribution; via [[m:User:Xiplus/js/importer.js|importer.js]]";
	}

	mw.messages.set({
		'userjs-importer-summary': Importer.summary,
	});

	function ImportPageCore(apiurl, interwiki) {
		var pagename = prompt('Input target wiki page name', (mw.config.get('wgCanonicalNamespace') + ':' + mw.config.get('wgTitle')).replace(/^:+/, ''));
		if (pagename === null) {
			mw.notify('Cancelled');
			return;
		}

		/* Fetch target page name */
		var remoteapi = new mw.ForeignApi(apiurl);
		remoteapi.get({
			'action': 'query',
			'format': 'json',
			'prop': 'revisions',
			'titles': pagename,
			'rvprop': 'content|ids|timestamp|user',
		}).done(function(data) {
			var page;
			for (const key in data.query.pages) {
				page = data.query.pages[key];
				break;
			}
			if (page.missing === '') {
				mw.notify('The target page does not exist.');
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
				mw.notify('Page created.');
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
						mw.notify('Page edited.');
					}).fail(function() {
						mw.notify('An error occurred while editing:' + e);
					});
				} else {
					mw.notify('An error occurred while creating:' + e);
				}
			});
		}).fail(function() {
			mw.notify('An error occurred while fetching page content.');
		});
	}

	window.ImportPage = function() {
		var text = 'Import source:';
		for (let i = 0; i < Importer.wikis.length; i++) {
			text += '\n' + (i + 1) + '. ' + Importer.wikis[i].text + ' ' + Importer.wikis[i].url;
		}
		var choose = parseInt(prompt(text, '1'));
		if (isNaN(choose)) {
			mw.notify('Cancelled');
			return;
		}
		var wiki = Importer.wikis[choose - 1];
		if (wiki === undefined) {
			mw.notify('Incorrect input');
			return;
		}
		ImportPageCore(wiki.url, wiki.interwiki);
	}

	if (mw.config.get('wgArticleId') === 0) {
		var link = mw.util.addPortletLink('p-namespaces', '#', 'Import');
		$(link).on('click', window.ImportPage);
	}

}
)();
