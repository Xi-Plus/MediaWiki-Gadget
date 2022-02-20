/* global TwinkleGlobal */
(function() {
	function main() {
		$('.template-sock-list').each(function(_, template) {
			var usernames = [];
			$(template).find('.template-sock-list-user').each(function(_, checkuser) {
				var username = $(checkuser).attr('data-user');
				if (usernames.indexOf(username) === -1) {
					usernames.push(username);
				}
			});
			if (usernames.length > 0) {
				$(template).find('.template-sock-list-tools').append(' • ');
				$('<a>').text(wgULS('报告到SRCU', '報告到SRCU')).on('click', function() {
					if (typeof TwinkleGlobal === 'undefined') {
						mw.notify(wgULS('您没有安装Twinkle Global', '您沒有安裝Twinkle Global'), { type: 'error' });
					} else {
						TwinkleGlobal.arv.callback(usernames, 'srcu');
						// hack to insert discussion
						var discussion = '[[:w:zh:Special:PermaLink/' + mw.config.get('wgRevisionId') + '|w:zh:' + mw.config.get('wgPageName') + ']]'
						$('.morebits-dialog').find('input[name="discussion"]').val(discussion);
					}
				}).appendTo($(template).find('.template-sock-list-tools'));
			}
		});
	}
	mw.loader.using(['ext.gadget.site-lib']).then(function() {
		main();
	});
})();
