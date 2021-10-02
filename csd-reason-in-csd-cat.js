javascript:
(function() {

	if (mw.config.get('wgPageName') !== 'Category:快速删除候选') return;

	var api = new mw.Api();
	var now = new Date();

	var titlelist = [];
	$('.mw-category-generated a').each(function(i, e) {
		var title = decodeURIComponent(e.href.replace(/^.*?\/wiki\/(.+?)(?:\?.+)?$/, '$1'));
		$('<span>').attr('id', 'cricc-item-' + title).insertAfter(e);
		titlelist.push(title);
	});
	var addText = function(title, type, text) {
		$('<span>').text('（' + text + '）').addClass('cricc-' + type).appendTo('#cricc-item-' + title.replace(/([():])/g, '\\$1'));
	}

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
							addText(title, 'reason', m2[1]);
						} else {
							addText(title, 'reason', m[1]);
						}
					}
					if (page.revisions[0]['*'].match(/{{\s*Notmandarin\s*\|/i)) {
						addText(title, 'reason', 'G14');
					}
					if (page.revisions[0]['*'].match(/{{\s*AFC submission\s*\|/i)) {
						addText(title, 'reason', 'AFC');
					}
					if ((m = page.revisions[0]['*'].match(/{{\s*(?:hang ?on|有爭議|有争议)\s*\|\s*(.+?)\s*}}/i)) !== null) {
						addText(title, 'hangon', 'Hangon：' + m[1]);
					}
				}
			}
		}).fail(() => {
			alert('Error!');
		})
	}

	var usedTitle = [];
	api.get({
		'action': 'query',
		'list': 'recentchanges',
		'rcprop': 'timestamp|comment',
		'rclimit': '100',
		'rctype': 'categorize',
		'rctitle': 'Category:快速删除候选',
	}).done(data => {
		data.query.recentchanges.forEach(row => {
			var m = row.comment.match(/\[\[:([^\]]+)\]\]/);
			if (m) {
				var title = m[1].replace(/ /g, '_');
				if (usedTitle.indexOf(title) === -1 && row.comment.indexOf('已添加至分类') > -1) {
					var current = new Date(row.timestamp);
					var period = (now.getTime() - current.getTime()) / 1000 / 3600;
					if (period > 1) {
						addText(title, 'period', Math.round(period) + ' hr');
					} else {
						addText(title, 'period', Math.round(period * 60) + ' min')
					}
				}
				usedTitle.push(title);
			}
		});
	})

})();
