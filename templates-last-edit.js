(function() {

	if (mw.config.get('wgAction') !== 'info') {
		return;
	}

	function main() {
		$('#template-last-edit').remove();

		var api = new mw.Api();

		var templates = [], elmap = [];
		mw.loader.using(['mediawiki.api'], function() {
			$('#mw-pageinfo-templates li>a:first-child').each(function(i, e) {
				var title = $(e).text();
				templates.push(title);
				elmap[title] = e;
			});
		});

		while (templates.length) {
			var chunks = templates.splice(0, 50);
			api.get({
				"action": "query",
				"format": "json",
				"prop": "revisions",
				"titles": chunks.join('|'),
				"rvprop": "timestamp"
			}).done(function(data) {
				for (const pageid in data.query.pages) {
					const page = data.query.pages[pageid];
					if (Object.hasOwnProperty.call(elmap, page.title)) {
						var timestamp = page.revisions[0].timestamp;
						timestamp = timestamp.replace(/^(\d+-\d+-\d+)T(\d+:\d+):\d+Z$/, '$1 $2');
						$(elmap[page.title]).parent().append(timestamp);
					}
				}
			})
		}
	}

	$('<br><button id="template-last-edit">顯示最近編輯日期</button>').on('click', main).appendTo($('#mw-pageinfo-templates>:first-child'));

})();
