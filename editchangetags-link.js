(function() {

	$(".mw-revdelundel-link").each(function(i, e) {
		var url = $(e).find("a").attr("href");
		$("<a>")
			.attr({
				href: mw.util.wikiScript() + "?" + $.param({
					action: 'editchangetags',
					type: mw.util.getParamValue('type', url),
					ids: mw.util.getParamValue('ids', url)
				}),
			})
			.text("編輯標籤")
			.insertAfter($(e).find("a").last())
			.before(" | ");
	});

})();
