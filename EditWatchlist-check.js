function User_IP() {
	var v1 = document.all["mw-htmlform-ns2"].children[0].children[0].children[1].children;
	for (var j = 0; j < v1.length; j++) {
		var match1 = v1[j].children[0].value.match(/User:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
		var match2 = v1[j].children[0].value.match(/User:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}/);
		if (match1 === null && match2 === null) continue;
		v1[j].children[0].click();
	}
}
function User_IP_Archive() {
	var v1 = document.all["mw-htmlform-ns2"].children[0].children[0].children[1].children;
	for (var j = 0; j < v1.length; j++) {
		var match1 = v1[j].children[0].value.match(/User:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/存档/);
		var match2 = v1[j].children[0].value.match(/User:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\/存档/);
		if (match1 === null && match2 === null) continue;
		v1[j].children[0].click();
	}
}
function User_IP_EmptyTalk() {
	var v1 = document.all["mw-htmlform-ns2"].children[0].children[0].children[1].children;
	for (var j = 0; j < v1.length; j++) {
		var match1 = v1[j].children[0].value.match(/User:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
		var match2 = v1[j].children[0].value.match(/User:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}\:[\dA-F]{1,4}/);
		if (match1 === null && match2 === null) continue;
		if (v1[j].children[1].children[1].classList.contains("new")) {
			v1[j].children[0].click();
		}
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
	document.getElementById("checkbox").innerHTML='<button type="button" onclick="User_IP();">IP用戶頁</button><button type="button" onclick="User_IP_EmptyTalk();">IP空對話頁</button><button type="button" onclick="User_IP_Archive();">IP對話頁存檔</button><button type="button" onclick="Article_redirect();">重定向</button>';
}
