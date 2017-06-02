if (mw.config.get('wgPageName') === "Special:监视列表") {
	for (var i = document.getElementsByClassName("mw-rollback-link").length - 1; i >= 0; i--) {
		document.getElementsByClassName("mw-rollback-link")[i].style.display="none";
	}
}
