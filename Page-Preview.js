if (["Special:短页面", "Special:无跨wiki", "Special:断链页面"].indexOf(mw.config.get('wgPageName')) != -1) {
	var items = document.getElementsByClassName("special")[0].children;
	function getpage(idx, link, check) {
		$.ajax({
			type: 'GET',
			url: link,
			success: function success(data) {
				check(idx, data);
			},
			error: function error(e) {
				write(idx, "<span style='color: white; background-color: red;'>fetch fail</span>");
			}
		});
	}
	function write(idx, text) {
		items[idx].innerHTML += text;
	}
}
if (mw.config.get('wgPageName') === "Special:短页面") {
	function getlink(idx) {
		link = "https://zh.wikipedia.org/w/index.php?title="+items[idx].children[1].href.substr(30)+"&action=raw";
		return link;
	}
	function checkshort(idx, data) {
		write(idx, "["+data.length+" 字]");
		if (data.match(/{{delete/i)) {
			write(idx, "[<span style='color: red;'>CSD</span>]");
		}
		if (data.match(/{{vfd/i)) {
			write(idx, "[<span style='color: red;'>VFD</span>]");
		}
		if (data.match(/{{substub/i)) {
			write(idx, "[<span style='color: orange;'>Substub</span>]");
		}
		if (data.match(/{{Copyvio/i)) {
			write(idx, "[<span style='color: blue;'>Copyvio</span>]");
		}
		if (data.match(/{{Expand/i)) {
			write(idx, "[<span style='color: orange;'>擴充</span>]");
		}
		if (data.match(/{{notability/i)) {
			write(idx, "[關注度]");
		}
		if (data.match(/#(重定向|REDIRECT)/i)) {
			write(idx, "[重定向]");
		}
		if (data.match(/{{disambig}}/i)) {
			write(idx, "[消歧義]");
		}
	}
	for (var i = 0; i < items.length; i++) {
		getpage(i, getlink(i), checkshort);
	}
}
if (mw.config.get('wgPageName') === "Special:无跨wiki") {
	function getlink(idx) {
		link = "https://zh.wikipedia.org/w/index.php?title="+items[idx].children[0].href.substr(30)+"&action=raw";
		return link;
	}
	function checkinterwiki(idx, data) {
		write(idx, "["+data.length+" 字]");
		if (data.match(/{{Interlanguage links/i)) {
			write(idx, "[跨語言]");
		}
		if (data.match(/{{disambig}}/i)) {
			write(idx, "[消歧義]");
		}
	}
	for (var i = 0; i < items.length; i++) {
		getpage(i, getlink(i), checkinterwiki);
	}
}
if (mw.config.get('wgPageName') === "Special:断链页面") {
	function getlink(idx) {
		link = "https://zh.wikipedia.org/w/index.php?title="+items[idx].children[0].href.substr(30)+"&action=raw";
		return link;
	}
	function checkinterwiki(idx, data) {
		write(idx, "["+data.length+" 字]");
		if (data.match(/{{Dead end/i)) {
			write(idx, "[無連結]");
		}
		if (data.match(/{{disambig}}/i)) {
			write(idx, "[消歧義]");
		}
	}
	for (var i = 0; i < items.length; i++) {
		getpage(i, getlink(i), checkinterwiki);
	}
}
