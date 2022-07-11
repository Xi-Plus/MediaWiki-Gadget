/* global TwinkleGlobal */
(function() {
	function main() {
		$('.template-sock-list').each(function(_, template) {
			var usernames = [];
			$(template).find('.template-sock-list-user, .template-sock-list-ip').each(function(_, checkuser) {
				var username = $(checkuser).attr('data-user') || $(checkuser).attr('data-ip');
				if (username && usernames.indexOf(username) === -1) {
					usernames.push(username);
				}
			});
			if (usernames.length > 0) {
				$(template).find('.template-sock-list-tools').append(' • ');
				$('<a>').text(wgULS('报告到SRCU', '報告到SRCU')).on('click', function() {
					if (typeof TwinkleGlobal === 'undefined') {
						mw.notify(wgULS('您没有安装TwinkleGlobal', '您沒有安裝TwinkleGlobal'), { type: 'error' });
					} else {
						TwinkleGlobal.arv.callback(usernames, 'srcu');
						// hack to insert discussion
						var discussion = '[[:w:zh:Special:PermaLink/' + mw.config.get('wgRevisionId') + '|w:zh:' + mw.config.get('wgPageName') + ']]'
						var header = mw.config.get('wgPageName').replace('Wikipedia:傀儡調查/案件/', '').replace(/_/g, ' ') + '@zh.wikipedia';
						$('.morebitsglobal-dialog').find('input[name="discussion"]').val(discussion);
						$('.morebitsglobal-dialog').find('input[name="header"]').val(header);
					}
				}).appendTo($(template).find('.template-sock-list-tools'));
			}
		});
	}
	mw.loader.using(['ext.gadget.site-lib']).then(function() {
		main();
	});
})();
