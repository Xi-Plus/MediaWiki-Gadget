if (/^Wikipedia:頁面存廢討論\/記錄\/\d+\/\d+\/\d+$/.test(mw.config.get('wgPageName'))) {
	var cntall = 0;
	var cntdel = 0;
	var cntcls = 0;
	for (var i = 1; document.getElementsByClassName("tocsection-"+i)[0] !== undefined; i++) {
		var toc = document.getElementsByClassName("tocsection-"+i)[0];
		var title = toc.children[0].href.substr(toc.children[0].href.indexOf("#")+1);
		if (title.substr(0,114) === "30.E5.A4.A9.E5.90.8E.E4.BB.8D.E6.8E.9B.E6.9C.89.7B.7Bnotability.7D.7D.E6.A8.A1.E6.9D.BF.E7.9A.84.E6.A2.9D.E7.9B.AE") continue;
		cntall ++;
		article = document.getElementById(title);
		if (article.parentNode.nextElementSibling.nodeName === "DIV") {
			toc.children[0].children[1].style = "color: #000000; font-weight: bold;";
			cntcls ++;
		} else if (article.children[0].classList.contains('new')) {
			toc.children[0].children[1].style = "color: #ba0000;";
			cntdel ++;
		}
	}
	toctitle.innerHTML+='<br>提刪:'+cntall+' <span style="color: #000000; font-weight: bold;">已關閉:'+cntcls+'</span> <span style="color: #ba0000;">需關閉:'+cntdel+'</span> <span style="color: #0b0080;">進行中:'+(cntall-cntcls-cntdel)+'</span>';
}
