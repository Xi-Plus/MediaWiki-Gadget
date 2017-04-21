javascript:
(function(){

var searchs = document.location.search.substr(1).split("&");
var diff = "";
var oldid = "";
for (var i = searchs.length - 1; i >= 0; i--) {
	if (searchs[i].substr(0, 5) === "diff=") {
		diff = searchs[i].substr(5);
	} else if (searchs[i].substr(0, 6) === "oldid=") {
		oldid = searchs[i].substr(6);
	}
}
if (diff === "prev") {
	prompt("wikitext", "[[Special:diff/"+oldid+"]]");
} else {
	prompt("wikitext", "[[Special:diff/"+diff+"]]");
}

})();
