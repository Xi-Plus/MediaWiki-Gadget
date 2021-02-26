/* eslint-disable no-console */
// <nowiki>
(function() {

	var updateLinks = function() {
		$('a').each(function(i, e) {
			var shorthref = e.getAttribute('href') || '';
			if (shorthref.match(/^(|#)$/)) {
				return;
			}
			try {
				var url = new URL(e.href);
				if (url.host.match(/\.(wikipedia|wiktionary|wikiquote|wikisource|wikinews|wikivoyage|wikibooks|wikiversity|wikimedia|mediawiki|wikidata)\.org$/)) {
					url.searchParams.set('dtenable', '1');
					e.href = url.href;
				}
			} catch (err) {
				console.error(e, err);
			}
		});
	};

	setTimeout(updateLinks, 1000);

	var url = new URL(window.location.href);
	url.searchParams.set('dtenable', '1');
	mw.util.addPortletLink(
		'p-tb',
		url.href,
		'Enable DiscussionTools',
		't-dtenable'
	);

}
)();
// </nowiki>
