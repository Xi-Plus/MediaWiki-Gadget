javascript:
(function(){

var searchs = document.location.search.substr(1).split("&");
for (var i = searchs.length - 1; i >= 0; i--) {
	if (searchs[i].substr(0, 5) === "diff=") {
		prompt("wikitext", "[[Special:diff/"+searchs[i].substr(5)+"]]");
		break;
	}
}

})();
