javascript:
(function(){

var defaultadd = "$1\\n";
var add = prompt('格式化列表：\n$1,   顯示為\nA, B,\n\n*[[$1]]\\n 顯示為\n*[[A]]\n*[[B]]', defaultadd);
if (add === null) {
	return;
}
add = add.replace(/\\n/g, "<br>");

var text = "";
$(".mw-search-result-heading").each(function(i, e) {
	text += add.replace(/\$1/g, e.children[0].innerText);
});

var win = window.open("", "Search Result");
win.document.body.innerHTML = text;

})();
