// <nowiki>
(function() {
	var msgprefix = 'gadget-TranslateVariants-';
	var messages = {
		'translate-btn': '轉換變體',
		'translate-doing': '正在從 $1 進行轉換', // fromlang
		'translate-done': '已從 $1 轉換完成', // fromlang
		'translate-error': '發生錯誤：$1', // error
		'summary': '從[[$1/$2|/$2]]進行轉換', // basepagename, fromlang
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
		var currentlang = mw.config.get('wgPageName').match(/\/(zh-hans|zh-hant|zh-hk)$/);
		if (!currentlang) {
			return;
		}
		currentlang = currentlang[1];
		var basepagename = mw.config.get('wgPageName').replace(/\/(zh-hans|zh-hant|zh-hk)$/, '');

		$('.mw-translate-adder').each(function(i, btn) {
			var otherlink = btn.getAttribute('onclick').match(/"(#other-(zh-hans|zh-hant|zh-hk)-.+?)"/);
			if (!otherlink) {
				return;
			}
			var text = $(otherlink[1]).text();
			var fromlang = otherlink[2];

			var newlink = $('<a>')
				.text(mw.msg(msgprefix + 'translate-btn'))
				.attr('class', 'mw-translate-adder mw-translate-adder-ltr');

			newlink.on('click', function() {
				mw.notify(mw.msg(msgprefix + 'translate-doing', fromlang), { tag: 'TranslateVariants' });

				TranslateVariants(text, currentlang).then(function(newtext) {
					$('#wpTextbox1').val(newtext);

					var summary = mw.msg(msgprefix + 'summary', basepagename, fromlang);
					$('#wpSummary').val(summary);

					mw.notify(mw.msg(msgprefix + 'translate-done', fromlang), { tag: 'TranslateVariants' });
				}, function(err) {
					mw.notify(mw.msg(msgprefix + 'translate-error', err));
				});
			});

			$(btn).after(newlink);
		})
	};

	mw.loader.using(['mediawiki.ForeignApi']).then(function() {
		main();
	});

})();
// </nowiki>
