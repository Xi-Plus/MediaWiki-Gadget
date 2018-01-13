(function(){

if (mw.config.get('wgCanonicalSpecialPageName') === 'Newpages') {
	$(".not-patrolled").each(function(i, e){
		var title = e.children[1].innerText;
		if (title.match(/^User:[^/]+$/) || title.match(/^User:[^/]+\/沙盒$/)) {
			e.style["backgroundColor"] = "#fcc";
		}
	});
}

})();
