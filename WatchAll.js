javascript:
(function(){

var c=prompt("Watch All?\n+ Watch\n- Unwatch", "+");
var q="";
if (c=="+") q="watch";
else if (c=="-") q="unwatch";
if (q!="") {
	var l=document.getElementsByClassName("mw-contributions-title").length;
	for (var i = 0; i < l; i++) {
		pg.fn.modifyWatchlist(document.getElementsByClassName("mw-contributions-title")[i].innerText, q);
	}
}

})();
