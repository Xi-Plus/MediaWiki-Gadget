javascript:
(function(){

lang = "zh-hant";

function getTranslatewikiLink(str) {
	match = str.match(/\(([^:)]+)/g);
	res = [];
	if (match !== undefined) {
		$(match).each(function(i, m){
			m = m.substr(1);
			res.push('<a href="https://translatewiki.net/wiki/MediaWiki:'+m+'/'+lang+'" target="_blank">('+m+')</a><sup><a href="'+mw.config.get("wgServer")+mw.config.get("wgArticlePath").replace('$1', 'MediaWiki:'+m)+'" target="_blank">local</a></sup>');
		});
	}
	return res;
}
$(document).click(function(event) {
	el = $(event.target);
	if ($(el).attr("class") == "mw-notification-content") {
		return;
	}
	msg = "translatewiki links:";
	msg += "<br>text: ";
	hasmsg = false;
	if (el.text() !== undefined) {
		res = getTranslatewikiLink(el.text());
		$(res).each(function(i, a){
			msg += a+" ";
			hasmsg = true;
		});
	}
	msg += "<br>title: ";
	if (el.attr("title") !== undefined) {
		res = getTranslatewikiLink(el.attr("title"));
		$(res).each(function(i, a){
			msg += a+" ";
			hasmsg = true;
		});
	}
	if (hasmsg) {
		mw.notify([msg]);
	}
	return false;
});

})();
