if (mw.config.get('wgNamespaceNumber') === 14) {
	var catechan = mw.util.addPortletLink(
		"p-tb",
		"#",
		"最近分類變更"
	);
	catechan.children[0].setAttribute("onclick", "catechanform.submit()");
	catechan.innerHTML += '<form id="catechanform" style="display: hidden;" method="post" action="' + mw.config.get("wgArticlePath").replace("$1", "Special:滥用过滤器/test") +'"><input type="hidden" name="wpTestFilter" value="1"><input type="hidden" name="wpTestPage" value="' + mw.config.get('wgPageName') + '"></form>';
}
