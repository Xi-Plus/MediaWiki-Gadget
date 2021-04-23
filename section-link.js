/**
 * Some codes are copied from https://gerrit.wikimedia.org/g/mediawiki/core/+/a43542143016fadf670625b82832ee917aaded83/resources/src/mediawiki.widgets/mw.widgets.CopyTextLayout.js#73
 */

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
		var pagename = mw.config.get('wgPageName')
			.replaceAll('_', ' ');

		var secname = $(sec).attr('id')
			.replaceAll('_', ' ')
			.replaceAll('{', '&#123;')
			.replaceAll('}', '&#125;');
		secname = decodeURIComponent(secname);

		var value = pagename + '#' + secname;

		$('<input>')
			.addClass('sectionlink')
			.attr({
				readonly: ''
			})
			.val(value)
			.on('click', function() {
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
