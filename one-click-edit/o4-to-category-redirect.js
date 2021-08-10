javascript: (function() {
	new mw.Api().edit(mw.config.get('wgPageName'), function(revision) {
		return {
			text: revision.content.replace(/[\s\S]*#(?:重定向|REDIRECT) *\[\[\:?(?:Category|Cat|分类|分類):(.+?)\]\][\s\S]*/i, "{{分类重定向|$1}}"),
			summary: '改成分類重定向',
		};
	}).then(function() {
		mw.notify('成功');
		location.reload();
	}, function(e) {
		mw.notify('錯誤：' + e);
	});

})();
