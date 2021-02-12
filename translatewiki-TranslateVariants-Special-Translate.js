javascript: (function() {
	var msgprefix = 'gadget-TranslateVariants-';
	var messages = {
		'translate-btn': '轉換變體',
		'translate-doing': '正在從 $1 轉換至 $2', /* fromlang, tolang */
		'translate-done': '從 $1 轉換至 $2 已完成', /* fromlang, tolang */
		'translate-error': '發生錯誤：$1', /* error */
		'summary': '從[[$1/$2|/$2]]進行轉換', /* basepagename, fromlang */
	};
	for (const key in messages) {
		if (!mw.messages.exists(msgprefix + key)) {
			mw.messages.set(msgprefix + key, messages[key]);
		}
	}

	var TranslateVariants = function(text, lang) {
		return new Promise(function(resolve, reject) {
			var zhwpapi = new mw.ForeignApi(
				'//zh.wikipedia.org/w/api.php',
				{ anonymous: true }
			);

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
					.replace(/&#58;/g, ':')
			});

			zhwpapi.parse(
				'{{NoteTA|G1=IT|G2=MediaWiki}}<div id="TVcontent">' + text + '</div>',
				{
					'uselang': lang,
					'prop': 'text'
				}
			).then(function(data) {
				var newtext = $('<div/>').html(data).find('#TVcontent').text();
				resolve(newtext);
			}, function(err) {
				reject(err);
			});
		});
	};

	var main = function() {
		var tuxbox = $('.tux-message.open');
		var basepagename = mw.util.getParamValue('title', $(tuxbox).find('.message-tools-edit>a').attr('href')).replace(/\/(.+?)$/, '');
		var reallangmap = {
			'zh-hans': 'zh-cn',
			'zh-hant': 'zh-tw',
			'zh-hk': 'zh-hk',
		};
		var currentlang = $(tuxbox).find('.tux-textarea-translation').attr('lang');
		var tolang = reallangmap[currentlang];

		$(tuxbox).find('.in-other-language').each(function(i, el) {
			var btn = $('<button>')
				.text(mw.msg(msgprefix + 'translate-btn'))
				.appendTo(el);

			var text = $(el).find('.suggestiontext').text();
			var fromlang = $(el).find('.suggestiontext').attr('lang');
			btn.on('click', function() {
				TranslateVariants(text, tolang).then(function(newtext) {
					$(tuxbox).find('.tux-textarea-translation').val(newtext).trigger('input');

					var summary = mw.msg(msgprefix + 'summary', basepagename, fromlang);
					$(tuxbox).find('.tux-input-editsummary').val(summary);

					mw.notify(mw.msg(msgprefix + 'translate-done', fromlang, tolang), { tag: 'TranslateVariants' });
				}, function(err) {
					mw.notify(mw.msg(msgprefix + 'translate-error', err));
				});

				return false;
			});
		});
	};

	mw.loader.using(['mediawiki.ForeignApi']).then(function() {
		main();
	});

})();
