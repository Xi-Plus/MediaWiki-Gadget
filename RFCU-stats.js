if (mw.config.get('wgPageName') === 'Wikipedia:元維基用戶查核協助請求') {
	for (var i = 2; $(".tocsection-" + i)[0] !== undefined; i++) {
		var sectiontext = $(".tocsection-" + i)[0].children[0].children[1];
		sectiontext.style["color"] = $("h3").next().find("span:nth-child(1)")[i - 2].style.background;
		sectiontext.style["font-weight"] = "bold";
	}
}
