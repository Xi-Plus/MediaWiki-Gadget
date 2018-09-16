javascript:
(function(){

var defaultadd = "$1\\n";
var add = prompt('格式化列表：\n$1,   顯示為\nA, B,\n\n*[[$1]]\\n 顯示為\n*[[A]]\n*[[B]]', defaultadd);
if (add === null) {
	return;
}
add = add.replace(/\\n/g, "<br>");

var prefix = (mw.config.get('wgServer') + mw.config.get('wgArticlePath')).replace(/^\/\//, "").replace("$1", "");
var text = "";
$(".mw-search-result-heading>a").each(function(i, e) {
	var page = decodeURI(e.href.split(prefix)[1]);
	text += add.replace(/\$1/g, page);
});

var win = window.open("", "Search Result");
win.document.body.innerHTML = text;

})();
