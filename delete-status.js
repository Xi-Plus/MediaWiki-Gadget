/* globals contributor, dellog */
(function() {

	if (document.getElementsByClassName("mw-indicators mw-body-content").length === 0) {
		return;
	}

	if (document.getElementById("speedy-delete") !== null) {
		var node = document.createElement("span");
		node.id = "contributor-list";
		node.style = "margin-left: 5px;";
		node.innerHTML = '貢獻：<a id="contributor">未取得</a>';
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
				rvlimit: "50",
			},
			success: function success(data) {
				var path = mw.config.get('wgArticlePath');
				for (var id in data.query.pages) {
					var page = data.query.pages[id];
					var contributors = {};
					for (var i = 0; i < page.revisions.length; i++) {
						var user = page.revisions[i].user;
						if (contributors[user] === undefined) {
							contributors[user] = 0;
						}
						contributors[user]++;
					}
				}
				contributor.innerHTML = Object.keys(contributors).length + "人" + page.revisions.length + "編輯";
				var contributorstring = "";
				$.each(contributors, function(user, count) {
					contributorstring += '<a href="' + path.replace('$1', 'Special:Contributions/' + user) + '">' + user + "</a> *" + count + "<br>";
				});
				contributor.setAttribute("onclick", "mw.notify(['貢獻者：<br>" + contributorstring + "'])");
			},
			error: function error() {
				alert("抓取錯誤");
			},
		});
	}
	if (mw.config.get('wgNamespaceNumber') !== -1 && (mw.config.get('wgAction') === "view" || mw.config.get('wgAction') === "edit")) {
		var path = mw.config.get('wgArticlePath');
		var node = document.createElement("span");
		node.id = "delete-log";
		node.style = "margin-left: 5px;";
		node.innerHTML = '<a href="' + path.replace('$1', 'Special:日志?page=' + encodeURIComponent(mw.config.get('wgPageName'))) + '&hide_patrol_log=0">日誌</a>：<span id="dellog">未取得</span>';
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
				letitle: mw.config.get('wgPageName'),
			},
			success: function success(data) {
				var message = "沒有";
				var path = mw.config.get('wgArticlePath');
				var log = [];
				for (var i = 0; i < data.query.logevents.length; i++) {
					var comment = data.query.logevents[i].comment;
					if (data.query.logevents[i].action === "restore") {
						comment = "還原";
					} else if (data.query.logevents[i].action === "revision") {
						continue;
					} else if (comment === "") {
						comment = "空";
					} else if (comment.match(/(删除以便移动|刪除以便移動)/) !== null) {
						continue;
					} else if (comment.match("被取代的非自由版权图像版本") !== null) {
						continue;
					} else if (comment.match("被取代的非自由图像版本") !== null) {
						continue;
					} else {
						comment = comment.replace(/\[\[:?(?:WP|Wikipedia):CSD#([^|\]]+)/g, "$1");
						comment = comment.replace(/^内容为：.+/, "空");
						comment = comment.replace(/(?:^|.*[^A-Fa-f\d:])(G1|G2|G3|G5|G8|G10|G11|G12|G13|G14|G15|G16|A1|A2|A3|A5|A6|R2|R3|R5|R6|R7|F1|F3|F4|F5|F6|F7|F8|O1|O3|O4|O7)(?:[^A-Fa-f\d:].*|$)/i, "$1");
						comment = comment.replace(/.*?((Wikipedia|维基百科):(頁面|檔案)存廢討論\/記錄\/\d{4}\/\d{2}\/\d{2}).*/g, '<a href="' + path.replace('$1', '$1#' + mw.config.get('wgPageName')) + '">存廢</a>');
						comment = comment.replace(/根據投票結果刪除.*/, "存廢");
						comment = comment.replace(/.*列入\[\[WP:CV\|侵权验证页面]]超过七日.*/, "侵權");
						comment = comment.replace(/.*侵犯版权.*/, "侵權");
						comment = comment.replace(/.*侵犯版權.*/, "侵權");
						comment = comment.replace(/.*存廢討論通過.*/, "存廢");
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
			error: function error() {
				dellog.innerHTML = "抓取錯誤";
			},
		});
	}

})();
