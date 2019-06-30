/* 頂欄 */


/* 側欄 */
/* hide sidebar link */
(function() {
	var hidelist = ["n-mainpage-description", "n-indexpage", "n-Featured_content", "n-currentevents", "n-help", "n-portal", "n-Information_desk", "n-contact", "n-about", "n-sitesupport", "p-electronPdfService-sidebar-portlet-heading", "t-upload"];
	for (var i = 0; i < hidelist.length; i++) {
		if ($("#" + hidelist[i]).length) {
			$("#" + hidelist[i])[0].hidden = true;
		}
	}
})();

/* mediawiki.util start */
mw.loader.using(['mediawiki.util']).done(function() {

	/* Checklinks */
	mw.util.addPortletLink(
		"p-tb",
		"https://dispenser.info.tm/~dispenser/cgi-bin/webchecklinks.py?page=" + mw.config.get('wgContentLanguage') + ":" + encodeURIComponent(mw.config.get('wgPageName')),
		"檢測連結",
		't-checklinks',
		'',
		'',
		$('#t-specialpages')
	);

	window.removehiddenchars = function() {
		importScript("User:Vanished user 1929210/removehiddenchars.js");
		mw.notify("已去除不可見字元");
	}
	mw.util.addPortletLink(
		"p-tb",
		"javascript:removehiddenchars()",
		"去除不可見字元",
		't-removehiddenchars',
		'',
		'',
		$('#t-specialpages')
	);

	if (mw.config.get('wgRelevantUserName') !== null) {
		mw.util.addPortletLink(
			'p-tb',
			'/wiki/Special:滥用日志?wpSearchUser=' + mw.config.get('wgRelevantUserName'),
			'用戶過濾器日誌',
			't-userabuselog',
			'',
			'',
			$('#t-blockip')
		);
	}
	if (mw.config.get('wgCanonicalSpecialPageName') === 'AbuseLog' && $('.mw-abuselog-details-user_name').length) {
		mw.util.addPortletLink(
			'p-tb',
			'/wiki/Special:滥用日志?wpSearchUser=' + ($('.mw-abuselog-details-user_name>td.mw-abuselog-var-value').text()),
			'用戶過濾器日誌',
			't-userabuselog',
			'',
			'',
			$('#t-blockip')
		);
	}

	if (mw.config.get('wgCanonicalSpecialPageName') === 'AbuseLog') {
		if (mw.config.get("wgAbuseFilterVariables") && mw.config.get("wgAbuseFilterVariables")["page_prefixedtitle"]) {
			mw.util.addPortletLink(
				'p-tb',
				'/wiki/Special:滥用日志?wpSearchTitle=' + mw.config.get("wgAbuseFilterVariables")["page_prefixedtitle"],
				'此頁過濾器日誌',
				't-abuselog',
				'',
				'',
				$('#t-specialpages')
			);
		}
	} else {
		mw.util.addPortletLink(
			'p-tb',
			'/wiki/Special:滥用日志?wpSearchTitle=' + mw.config.get('wgPageName'),
			'此頁過濾器日誌',
			't-abuselog',
			'',
			'',
			$('#t-specialpages')
		);
	}

	mw.util.addPortletLink(
		'p-tb',
		'//dispenser.info.tm/~dispenser/cgi-bin/dab_solver.py?page=zh:' + mw.config.get('wgPageName'),
		'Dab solver',
		't-dab-solver',
		'',
		'',
		$('#t-specialpages')
	);

});
/* mediawiki.util end */

/* AFD link */
(function() {
	var today = new Date();
	var yesterday = new Date();
	var tdby = new Date();
	yesterday.setUTCDate(today.getUTCDate() - 1);
	tdby.setUTCDate(today.getUTCDate() - 2);

	$('<li>' +
		'<a href="/wiki/Wikipedia:頁面存廢討論">AFD</a> ' +
		'<a href="/wiki/Wikipedia:頁面存廢討論/積壓討論">積壓</a> ' +
		'<a href="/wiki/Wikipedia:頁面存廢討論/記錄">本週</a> ' +
		'<a href="/wiki/Wikipedia:頁面存廢討論/記錄/' + tdby.getUTCFullYear() + '/' + (tdby.getUTCMonth() + 1 < 10 ? '0' : '') + (tdby.getUTCMonth() + 1) + '/' + (tdby.getUTCDate() < 10 ? '0' : '') + tdby.getUTCDate() + '">前</a> ' +
		'<a href="/wiki/Wikipedia:頁面存廢討論/記錄/' + yesterday.getUTCFullYear() + '/' + (yesterday.getUTCMonth() + 1 < 10 ? '0' : '') + (yesterday.getUTCMonth() + 1) + '/' + (yesterday.getUTCDate() < 10 ? '0' : '') + yesterday.getUTCDate() + '">昨</a> ' +
		'<a href="/wiki/Wikipedia:頁面存廢討論/記錄/' + today.getUTCFullYear() + '/' + (today.getUTCMonth() + 1 < 10 ? '0' : '') + (today.getUTCMonth() + 1) + '/' + (today.getUTCDate() < 10 ? '0' : '') + today.getUTCDate() + '">今</a>' +
		'</li>').appendTo($('#p-navigation ul'));
	$('<li>' +
		'<a href="/wiki/Wikipedia:当前的破坏">VIP</a> ' +
		'<a href="/wiki/Wikipedia:當前的編輯爭議">EWIP</a> ' +
		'<a href="/wiki/Wikipedia:请求保护页面">PT</a> ' +
		'<a href="/wiki/Wikipedia:需要管理員注意的用戶名">UAA</a> ' +
		'<a href="/wiki/Wikipedia:元維基用戶查核協助請求">RFCU</a>' +
		'</li>').appendTo($('#p-navigation ul'));
})();
