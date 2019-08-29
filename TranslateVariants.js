// <nowiki>
/* globals TranslateVariants:true */
/**
 * 使用說明請見 https://zh.wikipedia.org/wiki/User:Xiplus/js/TranslateVariants
 */
(function() {

	if (mw.config.get('wgPageName').match(/^MediaWiki:[^/]+(\/zh)?$/)) {
		mw.loader.using(['mediawiki.api', 'mediawiki.ForeignApi']).then(function() {
			let link = mw.util.addPortletLink(
				'p-cactions',
				'#',
				'轉換變體'
			)
			$(link).on('click', function() {
				this.remove();
				main();
			});
		});
	} else {
		return;
	}

	if (typeof (TranslateVariants) == 'undefined') {
		TranslateVariants = {};
	}
	if (typeof (TranslateVariants.summary) != 'string') {
		TranslateVariants.summary = '自動轉換變體自[[$1]] via [[User:Xiplus/js/TranslateVariants.js|TranslateVariants]]'
	}

	function main() {
		const langs = ['zh', 'zh-hans', 'zh-cn', 'zh-my', 'zh-sg', 'zh-hant', 'zh-hk', 'zh-mo', 'zh-tw'];
		const langname = {
			'zh': '原始',
			'zh-hans': '简体',
			'zh-cn': '大陆简体',
			'zh-my': '大马简体',
			'zh-sg': '新加坡简体',
			'zh-hant': '繁體',
			'zh-hk': '香港繁體',
			'zh-mo': '澳門繁體',
			'zh-tw': '臺灣正體'
		}
		let result = {};

		var api = new mw.Api();
		var zhwpapi;
		if (mw.config.get('wgDBname') === 'zhwiki') {
			var zhwpapi = new mw.Api();
		} else {
			var zhwpapi = new mw.ForeignApi('//zh.wikipedia.org/w/api.php');
		}
		var basepagetext = '';
		let table = $('<div id="TranslateVariants">').prependTo('#bodyContent');
		$('<div style="color:red">提醒：TranslateVariants小工具仍在試驗階段，編輯完成後亦請複查真正做出的編輯是否正確！</div>').appendTo(table);
		var langqueue = [];

		langs.forEach(lang => {
			langqueue.push(lang);
		});

		api.get({
			action: 'query',
			prop: 'revisions',
			rvprop: ['content', 'timestamp'],
			titles: [mw.config.get('wgPageName')],
			formatversion: '2',
			curtimestamp: true
		}).then(function(data) {
			var page, revision;
			if (!data.query || !data.query.pages) {
				return $.Deferred().reject('unknown');
			}
			page = data.query.pages[0];
			if (!page || page.invalid) {
				return $.Deferred().reject('invalidtitle');
			}
			if (page.missing) {
				return $.Deferred().reject('nocreate-missing');
			}
			revision = page.revisions[0];
			return {
				content: revision.content
			};
		}).then(function(data) {
			let text = data.content;
			result['zh'] = text;

			text = text.replace(/[[\]{}<>|:*'_#&\s]/gim, function(s) {
				return "&#" + s.charCodeAt(0) + ";";
			});
			text = text.replace(/(&#91;&#91;)((?:(?!&#124;)(?!&#93;).)+?)(&#124;(?:(?!&#93;).)+?&#93;&#93;)/g, '$1-{$2}-$3');
			text = text.replace(/-&#123;(.+?)&#125;-/g, function(s) {
				return s
					.replace('-&#123;', '-{')
					.replace('&#125;-', '}-')
					.replace(/&#58;/g, ':')
			});
			basepagetext = text;

			process();
		});

		function process() {
			if (langqueue.length === 0) {
				return;
			}

			var lang = langqueue.shift();
			var diffTable = $('<div id="TranslateVariants-diff-' + lang + '">').appendTo(table);
			$('<hr>').appendTo(table);

			const basename = mw.config.get('wgPageName').replace(/\/zh$/, '');
			var targetTitle;
			if (lang == 'zh') {
				targetTitle = basename + '';
			} else {
				targetTitle = basename + '/' + lang;
			}

			var newtext;

			zhwpapi.parse(
				'{{NoteTA|G1=IT|G2=MediaWiki}}<div id="TVcontent">' + basepagetext + '</div>',
				{
					'uselang': lang,
					'prop': 'text'
				}
			).then(function(data) {
				newtext = $('<div/>').html(data).find('#TVcontent').text();

				return api.post({
					action: 'query',
					prop: 'revisions',
					titles: [targetTitle],
					rvdifftotext: newtext,
					formatversion: '2',
				});
			}, function(err) {
				mw.notify('解析' + lang + '時發生錯誤：' + err);
			}).then(function(data) {
				let tool = $('<div><a href="' + mw.util.getUrl(targetTitle) + '">' + lang + '（' + langname[lang] + '）</a>（<a href="' + mw.util.getUrl(targetTitle, { action: 'edit' }) + '">編</a>）</div>').appendTo(diffTable);
				let page = data.query.pages[0];
				if (page.missing) {
					let submit = $('<button style="float: right;">發佈頁面</button>').appendTo(tool);
					submit.on('click', function() {
						this.remove();
						api.create(
							targetTitle,
							{ summary: TranslateVariants.summary.replace(/\$1/g, mw.config.get('wgPageName')) },
							newtext
						).then(function() {
							mw.notify('已編輯 ' + targetTitle);
						}, function(e) {
							mw.notify('編輯 ' + targetTitle + ' 發生錯誤：' + e);
						});
					});
					$('<pre>').html(newtext.replace(/[<>&]/gim, function(s) {
						return "&#" + s.charCodeAt(0) + ";";
					})).appendTo(diffTable);
					return;
				}
				let diff = page.revisions[0].diff.body;
				if (diff == '') {
					$('<span style="float: right;">無變更</span>').appendTo(tool);
				} else {
					let submit = $('<button style="float: right;">發佈變更</button>').appendTo(tool);
					submit.on('click', function() {
						this.remove();
						api.edit(
							targetTitle,
							function() {
								return {
									text: newtext,
									summary: TranslateVariants.summary.replace(/\$1/g, mw.config.get('wgPageName')),
									nocreate: false
								};
							}
						).then(function() {
							mw.notify('已編輯 ' + targetTitle);
						}, function(e) {
							mw.notify('編輯 ' + targetTitle + ' 發生錯誤：' + e);
						});
					});
					$('<table class="diff">').html(diff).prepend('<colgroup><col class="diff-marker"><col class="diff-content"><col class="diff-marker"><col class="diff-content"></colgroup>').appendTo(diffTable);
				}
			}, function(err) {
				mw.notify('取得' + lang + '差異時發生錯誤：' + err);
			}).always(function() {
				process();
			});
		}
	}

})();
// </nowiki>
