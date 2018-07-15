javascript:
(function(){

if (mw.config.get('wgPageName') !== "Category:快速删除候选") return;

var titlelist = [];
var elements = {};
$("#mw-pages a").each(function(i, e){
	var title = decodeURIComponent(e.href.substr(30));
	titlelist.push(title);
	elements[title] = e;
});
for (var i = 0; i < titlelist.length; i+=50) {
	var titlestr = titlelist.slice(i, i+50).join("|");
	$.ajax({
		type: 'GET',
		url: mw.config.get("wgServer")+mw.config.get("wgScriptPath")+'/api.php',
		data: {
			"action": "query",
			"format": "json",
			"prop": "revisions",
			"titles": titlestr,
			"rvprop": "content"
		},
		success: function success(data) {
			for (i in data.query.pages) {
				var page = data.query.pages[i];
				if (page.missing === undefined) {
					var title = page.title.replace(/ /g, "_");
					if ((m = page.revisions[0]["*"].match(/{{\s*(?:d|delete|csd|速删|速刪)\s*\|\s*(.+?)\s*}}/i)) !== null) {
						$(elements[title].parentElement).append("（"+m[1]+"）");
					}
					if (page.revisions[0]["*"].match(/{{\s*Notmandarin\s*\|/i)) {
						$(elements[title].parentElement).append("（G14）");
					}
					if ((m = page.revisions[0]["*"].match(/{{\s*(?:hang ?on|有爭議|有争议)\s*\|\s*(.+?)\s*}}/i)) !== null) {
						$(elements[title].parentElement).append("（Hangon："+m[1]+"）");
					}
				}
			}
		},
		error: function error(e) {
			console.log("Error!");
		}
	});
}

})();
