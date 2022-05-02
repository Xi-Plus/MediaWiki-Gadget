javascript:
/* globals Importer:true */
(function() {
	if (!mw.config.get('wgIsProbablyEditable')) {
		return;
	}

	if (typeof Importer === 'undefined')
		Importer = {};

	if (typeof Importer.wikis !== 'object') {
		Importer.wikis = [
			{ text: 'zhwp', url: 'https://zh.wikipedia.org/w/api.php', interwiki: 'metawiki:zh' },
			{ text: 'enwp', url: 'https://en.wikipedia.org/w/api.php', interwiki: 'metawiki:en' },
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
		Importer.summary = "Copied content from [[$2:Special:PermanentLink/$3|$2:$1]]; see [[$2:Special:PageHistory/$1|that page's history]] for attribution; via [[m:User:A2093064/importer.js|importer.js]]";
	}

	mw.messages.set({
		'userjs-importer-summary': Importer.summary,
	});

	var pagename, interwiki;

	function ImportPageCore(apiurl) {
		pagename = prompt('Input target wiki page name', (mw.config.get('wgCanonicalNamespace') + ':' + mw.config.get('wgTitle')).replace(/^:+/, ''));
		if (pagename === null) {
			mw.notify('Cancelled');
			return;
		}

		var params = $.param({
			'action': 'query',
			'format': 'json',
			'prop': 'revisions',
			'titles': pagename,
			'rvprop': 'content|ids|timestamp|user',
		})

		var scriptTag = document.createElement('script');
		scriptTag.src = apiurl + '?' + params + '&callback=ImportPageCallback';
		document.body.appendChild(scriptTag);
	}

	window.ImportPageCallback = function(data) { // eslint-disable-line no-unused-vars
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
					location.href = mw.util.getUrl(null, { diff: 'cur', oldid: 'prev' });
				}).fail(function() {
					mw.notify('An error occurred while editing:' + e);
				});
			} else {
				mw.notify('An error occurred while creating:' + e);
			}
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
		interwiki = wiki.interwiki;
		ImportPageCore(wiki.url);
	}

	var link = mw.util.addPortletLink('p-namespaces', '#', 'Import');
	$(link).on('click', window.ImportPage);

}
)();
