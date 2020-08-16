javascript:
(function() {

	if (/^Wikipedia:頁面存廢討論\/記錄\/\d+\/\d+\/\d+$/.test(mw.config.get('wgPageName')) && mw.config.get('wgArticleId') !== 0 && mw.config.get('wgAction') === 'view') {
		var cntall = 0;
		var cntdel = 0;
		var cntcls = 0;
		for (var i = 1; document.getElementsByClassName("tocsection-" + i)[0] !== undefined; i++) {
			var toc = document.getElementsByClassName("tocsection-" + i)[0];
			var title = decodeURI(toc.children[0].href.substr(toc.children[0].href.indexOf("#") + 1));
			if (toc.children[1] !== undefined) continue;
			cntall++;
			var article = document.getElementById(title);
			if (article.parentNode.nextElementSibling.nodeName === "DIV") {
				toc.children[0].children[1].style["color"] = "#000000";
				toc.children[0].children[1].style["font-weight"] = "bold";
				cntcls++;
			} else if (article.children[0] !== undefined && article.children[0].classList.contains('new')) {
				toc.children[0].children[1].style["color"] = "#ba0000";
				cntdel++;
			}
		}
		var stat = document.createElement("span");
		stat.innerHTML = '<br>提刪:' + cntall + ' <span style="color: #000000; font-weight: bold;">已關閉:' + cntcls + '</span> <span style="color: #ba0000;">需關閉:' + cntdel + '</span> <span style="color: #0b0080;">進行中:' + (cntall - cntcls - cntdel) + '</span>';
		document.getElementById("toc").children[0].appendChild(stat);
	}

})();
