if (mw.config.get('wgNamespaceNumber') == 10) {
	var path = mw.config.get('wgArticlePath');
	var node = document.createElement("span");
	node.id = "template-transclusion-count";
	node.innerHTML = '使用量:<a id="ttclink" href="' + path.replace('$1', 'Special:链入页面/' + mw.config.get('wgPageName') + '?hidelinks=1&hideredirs=1') + '">未取得</a>';
	document.getElementsByClassName("mw-indicators mw-body-content")[0].appendChild(node);
	$.ajax({
		type: 'GET',
		url: "https://xiplus.twbbs.org/Xiplus-zhWP/Template-transclusion-count.php?title="+mw.config.get('wgTitle'),
		success: function success(data) {
			data = JSON.parse(data);
			if (data.status) {
				ttclink.innerHTML = data.result;
			} else {
				if (data.result == "fetch") {
					ttclink.innerHTML = "抓取錯誤2";
				} else if (data.result == "match") {
					ttclink.innerHTML = "分析錯誤";
				} else {
					ttclink.innerHTML = "未知錯誤";
				}
			}
		},
		error: function error(e) {
			ttclink.innerHTML = "抓取錯誤1";
		}
	});
}
