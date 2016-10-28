function User_IP() {
	var v1 = document.all["mw-htmlform-ns2"].children[0].children[0].children[1].children;
	for (var j = 0; j < v1.length; j++) {
		var match = v1[j].children[0].value.match(/User:\d+\.\d+\.\d+\.\d+/);
		if (match === null) continue;
		v1[j].children[0].click();
	}
}
function Article_redirect() {
	var ns = [0, 2, 4, 6, 8, 10, 12, 14, 100, 118, 828, 2300, 2302, 2600];
	for (var i = 0; i < ns.length; i++) {
		var v1 = document.all["mw-htmlform-ns"+ns[i]];
		if (v1 === undefined) continue;
		var v2 = v1.children[0].children[0].children[1].children;
		for (var j = 0; j < v2.length; j++) {
			if (v2[j].children[1].children[0].children[0] === undefined) continue;
			v2[j].children[0].click();
		}
	}
}
if (mw.config.get('wgPageName') === "Special:编辑监视列表") {
	var checkdiv = document.createElement("DIV");
	checkdiv.id = "checkbox";
	document.getElementById("editwatchlist-ns0").parentNode.insertBefore(checkdiv, document.getElementById("editwatchlist-ns0").parentNode.childNodes[5]);
	document.getElementById("checkbox").innerHTML='<button type="button" onclick="User_IP();">IP用戶頁</button><button type="button" onclick="Article_redirect();">重定向</button>';
}
