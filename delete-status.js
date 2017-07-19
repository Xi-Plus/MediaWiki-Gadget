if (document.getElementById("speedy-delete") !== null) {
	var path = mw.config.get('wgArticlePath');
	var node = document.createElement("span");
	node.id = "delete-requester";
	node.style = "margin-left: 5px;";
	node.innerHTML = '提刪者：<span id="delrequester">未取得</span>';
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
}
if (mw.config.get('wgNamespaceNumber') !== -1 && (mw.config.get('wgAction') === "view" || mw.config.get('wgAction') === "edit")) {
	var path = mw.config.get('wgArticlePath');
	var node = document.createElement("span");
	node.id = "delete-log";
	node.style = "margin-left: 5px;";
	node.innerHTML = '<a href="' + path.replace('$1', 'Special:日志/delete?page=' + mw.config.get('wgPageName')) + '">刪除紀錄</a>：<span id="dellog">未取得</span>';
	document.getElementsByClassName("mw-indicators mw-body-content")[0].appendChild(node);
	$.ajax({
		type: "GET",
		url: "https://zh.wikipedia.org/w/api.php",
		data: {
			action: "query",
			format: "json",
			list: "logevents",
			leprop: "comment|type",
			letype: "delete",
			letitle: mw.config.get('wgPageName')
		},
		success: function success(data) {
			var message = "沒有";
			var path = mw.config.get('wgArticlePath');
			var log = [];
			for (var i = 0; i < data.query.logevents.length; i++) {
				var comment = data.query.logevents[i].comment;
				console.log(comment);
				if (data.query.logevents[i].action === "restore") {
					comment = "還原";
				} else if (data.query.logevents[i].action === "revision") {
					continue;
				} else if (comment === "") {
					comment = "空";
				} else if (comment.match("删除以便移动") !== null) {
					continue;
				} else if (comment.match("被取代的非自由版权图像版本") !== null) {
					continue;
				} else if (comment.match("被取代的非自由图像版本") !== null) {
					continue;
				} else {
					comment = comment.replace(/\[\[:?(?:WP|Wikipedia)\:CSD\#([^|\]]+)/g, "$1");
					comment = comment.replace(/^内容为：.+/, "空");
					comment = comment.replace(/.*?(G1|G2|G3|G5|G8|G10|G11|G12|G13|G14|G15|G16|A1|A2|A3|A5|A6|R2|R3|R5|F1|F3|F4|F5|F6|F7|O1|O3|O4)[^\d].*/i, "$1");
					comment = comment.replace(/.*?((Wikipedia|维基百科):(頁面|檔案)存廢討論\/記錄\/\d{4}\/\d{2}\/\d{2}).*/g, '<a href="' + path.replace('$1', '$1#' + mw.config.get('wgPageName')) + '">存廢</a>');
					comment = comment.replace(/根據投票結果刪除.*/, "存廢");
					comment = comment.replace("列入[[WP:CV|侵权验证页面]]超过七日", "侵權");
					comment = comment.replace(/侵犯版权.*/, "侵權");
					comment = comment.replace(/侵犯版權.*/, "侵權");
					comment = comment.replace(/存廢討論通過.*/, "存廢");
					comment = comment.replace(/.*\[\[WP:CV.*/, "侵權");
					comment = comment.replace(/^content was.+/, "空");
					comment = comment.replace(/^make space.*/, "G8");
					comment = comment.replace(/^大量删除\[\[Special:Contributions\/.+/, "批刪");
				}
				log.push(comment);
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
