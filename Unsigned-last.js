javascript:
/* globals APIedit */
/* 本工具需配合 https://github.com/Xi-Plus/Xiplus-zhWP/blob/master/APIedit.js 使用 */
(function() {

	var username = "";
	$.ajax({
		type: "GET",
		url: mw.config.get("wgServer") + mw.config.get("wgScriptPath") + "/api.php",
		data: {
			action: "query",
			format: "json",
			prop: "revisions",
			titles: mw.config.get('wgPageName'),
			rvprop: "user",
			rvlimit: "1"
		},
		success: function success(data) {
			for (var id in data.query.pages) {
				username = data.query.pages[id].revisions[0].user;
				break;
			}
			if (username === null || username === "") {
				alert("讀取編者錯誤");
			} else if (confirm("補簽名: " + username)) {
				next();
			}
		},
		error: function error() {
			alert("抓取最後編者錯誤");
		}
	});

	function unsignedit(content) {
		return content + "{{subst:unsigned|" + username + "}}";
	}

	function noticeedit(content) {
		return content + "\n==您忘了簽名==\n{{subst:Uw-tilde|" + mw.config.get('wgPageName') + "}}--~~~~";
	}

	function finish() {
		APIedit(mw.config.get('wgPageName'), "[[Template:Unsigned|補簽名]] [[User:" + username + "|" + username + "]]（[[User talk:" + username + "|對話]]｜[[Special:Contributions/" + username + "|貢獻]]）", unsignedit, true);
	}

	function next() {
		if (confirm("Uw-tilde?")) {
			APIedit("User_talk:" + username, "單層級通知：沒有在討論頁上簽名，於[[" + mw.config.get('wgPageName') + "]]", noticeedit, false, finish);
		} else {
			finish();
		}
	}

})();
