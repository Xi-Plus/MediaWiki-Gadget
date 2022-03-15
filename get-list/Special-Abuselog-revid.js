javascript: (function () {
	var text = '';
	$('.mw-usertoollinks')
		.parent()
		.find('a:last')
		.each(function (i, e) {
			var revid = mw.util.getParamValue('oldid', e.href);
			if (e.innerText === '差異' && revid) {
				text += revid + '<br>';
			}
		});

	var win = window.open('');
	win.document.body.innerHTML = text;
})();
