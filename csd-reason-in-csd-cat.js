javascript:
(function() {

	if (mw.config.get('wgPageName') !== 'Category:快速删除候选') {
		return;
	}

	function main() {
		var api = new mw.Api();
		var addText = window.CategoryMembersIndicator.addText;

		var titlelist = [];
		$('.mw-category-generated a').each(function(i, e) {
			var title = decodeURIComponent(e.href.replace(/^.*?\/wiki\/(.+?)(?:\?.+)?$/, '$1'));
			titlelist.push(title);
		});

		for (var i = 0; i < titlelist.length; i += 50) {
			var titlestr = titlelist.slice(i, i + 50).join('|');
			api.get({
				'action': 'query',
				'format': 'json',
				'prop': 'revisions',
				'titles': titlestr,
				'rvprop': 'content',
			}).done(data => {
				for (i in data.query.pages) {
					var page = data.query.pages[i];
					if (page.missing === undefined) {
						var title = page.title.replace(/ /g, '_');
						var m = page.revisions[0]['*'].match(/{{\s*(?:d|delete|csd|速删|速刪)\s*\|\s*(.+?)\s*}}/i);
						if (m !== null) {
							var m2 = m[1].match(/bot=Jimmy-bot\|([^|}]+)/);
							if (m2 !== null) {
								addText(title, 'cricc-reason', m2[1]);
							} else {
								addText(title, 'cricc-reason', m[1]);
							}
						}
						if (page.revisions[0]['*'].match(/{{\s*Notmandarin\s*\|/i)) {
							addText(title, 'cricc-reason', 'G14');
						}
						if (page.revisions[0]['*'].match(/{{\s*(Nowcommons|Now[ _]+Commons|Ncd|F7)\s*\|/i)) {
							addText(title, 'cricc-reason', 'F7');
						}
						if (page.revisions[0]['*'].match(/{{\s*AFC submission\s*\|/i)) {
							addText(title, 'cricc-reason', 'AFC');
						}
						if ((m = page.revisions[0]['*'].match(/{{\s*(?:hang ?on|有爭議|有争议)\s*\|\s*(.+?)\s*}}/i)) !== null) {
							addText(title, 'cricc-hangon', 'Hangon：' + m[1]);
						}
					}
				}
			}).fail(() => {
				alert('Error!');
			})
		}
	}

	mw.loader.getScript('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/category-members-indicator.js&action=raw&ctype=text/javascript').then(function() {
		main();
	});

})();
