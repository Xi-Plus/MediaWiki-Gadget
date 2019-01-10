(function(){

$(".mw-revdelundel-link").each(function(i, e){
	var link = $("<a>")
	.attr({
		href: mw.util.wikiScript()+"?"+$.param({
			action: 'editchangetags',
			type: 'revision',
			ids: mw.util.getParamValue('ids', $(e).find("a").attr("href"))
		}),
	})
	.text("編輯標籤")
	.insertAfter($(e).find("a").last())
	.before(" | ");
});

})();
