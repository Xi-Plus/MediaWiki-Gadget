javascript:
(function(){
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
})();
