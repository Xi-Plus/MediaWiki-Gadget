/*
 * 修改自 https://zh.wikipedia.org/w/index.php?title=User:WhitePhosphorus/js/rrd.js&oldid=48433837
 */

(function() {

	if (mw.config.get('wgCanonicalSpecialPageName') !== "Contributions") {
		return;
	}

	mw.loader.using(['jquery.ui'], function() {

		var dialog = null,
			config = { 'pagename': '', 'comment': '', 'diffbytes1': '', 'diffbytes2': '' };

		function saveconfig() {
			config.pagename = $('#filterPagename').val();
			config.comment = $('#filterComment').val();
			config.diffbytes1 = $('#filterDiffBytes1').val();
			config.diffbytes2 = $('#filterDiffBytes2').val();
		}

		function main() {
			var html =
				'<div>' +
				'頁面名稱<br>' +
				'<input type="text" id="filterPagename" size="40"><br>' +
				'<br>' +
				'編輯摘要<br>' +
				'<input type="text" id="filterComment" size="40"><br>' +
				'<br>' +
				'<input type="text" id="filterDiffBytes1" type="number" size="10"> &le; 變更大小 &le; <input type="text" id="filterDiffBytes2" type="number" size="10"><br>' +
				'</div>';
			if (dialog) {
				dialog.html(html).dialog("open");
				$('#filterPagename').val(config.pagename);
				$('#filterComment').val(config.comment);
				$('#filterDiffBytes1').val(config.diffbytes1);
				$('#filterDiffBytes2').val(config.diffbytes2);
				return null;
			}
			dialog = $(html).dialog({
				title: '篩選使用者貢獻',
				minWidth: 515,
				minHeight: 150,
				close: saveconfig,
				buttons: [
					{
						text: '篩選',
						click: function() {
							$(this).dialog('close');
							saveconfig();
							filter();
						}
					},
					{
						text: '取消',
						click: function() {
							saveconfig();
							$(this).dialog('close');
						}
					}
				]
			});
		}

		function filter() {
			var regexUsername = null,
				regexComment = null;
			if (config.pagename !== '') {
				regexUsername = new RegExp(config.pagename);
			}
			if (config.comment !== '') {
				regexComment = new RegExp(config.comment);
			}
			$('.mw-contributions-list>li').each(function(i, e) {
				if (regexUsername && !$(e).find('.mw-contributions-title').text().match(regexUsername)) {
					$(e).hide();
					return;
				}
				if (regexComment && !$(e).find('.comment').text().match(regexComment)) {
					$(e).hide();
					return;
				}
				if (config.diffbytes1 && +$(e).find('.mw-diff-bytes').text() < config.diffbytes1) {
					$(e).hide();
					return;
				}
				if (config.diffbytes2 && +$(e).find('.mw-diff-bytes').text() > config.diffbytes2) {
					$(e).hide();
					return;
				}
				$(e).show();
			});
		}

		var $filter = $('<button />', {
			'class': 'mw-ui-button',
			'type': 'button',
			'title': '對使用者貢獻進行篩選',
			'text': '篩選使用者貢獻'
		});
		$filter.on('click', main);
		$filter.appendTo($('.mw-contributions-list').prev());

	});

})();
