if (["Special:短页面", "Special:无跨wiki"].indexOf(mw.config.get('wgPageName')) != -1) {
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
		link = items[idx].children[1].href;
		link += "?action=raw";
		return link;
	}
	function checkshort(idx, data) {
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
		if (data.match(/#重定向/i)) {
			write(idx, "[重定向]");
		}
	}
	for (var i = 0; i < items.length; i++) {
		getpage(i, getlink(i), checkshort);
	}
}
if (mw.config.get('wgPageName') === "Special:无跨wiki") {
	function getlink(idx) {
		link = items[idx].children[0].href;
		link += "?action=raw";
		return link;
	}
	function checkinterwiki(idx, data) {
		if (data.match(/{{Interlanguage links/i)) {
			write(idx, "[跨語言]");
		}
	}
	for (var i = 0; i < items.length; i++) {
		getpage(i, getlink(i), checkinterwiki);
	}
}
