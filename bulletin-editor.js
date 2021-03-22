/* eslint-disable no-console */
/* global Morebits */
(function() {
	// $(mw.util.addPortletLink('p-cactions', '#', '一条龙服务')).click(function(e) {
	var api = new mw.Api();
	api.get({
		"action": "query",
		"format": "json",
		"prop": "revisions",
		"titles": "Template:Bulletin",
		"utf8": 1,
		"rvprop": "content",
		"rvslots": "main"
	}).done(function(res) {
		var text = Object.values(res.query.pages)[0].revisions[0].slots.main['*'];
		var re = /{{\s*Bulletin\/item\s*\|/gi;
		var m = re.exec(text);
		var $wrapper = $('<div>');

		function copyDataFromParent(item, row) {
			item.find('.be-item-type').val(row.find('.be-row-type').val());
			item.find('.be-item-prefix').val(row.find('.be-row-prefix').val());
			item.find('.be-item-suffix').val(row.find('.be-row-suffix').val());
		}

		function moveToArchive(event) {
			var item = $(event.target).parent();
			copyDataFromParent(item, item.parents('.be-row'));
			$('#be-archiveul').append(item);
		}

		var $table = $('<table>').attr('id', 'be-active-zone').addClass('wikitable').appendTo($wrapper);
		$(`<tr>
			<th style="width: 30px;">type</th>
			<th style="width: 100%;">items</th>
		</tr>`).appendTo($table);
		while (m) {
			var $tr = $('<tr>').addClass('be-row').appendTo($table);
			// console.log(m);
			var tem = Morebits.wikitext.parseTemplate(text, m.index);

			// td 1
			var $type = $('<td>').addClass('be-type-col').appendTo($tr);
			$('<input>').addClass('be-type-text be-row-type').val(tem.parameters[1]).appendTo($type);

			// td 2
			var $itmes = $('<td>').addClass('be-item-col').appendTo($tr);

			var $type = $('<span>').text('Prefix: ').appendTo($itmes);
			$('<input>').addClass('be-item-text be-row-prefix').val(tem.parameters.prefix).appendTo($itmes);

			$('<br>').appendTo($itmes);
			$('<span>').text('Items: ').appendTo($itmes);

			var $ul = $('<ul>').addClass('be-items').appendTo($itmes);
			for (let i = 2; ; i++) {
				if (tem.parameters.hasOwnProperty(i)) {
					var $li = $('<li>').appendTo($ul);
					$('<img>').attr({
						'src': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/OOjs_UI_icon_move.svg',
						'title': '調整順序或移動到其他項目',
					}).appendTo($li);

					// hidden type input
					$('<input>').addClass('be-type-text be-item-type').val(tem.parameters[1]).appendTo($li);

					// hidden prefix input
					$('<input>').addClass('be-item-text be-item-prefix').appendTo($li);

					// item input
					$('<input>').addClass('be-item-text be-item-main').val(tem.parameters[i])
						.attr('placeholder', '空的項目將在保存時自動被忽略')
						.appendTo($li);

					// hidden suffix input
					$('<input>').addClass('be-item-text be-item-suffix').appendTo($li);

					// archive button
					$('<img>').addClass('be-archive-btn').attr({
						'src': 'https://upload.wikimedia.org/wikipedia/commons/7/72/OOjs_UI_icon_tray.svg',
						'title': '存檔',
					}).appendTo($li).on('click', moveToArchive);
				} else {
					break;
				}
			}

			$('<span>').text('Suffix: ').appendTo($itmes);
			$('<input>').addClass('be-item-text be-row-suffix').val(tem.parameters.suffix).appendTo($itmes);

			// console.log(tem);
			m = re.exec(text);
		}

		var $archiveZone = $('<div>').attr('id', 'be-archive-zone').appendTo($wrapper);
		$('<span>').text('存檔區（保存時會自動合併prefix、suffix）').appendTo($archiveZone);
		var $ul = $('<ul>').attr('id', 'be-archiveul').addClass('be-items').appendTo($archiveZone);

		$('#content').html($wrapper);
		$('<style>').html(`
			.be-items {
				list-style-type: none;
				background: #ffffbb;
				min-height: 30px;
			}
			.be-type-text {
				width: 30px;
			}
			.be-item-col .be-item-type,
			.be-item-col .be-item-prefix,
			.be-item-col .be-item-suffix {
				display: none;
			}
			.be-moving .be-item-type,
			.be-moving .be-item-prefix,
			.be-moving .be-item-suffix {
				display: none;
			}
			.be-item-text {
				width: 90%;
			}
			#be-archive-zone .be-archive-btn {
				display: none;
			}
		`).insertBefore($wrapper);


		$(function() {
			var oldList; // eslint-disable-line no-unused-vars
			$('.be-items').sortable({
				start: function(_event, ui) {
					oldList = ui.item.parent();
					ui.item.addClass('be-moving');
				},
				stop: function(_event, ui) {
					if ($('#be-active-zone').has(oldList).length && $('#be-archive-zone').has(ui.item).length) {
						copyDataFromParent(ui.item, oldList.parents('.be-row'));
					}
					ui.item.removeClass('be-moving');
				},
				change: function(_event, _ui) {
				},
				connectWith: ".be-items"
			}).disableSelection();
		});
	}).fail(function(e) {
		mw.notify('載入內容時發生錯誤：' + e, { type: 'error' });
	});
})();
