/* globals pagehistory */

function showrollbacklink() {
	for (var i = document.getElementsByClassName("mw-rollback-link").length - 1; i >= 0; i--) {
		document.getElementsByClassName("mw-rollback-link")[i].style.display = "";
	}
}

if (["Watchlist", "Recentchanges", "Recentchangeslinked"].indexOf(mw.config.get('wgCanonicalSpecialPageName')) !== -1) {
	for (var i = document.getElementsByClassName("mw-rollback-link").length - 1; i >= 0; i--) {
		document.getElementsByClassName("mw-rollback-link")[i].style.display = "none";
	}
}
if (mw.config.get('wgAction') === "history") {
	for (var i = document.getElementsByClassName("mw-rollback-link").length - 1; i >= 0; i--) {
		document.getElementsByClassName("mw-rollback-link")[i].style.display = "none";
	}

	var node = document.createElement("input");
	node.id = "rollbacklinkbtn";
	node.type = "button";
	node.value = "顯示回退";
	pagehistory.previousSibling.insertBefore(node, pagehistory.previousSibling.children[1]);
	rollbacklinkbtn.addEventListener("click", showrollbacklink); // eslint-disable-line no-undef
}
