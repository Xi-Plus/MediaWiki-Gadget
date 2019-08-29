javascript: (function() {

	var text = '';
	$('a.mw-changeslist-date').each(function(i, e) {
		text += mw.util.getParamValue('oldid', e.href) + '<br>';
	});

	var win = window.open('');
	win.document.body.innerHTML = text;

}
)();
