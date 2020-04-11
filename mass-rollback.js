javascript:
(function() {

	mw.loader.using(['mediawiki.util']).done(function() {

		if (mw.util.getParamValue('mass-rollback') === null) {
			return;
		}

		var noFlood = (mw.config.get('wgUserGroups').indexOf('sysop') !== -1 && mw.util.getParamValue('bot') === null);

		if (noFlood) {
			mw.notify('警告！沒有啟用 flood（網址 bot=1）')
		}

		function setRollbackSummary() {
			var summary = prompt(wgULS('将本页所有回退链接的自动编辑摘要更改为：', '將本頁所有回退鏈接的自動編輯摘要更改為：'), '');
			if (summary === null) {
				summary = '';
			}
			var urlSummary = '&summary=' + encodeURIComponent(summary);
			for (var i in document.links) {
				if (mw.util.getParamValue('action', document.links[i].href) === 'rollback') {
					if (mw.util.getParamValue('summary', document.links[i].href) === null) {
						document.links[i].href += urlSummary;
					} else {
						document.links[i].href = document.links[i].href.replace(
							'&summary=' + mw.util.getParamValue('summary', document.links[i].href),
							urlSummary
						);
					}
				}
			}
			mw.notify('已將回退摘要改為 ' + summary);
		}

		var summaryLink = mw.util.addPortletLink(
			'p-cactions',
			'#',
			wgULS('自訂回退摘要', '自訂回退摘要')
		);
		$(summaryLink).on('click', setRollbackSummary);

		function rollbackEverything() {
			if (noFlood && !confirm('你沒有啟用 flood（網址 bot=1），要繼續回退嗎？')) {
				return;
			}
			var answer = Math.floor(Math.random() * 90) + 10;
			if (prompt('請輸入以下數字以進行全部回退：\n' + answer) != answer) {
				return;
			}
			for (var i in document.links) {
				if (mw.util.getParamValue('action', document.links[i].href) === 'rollback') {
					window.open(document.links[i].href);
				}
			}
		}

		var rollbackAllLink = mw.util.addPortletLink(
			'p-cactions',
			'#',
			wgULS("回退本页的所有编辑", "回退本頁的所有編輯")
		);
		$(rollbackAllLink).on('click', rollbackEverything);

	});

})();
