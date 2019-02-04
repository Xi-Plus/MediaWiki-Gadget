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
	}
	if (mw.config.get('wgCanonicalSpecialPageName') === 'Contributions') {
		showCentralAuth(mw.config.get('wgRelevantUserName'));
	}

	/* Admin list */
	switch (mw.config.get('wgDBname')) {
		case 'zh_classicalwiki':
		case 'zh_yuewiki':
		case 'zhwiki':
		case 'zhwikibooks':
		case 'zhwikinews':
		case 'zhwikiquote':
		case 'zhwikisource':
		case 'zhwikivoyage':
		case 'zhwiktionary':
			mw.util.addPortletLink(
				'p-cactions',
				mw.config.get('wgServer') + mw.config.get('wgArticlePath').replace('$1', 'Special:Userlist') + '?group=sysop',
				'管理員列表'
			);
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

	/* mediawiki.util */
});
