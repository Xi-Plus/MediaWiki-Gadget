javascript:
(function(){

var c = prompt("Watch All?\n+ Watch\n- Unwatch", "+");
var q = "";
if (c === "+") q = "watch";
else if (c === "-") q = "unwatch";
if (q !== "") {
	if (mw.config.get('wgCanonicalSpecialPageName') === "Contributions") {
		var watched = [];
		var titles = document.getElementsByClassName("mw-contributions-title");
		var len = titles.length;
		for (var i = 0; i < len; i++) {
			var title = titles[i].innerText;
			if (!watched.includes(title)) {
				pg.fn.modifyWatchlist(title, q);
				watched.push(title);
			}
		}
		var titles = document.getElementsByClassName("mw-newpages-pagename");
		var len = titles.length;
		for (var i = 0; i < len; i++) {
			var title = titles[i].innerText;
			if (!watched.includes(title)) {
				pg.fn.modifyWatchlist(title, q);
				watched.push(title);
			}
		}
	} else if (mw.config.get('wgCanonicalNamespace') === "Category") {
		$(".mw-category-generated a").each(function(i,e){
			if (e.classList.contains("CategoryTreeLabelCategory")) {
				pg.fn.modifyWatchlist("Category:"+e.innerText, q);
			} else {
				pg.fn.modifyWatchlist(e.innerText, q);
			}
		});
	}
}

})();
