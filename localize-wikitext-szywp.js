// <nowiki>
(function() {

	if (mw.config.get('wgAction') !== 'edit') {
		return;
	}

	function main() {

		var zhwpapi = new mw.ForeignApi('//zh.wikipedia.org/w/api.php');

		let text = wpTextbox1.value;

		text = text.replace(/[[\]{}<>|:*'_#&\s]/gim, function(s) {
			return "&#" + s.charCodeAt(0) + ";";
		});
		text = text.replace(/-&#123;(.+?)&#125;-/g, function(s) {
			return s
				.replace('-&#123;', '-{')
				.replace('&#125;-', '}-')
				.replace(/&#124;/g, '|')
				.replace(/&#32;/g, ' ')
				.replace(/&#61;/g, '=')
				.replace(/&#62;/g, '>')
				.replace(/&#58;/g, ':')
		});

		zhwpapi.parse(
			'{{NoteTA|G1=IT|G2=MediaWiki}}<div id="TVcontent">' + text + '</div>',
			{
				'uselang': 'zh-tw',
				'prop': 'text'
			}
		).then(function(data) {
			var newtext = $('<div/>').html(data).find('#TVcontent').text();

			newtext = newtext.replace('#重定向', '#REDIRECT');

			wpTextbox1.value = newtext;
			wpSummary.value = '本地化';
			wpMinoredit.checked = true;
			wpDiff.click();

		}, function(err) {
			mw.notify('解析時發生錯誤：' + err);
		});

	}

	var link = mw.util.addPortletLink('p-namespaces', '#', '本地化');
	$(link).on('click', main);

})();
// </nowiki>
