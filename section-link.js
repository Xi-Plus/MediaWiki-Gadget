(function() {

	mw.util.addCSS(`
	.sectionlink {
		background-color: transparent;
		border: 1px solid #808080;
		float: right;
		font-size: 70%;
		width: 64px;
	}
	`);

	$('.mw-headline').each(function(i, sec) {
		var secname = $(sec).attr('id').replaceAll('_', ' ');
		var value = mw.config.get('wgPageName').replaceAll('_', ' ') + '#' + decodeURIComponent(secname);

		$('<input>')
			.addClass('sectionlink')
			.attr({
				readonly: ''
			})
			.val(value)
			.on('focus', function() {
				this.select();
				var copied;
				try {
					copied = document.execCommand('copy');
				} catch (e) {
					copied = false;
				}
				if (copied) {
					mw.notify('Copied to clipboard.');
				} else {
					mw.notify('Failed to copy to clipboard.', { type: 'error' });
				}
			})
			.insertBefore(sec);

	});

})();
