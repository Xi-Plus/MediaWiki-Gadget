/* eslint-disable no-console */
/* eslint-disable no-fallthrough */

(function() {

	console.log("using User:Xiplus/global.js");


	/* 反importScript */
	var whitelist = ["Xiplus", "A2093064-test", "A2093064-bot"];
	if (whitelist.indexOf(mw.config.get('wgUserName')) === -1) {
		alert("請勿importScript User:Xiplus/global.js！可能有未預期的危害發生。");
		return;
	}


	// mw.loader.load('https://xiplus.ddns.net/Xiplus-zhWP/APIedit.js');
	mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/APIedit.js&action=raw&ctype=text/javascript');
	mw.loader.using(['mediawiki.util']).done(function() {
		mw.loader.load('https://en.wikipedia.org/w/index.php?title=MediaWiki:Gadget-ShowMessageNames.js&oldid=554722666&action=raw&ctype=text/javascript'); // 08:46, 5 August 2018 (UTC)
	});
	// [[File:Krinkle_CVNSimpleOverlay_wiki.js]]
	mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:Krinkle/Scripts/CVNSimpleOverlay_wiki.js&oldid=18174822&action=raw&ctype=text/javascript'); // 08:46, 5 August 2018 (UTC)
	mw.loader.load("https://zh.wikipedia.org/w/index.php?title=User:Bluedeck/serve/edit-count.js&oldid=49623399&action=raw&ctype=text/javascript"); // 08:46, 5 August 2018 (UTC)


	/* wikiplus */
	// mw.loader.load('https://xiplus.ddns.net/Xiplus-zhWP/w.js');
	mw.loader.load('https://wikiplus-app.com/Main.min.js');
	(function() {
		function wikiplusSettingdefaultSummary(w) {
			if (w.sectionNumber == -1) {
				return ' ';
			}
			if (w.sectionNumber == 0) {
				return '/* 首段 */ ';
			}
			return '/* ' + w.sectionName + ' */ ';
		}
		var wikiplusSetting = {
			"defaultSummary": wikiplusSettingdefaultSummary.toString().replace(/\s+/g, " "),
			"documatation": "http://zh.moegirl.org/User:%E5%A6%B9%E7%A9%BA%E9%85%B1/Wikiplus/%E8%AE%BE%E7%BD%AE%E8%AF%B4%E6%98%8E"
		};
		localStorage.setItem("Wikiplus_Settings", JSON.stringify(wikiplusSetting));
	})();


	/* XTools */
	mw.loader.load('https://www.mediawiki.org/w/index.php?title=XTools/ArticleInfo.js&oldid=2625658&action=raw&ctype=text/javascript'); // 08:46, 5 August 2018 (UTC)


	/* FakeRollback */
	switch (mw.config.get('wgDBname')) {
		case 'enwiki':
		case 'zhwiki':
			break;
		default:
			mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:WhitePhosphorus/js/FakeRollback.js&oldid=18757250&action=raw&ctype=text/javascript'); // 11:25, 4 January 2019 (UTC)
			break;
	}


	/* AutoUndo */
	switch (mw.config.get('wgDBname')) {
		case 'enwiki':
		case 'zhwiki':
			break;
		default:
			mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:WhitePhosphorus/js/AutoUndo.js&oldid=17704572&action=raw&ctype=text/javascript'); // 08:47, 5 August 2018 (UTC)
			break;
	}


	/* cvn-smart */
	// mw.loader.load('https://xiplus.ddns.net/wikipedia_rc/gadget.js');
	mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/cvn-smart-gadget.js&action=raw&ctype=text/javascript');


	/* list-user-last-active */
	switch (mw.config.get('wgDBname')) {
		case 'zhwiki':
			break;
		default:
			mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/list-user-last-active.js&action=raw&ctype=text/javascript');
			break;
	}


	/* get-translatewiki-link */
	mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/get-translatewiki-link.js&action=raw&ctype=text/javascript');


	/* LinkToWikidata */
	if (mw.config.get('wgDBname').match(/^zhwik|enwiki/) && mw.config.get('wgDBname') != 'zhwiki') {
		mw.loader.load('https://xiplus.ddns.net/Xiplus-zhWP/LinkToWikidata.js');
	}


	console.log("global.js end");

})();





/* interface-global */

