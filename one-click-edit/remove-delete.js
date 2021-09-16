javascript: (function() {

	new mw.Api().edit(mw.config.get('wgPageName'), function(revision) {
		var content = revision.content;
		content = content.replace(/{{(delete|d)\|.+?}}\n*/, "");
		return {
			text: content,
			summary: '不符快速刪除準則',
		};
	}).then(function() {
		mw.notify('成功');
		location.reload();
	}, function(e) {
		if (e == 'nocreate-missing') {
			mw.notify('頁面不存在');
		} else {
			mw.notify('未知錯誤：' + e);
		}
	});

}
)();
