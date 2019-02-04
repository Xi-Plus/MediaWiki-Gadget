javascript:
(function() {

	if (mw.config.get('wgPageName') != 'Steward_requests/Global' || mw.config.get('wgAction') != 'edit') {
		return;
	}

	function srgreportuserfunc() {
		var user = prompt("Username:");
		if (!user) {
			return;
		}
		wpTextbox1.value += '\n'
			+ '=== Global lock for [[User:' + user + '|' + user + ']] ===\n'
			+ '{{status}} <!-- do not remove this template -->\n'
			+ '*{{LockHide|' + user + '}}\n'
			+ 'Cross-wiki vandalism. --~~~~';
		wpSummary.value += 'New request';
		wpDiff.click();
	}

	function srgreportipfunc() {
		var ip = prompt("IP:");
		if (!ip) {
			return;
		}
		wpTextbox1.value += '\n'
			+ '=== Global block for [[Special:Contributions/' + ip + '|' + ip + ']] ===\n'
			+ '{{Status}} <!-- Do not remove this template -->\n'
			+ '* {{Luxotool|' + ip + '}}\n'
			+ 'Cross-wiki vandalism. --~~~~';
		wpSummary.value += 'New request';
		wpDiff.click();
	}

	mw.loader.using(['mediawiki.util']).done(function() {
		var linkUser = mw.util.addPortletLink(
			'p-cactions',
			'#',
			'Report account',
			'srgreportuser'
		);
		var linkIP = mw.util.addPortletLink(
			'p-cactions',
			'#',
			'Report IP',
			'srgreportip'
		);
		linkUser.addEventListener("click", srgreportuserfunc);
		linkIP.addEventListener("click", srgreportipfunc);
	});

})();
