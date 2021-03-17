(function() {

	if (mw.config.get('wgCanonicalSpecialPageName') !== 'Revisiondelete') {
		return;
	}

	$('#mw-content-text>ul>li:not(.mw-logline-delete)').each(function(_, el) {
		var url = $(el).find('a').first().attr('href');
		var diff = mw.util.getParamValue('diff', url);
		var btn = $('<button>').text('Remove').prependTo(el);
		btn.on('click', function() {
			var newurl = new URL(location.href);
			newurl.searchParams.delete('ids[' + diff + ']');
			location.href = newurl.href;
		});
	});
})();
