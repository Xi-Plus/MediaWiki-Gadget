javascript:
/* globals mw */
/* 本工具需配合 https://github.com/Xi-Plus/MediaWiki-Gadget/blob/master/APIedit.js 使用 */
(function() {

	var api = new mw.Api();
	api.get({
		'action': 'query',
		'format': 'json',
		'prop': 'revisions',
		'titles': mw.config.get('wgPageName'),
		'rvprop': 'timestamp|user',
		'rvlimit': '1',
		'utf8': 1,
		'formatversion': '2',
	}).then(data => {
		var username = data.query.pages[0].revisions[0].user;
		var timestamp = data.query.pages[0].revisions[0].timestamp;

		if (!confirm('補簽名: ' + username)) {
			return $.Deferred().reject('cancel');
		}

		api.edit(mw.config.get('wgPageName'), function(revision) {
			return {
				text: revision.content + '{{subst:Unsigned|' + username + '|' + timestamp + '}}',
				summary: '[[Template:Unsigned|補簽名]] [[User:' + username + '|' + username + ']]（[[User talk:' + username + '|對話]]｜[[Special:Contributions/' + username + '|貢獻]]）',
				minor: true,
			};
		}).then(function() {
			mw.notify('已補簽名');
		});

		if (confirm('Uw-tilde?')) {
			api.newSection(
				'User talk:' + username,
				'通知：沒有在討論頁上簽名',
				'{{subst:Uw-tilde|' + mw.config.get('wgPageName') + '}}--~~~~'
			).then(_data => {
				mw.notify('已通知使用者');
			}).catch(_error => {
				mw.notify('通知使用者發生錯誤', { type: 'error' });
			})
		}
	}).catch(error => {
		if (error === 'cancel') {
			mw.notify('已取消', { type: 'error' });
		} else {
			mw.notify('抓取最後編者發生錯誤', { type: 'error' });
		}
	});

})();
