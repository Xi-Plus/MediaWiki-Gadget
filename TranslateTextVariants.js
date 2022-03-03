// <nowiki>

(function() {
	window.TranslateTextVariants = function(text, lang) {
		return new Promise(function(resolve, reject) {
			var zhwpapi;
			if (mw.config.get('wgDBname') === 'zhwiki') {
				var zhwpapi = new mw.Api();
			} else {
				var zhwpapi = new mw.ForeignApi(
					'//zh.wikipedia.org/w/api.php',
					{ anonymous: true }
				);
			}

			text = text.replace(/[[\]{}<>|:*'_#&\s]/gim, function(s) {
				return "&#" + s.charCodeAt(0) + ";";
			});
			text = text.replace(/(&#91;&#91;)((?:(?!&#124;)(?!&#93;).)+?)(&#124;(?:(?!&#93;).)+?&#93;&#93;)/g, '$1-{$2}-$3');
			text = text.replace(/-&#123;(.+?)&#125;-/g, function(s) {
				return s
					.replace('-&#123;', '-{')
					.replace('&#125;-', '}-')
					.replace(/&#124;/g, '|')
					.replace(/&#32;/g, ' ')
					.replace(/&#61;/g, '=')
					.replace(/&#62;/g, '>')
					.replace(/&#58;/g, ':');
			});

			zhwpapi.parse(
				'{{NoteTA|G1=IT|G2=MediaWiki}}<div id="TVcontent">' + text + '</div>',
				{
					'uselang': lang,
					'prop': 'text',
				}
			).then(function(data) {
				var newtext = $('<div/>').html(data).find('#TVcontent').text();
				resolve(newtext);
			}, function(err) {
				reject(err);
			});
		});
	};

})();

// </nowiki>
