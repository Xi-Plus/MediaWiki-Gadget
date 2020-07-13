// <nowiki>
(function() {

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

		$('.mw-translate-adder').each(function(i, btn) {
			var otherlink = btn.getAttribute('onclick').match(/"(#other-(zh-hans|zh-hant|zh-hk)-.+?)"/);
			if (!otherlink) {
				return;
			}
			var text = $(otherlink[1]).text();
			var fromlang = otherlink[2];

			var newlink = $('<a>')
				.text('轉換變體')
				.attr('class', 'mw-translate-adder mw-translate-adder-ltr');

			newlink.on('click', function() {
				mw.notify('正在從 ' + fromlang + ' 進行轉換', { tag: 'TranslateVariants' });

				TranslateVariants(text, currentlang).then(function(newtext) {
					$('#wpTextbox1').val(newtext);
					mw.notify('已從 ' + fromlang + ' 轉換完成', { tag: 'TranslateVariants' });
				}, function(err) {
					mw.notify('發生錯誤：' + err);
				});
			});

			$(btn).after(newlink);
		})
	};

	main();

})();
// </nowiki>
