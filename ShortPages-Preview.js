if (mw.config.get('wgPageName') === "Special:短页面") {
	var items = document.getElementsByClassName("special")[0].children;
	for (var i = 0; i < items.length; i++) {
		getpage(i);
	}
	function getpage(idx) {
		link = items[i].children[1].href;
		link += "?action=raw";
		$.ajax({
			type: 'GET',
			url: link,
			success: function success(data) {
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
			},
			error: function error(e) {
				items[i].innerHTML += "<span style='color: white; background-color: red;'>fetch fail</span>";
			}
		});
	}
	function write(idx, text) {
		items[idx].innerHTML += text;
	}
}
