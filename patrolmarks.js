/**
 * 在[[Special:Newpages]]中讓沒有patrolmarks權限的用戶也能標記巡查過的編輯
 */

(function() {

	if (mw.config.get('wgCanonicalSpecialPageName') !== 'Newpages') {
		return;
	}

	mw.loader.using(['mediawiki.api']).done(function() {

		let api = new mw.Api();
		let is_autoreviewer = {};

		let users = [];
		$('#mw-content-text>ul>li').each((i, e) => {
			let creator = $(e).find('a.mw-userlink').text();
			if (!mw.util.isIPAddress(creator)) {
				users.push(creator);
			} else {
				is_autoreviewer[creator] = false;
			}
		});
		api.get({
			'action': 'query',
			'format': 'json',
			'list': 'users',
			'usprop': 'rights',
			'ususers': users.join('|')
		}).then(data => {
			data.query.users.forEach(user => {
				is_autoreviewer[user.name] = (user.rights.indexOf('autopatrol') !== -1);
			});
		}).then(() => {
			$('#mw-content-text>ul>li').each((i, e) => {
				let pagename = $(e).find('>a:nth-child(2)').text();
				let oldpagename = $(e).find('.mw-newpages-oldtitle').text();
				if (oldpagename) {
					pagename = oldpagename.replace(/最初建立的名稱為「(.+?)」/, '$1').replace(/最初创建为“(.+?)”/, '$1');
				}
				let creator = $(e).find('a.mw-userlink').text();
				let oldid = mw.util.getParamValue('oldid', $(e).find('>a:first()').attr('href'));
				api.get({
					'action': 'query',
					'format': 'json',
					'list': 'logevents',
					'letype': 'patrol',
					'letitle': pagename
				}).then(data => {
					if (data.query.logevents.length == 0) {
						if (!is_autoreviewer[creator]) {
							e.classList.add('not-patrolled');
						}
					} else {
						if (data.query.logevents[0].params.curid != oldid) {
							e.classList.add('not-patrolled');
						}
					}
				});
			});
		})

	});

})();