mw.loader.using(['mediawiki.util']).done(function() {
	/* mediawiki.util */

	/* 頂欄 */
	document.all["pt-betafeatures"].hidden = true;
	document.all["pt-logout"].hidden = true;

	/* CentralAuth */
	function showCentralAuth(username) {
		if (username.match('^\\d+\\.\\d+\\.\\d+\\.\\d+$') !== null || username.match('^[0-9a-fA-F]+:[0-9a-fA-F:]+$')) {
			mw.util.addPortletLink(
				'p-cactions',
				'https://tools.wmflabs.org/meta/stalktoy/' + username,
				'全域封禁'
			);
			mw.util.addPortletLink(
				'p-cactions',
				'https://whatismyipaddress.com/ip/' + username,
				'地理位置'
			);
			mw.util.addPortletLink(
				'p-cactions',
				'http://whois.tanet.edu.tw/showWhoisPublic.php?queryString=' + username,
				'TANet'
			);
		} else {
			mw.util.addPortletLink(
				'p-cactions',
				mw.config.get('wgServer') + mw.config.get('wgArticlePath').replace('$1', 'Special:CentralAuth/' + username),
				'全域帳號'
			);
		}
		mw.util.addPortletLink(
			'p-cactions',
			'https://tools.wmflabs.org/guc/?by=date&user=' + username,
			'全域貢獻'
		);
	}
	if (mw.config.get('wgNamespaceNumber') === 2 || mw.config.get('wgNamespaceNumber') === 3) {
		showCentralAuth(mw.config.get('wgTitle').replace(/^([^/]+).*$/, '$1'));
	} else if (mw.config.get('wgRelevantUserName') !== null) {
		showCentralAuth(mw.config.get('wgRelevantUserName'));
	}

	/* Admin list */
	switch (mw.config.get('wgDBname')) {
		// case 'zh_classicalwiki':
		// case 'zh_yuewiki':
		case 'zhwiki':
			// case 'zhwikibooks':
			// case 'zhwikinews':
			// case 'zhwikiquote':
			// case 'zhwikisource':
			// case 'zhwikivoyage':
			// case 'zhwiktionary':
			break;
		default:
			mw.util.addPortletLink(
				'p-cactions',
				mw.config.get('wgServer') + mw.config.get('wgArticlePath').replace('$1', 'Special:Userlist') + '?group=sysop',
				'管理員列表'
			);
	}

	/* Twinkle */
	switch (mw.config.get('wgDBname')) {
		case 'enwiki':
		// case 'simplewiki':
		case 'zh_classicalwiki':
		case 'zhwiki':
		case 'zhwikibooks':
		// case 'zhwikinews':
		case 'zhwikiquote':
		// case 'zhwikisource':
		case 'zhwikiversity':
		case 'zhwikivoyage':
		case 'zhwiktionary':
			break;
		default:
			console.log("載入 Gadget-site-lib.js");
			mw.loader.load('//zh.wikipedia.org/w/index.php?title=MediaWiki:Gadget-site-lib.js&action=raw&ctype=text/javascript');
			console.log("測試版Twinkle");
			mw.loader.using(['mediawiki.user', 'mediawiki.util', 'mediawiki.RegExp', 'mediawiki.Title', 'jquery.ui.dialog', 'jquery.tipsy']).done(function() {
				console.log("Loading");
				mw.loader.load('//zh.wikipedia.org/w/index.php?title=User:Xiplus/Twinkle-dev.js&action=raw&ctype=text/javascript');
			});
			break;
	}

	/* Popup */
	switch (mw.config.get('wgDBname')) {
		case 'enwiki':
		case 'zhwiki':
			break;
		default:
			console.log("載入 A2569875Popup");
			mw.loader.load('//zh.wikipedia.org/w/index.php?title=User:A2569875-sandbox/MyPopupsSetting_zh-hant.js&action=raw&ctype=text/javascript');
			mw.loader.load('//zh.wikipedia.org/w/index.php?title=User:A2569875-sandbox/MyPopups.css&action=raw&ctype=text/css', 'text/css');
			break;
	}

	/* 側欄 */
	mw.util.addPortletLink(
		'p-tb',
		'/wiki/Special:PrefixIndex/' + mw.config.get('wgPageName'),
		'前綴索引',
		't-prefixindex',
		'',
		'',
		$('#t-specialpages')
	);

	mw.util.addPortletLink(
		'p-tb',
		'/wiki/?curid=' + mw.config.get('wgArticleId'),
		'短網址',
		't-shorturl',
		'',
		'',
		$('#t-info')
	);

	if (mw.config.get("wgNamespaceNumber") == 8) {
		mw.util.addPortletLink(
			'p-cactions',
			'https://translatewiki.net/wiki/' + mw.config.get("wgPageName").split("/")[0] + '/zh-hant?action=edit',
			'translatewiki'
		);
	}

	mw.loader.using(['mediawiki.api']).done(function() {
		new mw.Api().get({
			action: "query",
			format: "json",
			list: "logevents",
			leprop: "comment|type",
			letype: "delete",
			letitle: mw.config.get('wgPageName')
		}).then(function(data) {
			for (var i = 0; i < data.query.logevents.length; i++) {
				var comment = data.query.logevents[i].comment;
				console.log(comment);
			}
		});
	});

	/* mediawiki.util */
});
