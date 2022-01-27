javascript:
(function() {
	var CategoryMembersIndicator = window.CategoryMembersIndicator;
	if (typeof CategoryMembersIndicator !== 'undefined') {
		return;
	}

	$('.mw-category-generated a').each(function(i, e) {
		var title = decodeURIComponent(e.href.replace(/^.*?\/wiki\/(.+?)(?:\?.+)?$/, '$1'));
		$('<span>').attr('id', 'cmi-item-' + title).insertAfter(e);
	});

	CategoryMembersIndicator = {};
	CategoryMembersIndicator.addText = function(title, className, text) {
		$('<span>').text('（' + text + '）').addClass('cmi-' + className).appendTo(document.getElementById('cmi-item-' + title));
	}

})();
