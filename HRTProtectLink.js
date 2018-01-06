if (mw.config.get("wgNamespaceNumber") == 10 || mw.config.get("wgNamespaceNumber") == 828) {
	mw.loader.using(['mediawiki.util']).done(function(){
		mw.util.addPortletLink(
			'p-cactions',
			mw.config.get("wgServer")+mw.config.get("wgScriptPath")+'/index.php?title='+encodeURIComponent(mw.config.get('wgPageName'))+'&action=protect&mwProtect-level-edit=autoconfirmed&mwProtect-level-move=sysop&wpProtectReasonSelection=高风险模板',
			'半保護高風險模板'
		);
		mw.util.addPortletLink(
			'p-cactions',
			mw.config.get("wgServer")+mw.config.get("wgScriptPath")+'/index.php?title='+encodeURIComponent(mw.config.get('wgPageName'))+'&action=protect&mwProtect-level-edit=sysop&mwProtect-level-move=sysop&wpProtectReasonSelection=高风险模板',
			'全保護高風險模板'
		);
	});
}
