javascript:
(function() {

	var myPrefix = wpTextbox1.value.substring(0, wpTextbox1.selectionStart);
	var mySuffix = wpTextbox1.value.substring(wpTextbox1.selectionEnd);
	var username = prompt("Username");
	if (username !== "" && username !== null) {
		username = username.trim();
		wpTextbox1.value = myPrefix + "{{subst:unsigned|" + username + "}}" + mySuffix;
		var summary = '[[Template:Unsigned|補簽名]]';
		if (mw.util.isIPAddress(username)) {
			summary += '[[User:' + username + '|' + username + ']]（[[User talk:' + username + '|對話]]｜[[Special:Contributions/' + username + '|貢獻]]）';
		} else {
			summary += '[[Special:Contributions/' + username + '|' + username + ']]（[[User talk:' + username + '|留言]]）';
		}
		wpSummary.value = summary;

		wpMinoredit.click();

		var finish = function() {
			if (confirm("Save?")) {
				wpSave.click();
			}
		};

		if (confirm("Uw-tilde?")) {
			var api = new mw.Api();
			var talkmessage = '==您忘了簽名==\n{{subst:Uw-tilde|' + mw.config.get('wgPageName') + '}}--~~~~';
			var talksummary = '單層級通知：沒有在討論頁上簽名，於[[' + mw.config.get('wgPageName') + ']]';
			var talkpage = "User_talk:" + username;

			api.edit(
				talkpage,
				function(revision) {
					return {
						text: revision.content + '\n\n' + talkmessage,
						summary: talksummary,
						nocreate: false,
					};
				}
			).then(function() {
				mw.notify('已通知');
				finish();
			}, function(e) {
				if (e == 'nocreate-missing') {
					api.create(
						talkpage,
						{
							summary: talksummary,
						},
						talkmessage
					).then(function() {
						mw.notify('已通知');
						finish();
					}, function(e) {
						mw.notify('建立討論頁發生錯誤：' + e);
						finish();
					});
				} else {
					mw.notify('編輯討論頁發生錯誤：' + e);
					finish();
				}
			});
		} else {
			finish();
		}
	}

})();
