(function() {

	if (mw.config.get('wgAction') !== "history") {
		return;
	}

	function RandomColor() {
		return "#" + RandomColor2() + RandomColor2() + RandomColor2();
	}

	function RandomColor2() {
		return Math.floor((Math.random() * 155) + 100).toString(16).padStart(2, "0");
	}

	function usercolor() {
		var userlistel = document.getElementsByClassName("mw-userlink");
		var username = [];
		for (var i = userlistel.length - 1; i >= 0; i--) {
			if (username.indexOf(userlistel[i].children[0].innerText) === -1) {
				username.push(userlistel[i].children[0].innerText);
			}
		}
		var usertocolor = [];
		for (var i = username.length - 1; i >= 0; i--) {
			usertocolor[username[i]] = RandomColor();
		}
		for (var i = userlistel.length - 1; i >= 0; i--) {
			userlistel[i].style.background = usertocolor[userlistel[i].children[0].innerText];
		}
		$('.mw-history-usercolor-button').css('background', RandomColor()); // eslint-disable-line no-undef
	}

	var $node = $('<button />', {
		'class': 'historysubmit mw-history-usercolor-button mw-ui-button',
		'type': 'button',
		'title': '將相同的使用者名稱塗上相同的顏色',
		'text': '使用者名稱上色',
		'css': {
			'background': RandomColor()
		}
	});
	$node.on('click', usercolor);
	$(".historysubmit.mw-history-compareselectedversions-button").after($node);

})();
