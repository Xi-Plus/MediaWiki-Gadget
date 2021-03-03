/* eslint-disable no-console */
// <nowiki>
$(function() {
	var variantList = ['zh-cn', 'zh-tw', 'zh-hk', 'zh-mo', 'zh-sg', 'zh-my'];
	var pickVariant = function() {
		return variantList[Math.floor(Math.random() * variantList.length)];
	};

	var updateLinks = function() {
		$('a').each(function(i, e) {
			var shorthref = e.getAttribute('href') || '';
			if (shorthref.match(/^(|#)$/)) {
				return;
			}
			try {
				var url = new URL(e.href);
				if (url.host.match(/zh\.wikipedia\.org$/)) {
					url.searchParams.set('variant', pickVariant());
					e.href = url.href;
				}
			} catch (err) {
				console.error(e, err);
			}
		});
	};

	updateLinks();
});
// </nowiki>
