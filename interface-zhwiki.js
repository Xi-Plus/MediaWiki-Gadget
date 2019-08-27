/* eslint-disable no-console */
(function() {

	mw.loader.using(['mediawiki.util', 'mediawiki.notify']).done(function() {

		/* 反importScript */

		var whitelist = ["Xiplus", "A2093064-test", "A2093064-bot"];
		if (whitelist.indexOf(mw.config.get('wgUserName')) === -1) {
			alert("請勿importScript User:Xiplus/common.js！可能有未預期的危害發生。");
			return;
		}

		/* 自己的 */

		if (document.cookie.indexOf("TWtest=0") !== -1) {
			console.log("未啟用Twinkle");
		} else if (document.cookie.indexOf("TWtest=1") !== -1) {
			importScript('User:Xiplus/Twinkle-dev.js');
			console.log("測試版Twinkle");
		} else if (document.cookie.indexOf("TWtest=2") !== -1) {
			mw.loader.load('ext.gadget.Twinkle');
			console.log("Jimmy版Twinkle");
		} else {
			importScript('User:Xiplus/Twinkle.js');
			console.log("穩定版Twinkle");
		}

		importScript('User:Xiplus/js/admin-backlog.js');
		importScript('User:Xiplus/js/AFD-stats.js');
		importScript('User:Xiplus/js/AFDpagelog.js');
		importScript('User:Xiplus/js/apply-edit-from-abuselog.js');
		importScript('User:Xiplus/js/close-affp.js');
		importScript('User:Xiplus/js/close-move.js');
		importScript('User:Xiplus/js/close-rfpp.js');
		importScript('User:Xiplus/js/close-rrd.js');
		importScript('User:Xiplus/js/close-vip.js');
		importScript('User:Xiplus/js/contribution-filter.js');
		importScript('User:Xiplus/js/csd-reason-in-csd-cat.js');
		importScript('User:Xiplus/js/delete-status.js');
		importScript('User:Xiplus/js/disable-redirect.js');
		importScript('User:Xiplus/js/forceEditSection.js');
		importScript('User:Xiplus/js/hide-long-summary.js');
		importScript('User:Xiplus/js/highlight-newpages.js');
		importScript('User:Xiplus/js/history-filter.js');
		importScript('User:Xiplus/js/History-User-Color.js');
		importScript('User:Xiplus/js/HRTProtectLink.js');
		importScript('User:Xiplus/js/log-move-whatlinkshere.js');
		importScript('User:Xiplus/js/mass-revision-delete.js');
		// importScript('User:Xiplus/js/mass-rollback.js');
		// importScript('User:Xiplus/js/PatrollCount.js');
		importScript('User:Xiplus/js/report-filter.js');
		importScript('User:Xiplus/js/RFCU-stats.js');
		importScript('User:Xiplus/js/TranslateVariants.js');
		importScript('User:Xiplus/js/Twinkle-delete-reason.js');
		importScript('User:Xiplus/js/unblock-zh-ipbe.js');

		importStylesheet('User:Xiplus/js/hide-rollback-link.css');
		importStylesheet('User:Xiplus/js/highlight-redirect-in-afd.css');

		/* SpecialInterlanguageLink */
		window.SpecialInterlanguageLink = {
			"lang": {
				"wikt": "詞典",
				"q": "語錄",
				"v": "學院",
				"s": "文庫",
				"b": "教科書",
				"voy": "導遊",
				"n": "新聞",
				"m": "Meta",
				"en": "English"
			}
		};
		importScript('User:Xiplus/js/SpecialInterlanguageLink.js');

		importScript('User:Xiplus/js/get-list/Special-BlockList-Target.js');

		importScript('User:WhitePhosphorus/js/CatUpdates.js');

		mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/block-time-convert.js&action=raw&ctype=text/javascript');
		mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/quick-patrol.js&action=raw&ctype=text/javascript');
		// mw.loader.load('https://xiplus.ddns.net/Xiplus-zhWP/quick-patrol.js');
		mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/watchlist-markseen.js&action=raw&ctype=text/javascript');

		if (mw.util.getParamValue('edittag') !== null) {
			mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/editchangetags-link.js&action=raw&ctype=text/javascript');
		}

		/****************************************************************/
		/** 注意！以下的js請勿使用，如有需要請直接複製原始碼至您的js頁 **/
		/****************************************************************/
		mw.loader.load('https://xiplus.ddns.net/Xiplus-zhWP/EditWatchlist-check.js');
		mw.loader.load('https://xiplus.ddns.net/Xiplus-zhWP/interface-zhwiki.js');
		mw.loader.load('https://xiplus.ddns.net/Xiplus-zhWP/Page-Preview.js');
		mw.loader.load('https://xiplus.ddns.net/Xiplus-zhWP/Template-transclusion-count.js');
		/****************************************************************/
		/** 注意！以上的js請勿使用，如有需要請直接複製原始碼至您的js頁 **/
		/****************************************************************/

		/* 其他人的 */

		mw.loader.load('https://zh.wikipedia.org/w/index.php?title=User:Hat600/script/sectionlink.js&oldid=41541354&action=raw&ctype=text/javascript'); // 2018年8月5日 (日) 08:59 (UTC)
		mw.loader.load('https://zh.wikipedia.org/w/index.php?title=User:WhitePhosphorus/js/PagePatroller.js&action=raw&ctype=text/javascript'); // 2018年8月5日 (日) 08:59 (UTC)
		mw.loader.load('https://zh.wikipedia.org/w/index.php?title=User:WhitePhosphorus/js/rrd.js&action=raw&ctype=text/javascript'); // 2018年8月5日 (日) 08:59 (UTC)
		mw.loader.load("https://meta.wikimedia.org/w/index.php?title=User:Zhaofeng_Li/Reflinks.js&oldid=17896018&action=raw&ctype=text/javascript"); // 2018年8月5日 (日) 08:59 (UTC)

		if (mw.util.getParamValue('lint-hint') !== null) {
			var myLintHints = {};
			myLintHints.rooms = "*";
			mw.hook("lintHint.config").fire(myLintHints);
			mw.loader.load("https://en.wikipedia.org/w/index.php?title=User:PerfektesChaos/js/lintHint/r.js&action=raw&bcache=1&maxage=86400&ctype=text/javascript");
		}

		if (document.cookie.indexOf("POPUP=0") !== -1) {
			console.log("未啟用Popup");
		} else if (document.cookie.indexOf("POPUP=1") !== -1) {
			mw.loader.load('ext.gadget.Navigation_popups');
			console.log("標準Popup");
		} else {
			mw.loader.load('//zh.wikipedia.org/w/index.php?title=User:A2569875-sandbox/MyPopupsSetting_zh-hant.js&action=raw&ctype=text/javascript');
			mw.loader.load('//zh.wikipedia.org/w/index.php?title=User:A2569875-sandbox/MyPopups.css&action=raw&ctype=text/css', 'text/css');
			console.log("A2569875Popup");
		}

		mw.loader.load('https://meta.wikimedia.org/w/index.php?title=User:He7d3r/Tools/ScoredRevisions.js&action=raw&ctype=text/javascript');

		/* 設定 */
		window.LocalComments = {};
		window.LocalComments.disablePages = function() {
			if (mw.config.get('wgDiffOldId') !== null) {
				return true;
			}
			return false;
		};

	});
})();
