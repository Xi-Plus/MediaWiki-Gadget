if (document.getElementById("speedy-delete") !== null) {
	var path = mw.config.get('wgArticlePath');
	var node = document.createElement("span");
	node.id = "delete-requester";
	node.style = "margin-left: 5px;";
	node.innerHTML = '提刪者：<span id="delrequester">未取得</span>';
	document.getElementsByClassName("mw-indicators mw-body-content")[0].appendChild(node);
	var node = document.createElement("span");
	node.id = "delete-log";
	node.style = "margin-left: 5px;";
	node.innerHTML = '刪除紀錄：<span id="dellog">未取得</span>';
	document.getElementsByClassName("mw-indicators mw-body-content")[0].appendChild(node);
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
				var requester = [];
				for (var i = 0; i < page.revisions.length; i++) {
					if (page.revisions[i].tags.indexOf("添加刪除模板") !== -1) {
						var user = page.revisions[i].user;
						requester.push('<a href="' + path.replace('$1', 'User:' + user) + '">' + user + '</a>');
					}
				}
				if (requester.length != 0) {
					message = requester.join("、");
				}
			}
			delrequester.innerHTML = message;
		},
		error: function error(e) {
			delrequester.innerHTML = "抓取錯誤";
		}
	});
	$.ajax({
		type: "GET",
		url: "https://zh.wikipedia.org/w/api.php",
		data: {
			action: "query",
			format: "json",
			list: "logevents",
			leprop: "comment",
			letype: "delete",
			letitle: mw.config.get('wgPageName')
		},
		success: function success(data) {
			var message = "沒有";
			var path = mw.config.get('wgArticlePath');
			var log = [];
			for (var i = 0; i < data.query.logevents.length; i++) {
				log.push(data.query.logevents[i].comment)
			}
			if (log.length != 0) {
				message = log.join("、");
			}
			dellog.innerHTML = message;
		},
		error: function error(e) {
			dellog.innerHTML = "抓取錯誤";
		}
	});
}
