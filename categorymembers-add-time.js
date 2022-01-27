javascript:
(function() {
	var CategorymembersAddTime = window.CategorymembersAddTime;
	if (typeof CategorymembersAddTime === 'undefined') {
		CategorymembersAddTime = {};
	}
	if (typeof CategorymembersAddTime.titles !== 'object') {
		CategorymembersAddTime.titles = [
			'Category:快速删除候选',
			'Category:封禁及禁制申诉',
		];
	}

	var pageName = mw.config.get('wgPageName');
	if (CategorymembersAddTime.titles.indexOf(pageName) === -1) {
		return;
	}

	function main() {
		var addText = window.CategoryMembersIndicator.addText;

		var api = new mw.Api();
		var now = new Date();
		var usedTitle = [];

		api.get({
			'action': 'query',
			'list': 'recentchanges',
			'rcprop': 'timestamp|comment',
			'rclimit': 'max',
			'rctype': 'categorize',
			'rctitle': pageName,
		}).done(data => {
			data.query.recentchanges.forEach(row => {
				var m = row.comment.match(/\[\[:([^\]]+)\]\]/);
				if (m) {
					var title = m[1].replace(/ /g, '_');
					if (usedTitle.indexOf(title) === -1 && row.comment.indexOf('已添加至分类') > -1) {
						var current = new Date(row.timestamp);
						var period = (now.getTime() - current.getTime()) / 1000 / 3600;
						if (period >= 72) {
							addText(title, 'cmat-period', Math.round(period / 24) + ' day');
						} else if (period > 1) {
							addText(title, 'cmat-period', Math.round(period) + ' hr');
						} else {
							addText(title, 'cmat-period', Math.round(period * 60) + ' min')
						}
					}
					usedTitle.push(title);
				}
			});
		});
	}

	mw.loader.getScript('https://meta.wikimedia.org/w/index.php?title=User:Xiplus/js/category-members-indicator.js&action=raw&ctype=text/javascript').then(function() {
		main();
	});

})();
