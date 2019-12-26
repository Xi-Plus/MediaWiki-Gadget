(function() {

	if ($('#pt-sandbox').length > 0) {
		return;
	}

	mw.loader.using(['mediawiki.util']).done(function() {
		var link, label;
		switch (mw.config.get('wgContentLanguage')) {
			case 'zh':
				link = '沙盒';
				label = '沙盒';
				break;
			default:
				link = 'sandbox';
				label = 'Sandbox';
				break;
		}
		mw.util.addPortletLink(
			'p-personal',
			'/wiki/User:' + mw.config.get('wgUserName') + '/' + link,
			label,
			'pt-sandbox',
			'',
			'',
			'#pt-preferences'
		);
	});

}
)();
