javascript:
(function(){
var v1 = document.all["mw-htmlform-ns2"].children[0].children[0].children[1].children;
for (var j = 0; j < v1.length; j++) {
	var match = v1[j].children[0].value.match(/User:\d+\.\d+\.\d+\.\d+/);
	if (match === null) continue;
	v1[j].children[0].click();
}
})();
