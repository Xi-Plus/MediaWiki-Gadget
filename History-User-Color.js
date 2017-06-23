if (mw.config.get('wgAction') === "history") {
	function RandomColor() {
		return "#"+RandomColor2()+RandomColor2()+RandomColor2();
	}
	function RandomColor2() {
		return Math.floor((Math.random()*155)+100).toString(16).padStart(2, "0");
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
		usercolorbtn.style.background = RandomColor();
	}
	var node = document.createElement("input");
	node.id = "usercolorbtn";
	node.type = "button";
	node.value = "用戶上色";
	node.style.background = RandomColor();
	pagehistory.previousSibling.insertBefore(node, pagehistory.previousSibling.children[1]);
	usercolorbtn.addEventListener("click", usercolor);
}
