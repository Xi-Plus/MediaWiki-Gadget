javascript: (async function() {
	var api = new mw.Api();
	var textbox = document.getElementById('wpTextbox1');

	var myPrefix = textbox.value.substring(0, textbox.selectionStart);
	var selectedText = textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
	var mySuffix = textbox.value.substring(textbox.selectionEnd);
	const RVLIMIT = 50;

	var username = '',
		timestamp = '',
		revid;
	if (selectedText) {
		await api
			.get({
				action: 'query',
				format: 'json',
				prop: 'revisions',
				titles: mw.config.get('wgPageName'),
				utf8: 1,
				formatversion: '2',
				rvprop: 'ids|timestamp|user|content',
				rvslots: 'main',
				rvlimit: RVLIMIT,
			})
			.done(function(res) {
				var found = false;
				var revisions = res.query.pages[0].revisions;
				if (revisions[revisions.length - 1].slots.main.content.includes(selectedText)) {
					mw.notify('The text existed before ' + revisions.length + ' revisions', { type: 'error' });
					return;
				}
				for (let i = revisions.length - 2; i >= 0; i--) {
					if (revisions[i].slots.main.content.includes(selectedText)) {
						found = true;
						username = revisions[i].user;
						timestamp = revisions[i].timestamp;
						revid = revisions[i].revid;
						break;
					}
				}
				if (found) {
					mw.notify('Added by ' + username + ' at ' + timestamp);
				} else {
					mw.notify('The text is not found', { type: 'error' });
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
		var summary = '為';
		if (mw.util.isIPAddress(username)) {
			summary += '[[Special:Contributions/' + username + '|' + username + ']]';
		} else {
			summary += '[[User:' + username + '|' + username + ']]';
		}
		summary += '的';
		if (revid) {
			summary += '[[Special:Diff/' + revid + '|編輯]]';
		} else {
			summary += '編輯';
		}
		summary += '[[Template:Unsigned|補簽名]]';
		document.getElementById('wpSummary').value = summary;
		document.getElementById('wpMinoredit').click();
		document.getElementById('wpDiff').click();

		var finish = function() {
			if (confirm('Save?')) {
				document.getElementById('wpSave').click();
			}
		};

		if (confirm('Notify ' + username + '?')) {
			var talkmessage = '== 您忘了簽名 ==\n{{subst:Uw-tilde|' + mw.config.get('wgPageName') + '}}--~~~~';
			var talksummary = '單層級通知：沒有在討論頁上簽名，於[[' + mw.config.get('wgPageName') + ']]';
			var talkpage = 'User_talk:' + username;

			api
				.edit(talkpage, function(revision) {
					return {
						text: revision.content + '\n\n' + talkmessage,
						summary: talksummary,
						nocreate: false,
					};
				})
				.then(
					function() {
						mw.notify('已通知');
						finish();
					},
					function(e) {
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
									function() {
										mw.notify('已通知');
										finish();
									},
									function(e) {
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
