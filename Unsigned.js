javascript: (async function () {
	var api = new mw.Api();
	var textbox = document.getElementById('wpTextbox1');

	var myPrefix = textbox.value.substring(0, textbox.selectionStart);
	var selectedText = textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
	var mySuffix = textbox.value.substring(textbox.selectionEnd);

	var username = '',
		timestamp = '';
	if (selectedText) {
		await api
			.get({
				action: 'query',
				format: 'json',
				prop: 'revisions',
				titles: mw.config.get('wgPageName'),
				utf8: 1,
				formatversion: '2',
				rvprop: 'timestamp|user|content',
				rvslots: 'main',
				rvlimit: '50',
			})
			.done(function (res) {
				var found = false;
				for (const revision of res.query.pages[0].revisions) {
					console.log(revision.user, revision.timestamp);
					if (revision.slots.main.content.includes(selectedText)) {
						found = true;
						username = revision.user;
						timestamp = revision.timestamp;
					} else {
						if (found) {
							break;
						}
					}
				}
				if (found) {
					mw.notify('Added by ' + username + ' at ' + timestamp);
				} else {
					mw.notify('Author not found', { type: 'error' });
				}
			});
	}

	if (!username) {
		username = prompt('Username');
	}
	if (username !== '' && username !== null) {
		username = username.trim();
		textbox.value =
			myPrefix +
			selectedText +
			'{{subst:unsigned|' +
			username +
			'|' +
			new Morebits.date(timestamp).format('YYYY年M月D日 (ddd) HH:mm', 'utc') +
			' (UTC)}}' +
			mySuffix;
		var summary = '[[Template:Unsigned|補簽名]]';
		if (mw.util.isIPAddress(username)) {
			summary +=
				'[[User:' +
				username +
				'|' +
				username +
				']]（[[User talk:' +
				username +
				'|對話]]｜[[Special:Contributions/' +
				username +
				'|貢獻]]）';
		} else {
			summary += '[[Special:Contributions/' + username + '|' + username + ']]（[[User talk:' + username + '|留言]]）';
		}
		document.getElementById('wpSummary').value = summary;
		document.getElementById('wpMinoredit').click();

		var finish = function () {
			if (confirm('Save?')) {
				document.getElementById('wpSave').click();
			}
		};

		if (confirm('Notify ' + username + '?')) {
			var talkmessage = '== 您忘了簽名 ==\n{{subst:Uw-tilde|' + mw.config.get('wgPageName') + '}}--~~~~';
			var talksummary = '單層級通知：沒有在討論頁上簽名，於[[' + mw.config.get('wgPageName') + ']]';
			var talkpage = 'User_talk:' + username;

			api
				.edit(talkpage, function (revision) {
					return {
						text: revision.content + '\n\n' + talkmessage,
						summary: talksummary,
						nocreate: false,
					};
				})
				.then(
					function () {
						mw.notify('已通知');
						finish();
					},
					function (e) {
						if (e == 'nocreate-missing') {
							api
								.create(
									talkpage,
									{
										summary: talksummary,
									},
									talkmessage
								)
								.then(
									function () {
										mw.notify('已通知');
										finish();
									},
									function (e) {
										mw.notify('建立討論頁發生錯誤：' + e);
										finish();
									}
								);
						} else {
							mw.notify('編輯討論頁發生錯誤：' + e);
							finish();
						}
					}
				);
		} else {
			finish();
		}
	}
})();
