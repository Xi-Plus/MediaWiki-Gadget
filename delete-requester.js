if (document.getElementsByClassName("metadata plainlinks ambox ambox-speedy")[0] !== undefined) {
	$.ajax({
		type: "GET",
		url: "https://zh.wikipedia.org/w/api.php",
		data: {
			action: "query",
			format: "json",
			prop: "revisions",
			titles: mw.config.get('wgPageName'),
			rvprop: "user|tags",
			rvlimit: "50"
		},
		success: function success(data) {
			var message = "找不到提刪者";
			var path = mw.config.get('wgArticlePath');
			for (var id in data.query.pages) {
				var page = data.query.pages[id];
				for (var i = 0; i < page.revisions.length; i++) {
					if (page.revisions[i].tags.indexOf("添加刪除模板") !== -1) {
						var user = page.revisions[i].user;
						message = '提刪者為<a href="' + path.replace('$1', 'User:' + user) + '">' + user + '</a>';
						break;
					}
				}
				break;
			}
			document.getElementsByClassName("mw-indicators mw-body-content")[0].innerHTML += message;
		},
		error: function error(e) {
			document.getElementsByClassName("mw-indicators mw-body-content")[0].innerHTML += "抓取提刪者錯誤";
		}
	});
}
