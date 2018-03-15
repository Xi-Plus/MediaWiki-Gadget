javascript:
(function(){

var limit = 250;
$(".comment").each(function(i, e) {
	if (e.innerText.length > limit) {
		$(e).addClass("commentlong")
		$('<a class="hidecomment">展開</a>').insertAfter(e);
		var short = $('<span class="comment commentshort"></span>');
		$(short).text(e.innerText.substr(0, limit+1)+"..."+e.innerText.substr(-1));
		$(short).insertAfter(e);
		$(e.parentElement).find(">.commentlong").hide();
	}
});

$(".hidecomment").click(function(e) {
	if ($(e.target.parentElement).find(">.commentlong").is(":visible")) {
		$(e.target.parentElement).find(">.commentlong").hide();
		$(e.target.parentElement).find(">.commentshort").show();
		$(e.target.parentElement).find(">.hidecomment").text("展開");
	} else {
		$(e.target.parentElement).find(">.commentlong").show();
		$(e.target.parentElement).find(">.commentshort").hide();
		$(e.target.parentElement).find(">.hidecomment").text("收合");
	}
});

})();
