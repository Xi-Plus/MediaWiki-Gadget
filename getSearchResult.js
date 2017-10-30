javascript:
(function(){

var text = "";
$(".mw-search-result-heading").each(function(i, e) {
	text += e.children[0].innerText+"<br>";
});

var win = window.open("", "Search Result");
win.document.body.innerHTML = text;

})();
